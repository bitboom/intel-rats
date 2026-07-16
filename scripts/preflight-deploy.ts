import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';

const execFileAsync = promisify(execFile);

export const ASSURANCE_BOUNDARY = 'API checks prove effective target-repo access only; repo-admin issuance is separate human evidence and never machine-bound.';

type DeploymentConfig = {
  production?: boolean;
  repository?: string;
  remoteName?: string;
  tokenEnv?: string;
  deploymentRecord?: string;
  pages?: {
    buildType?: string;
    url?: string;
  };
};

export type PreflightCheck = {
  name: string;
  status: 'pass' | 'blocker';
  detail: string;
};

export type PreflightReport = {
  ok: boolean;
  production: boolean;
  checks: PreflightCheck[];
  assuranceBoundary: string;
};

export type PreflightOptions = {
  root?: string;
  configPath?: string;
  environment?: NodeJS.ProcessEnv;
  fetchImpl?: typeof fetch;
};

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readConfig(configPath: string): Promise<{ config: DeploymentConfig; error?: string }> {
  try {
    return { config: JSON.parse(await readFile(configPath, 'utf8')) as DeploymentConfig };
  } catch (error) {
    return {
      config: {},
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function addCheck(checks: PreflightCheck[], name: string, condition: boolean, pass: string, blocker: string): void {
  checks.push({ name, status: condition ? 'pass' : 'blocker', detail: condition ? pass : blocker });
}

async function hasNamedRemote(root: string, remoteName: string): Promise<boolean> {
  try {
    await execFileAsync('git', ['-C', root, 'remote', 'get-url', remoteName]);
    return true;
  } catch {
    return false;
  }
}

async function apiCheck(
  repository: string,
  token: string,
  pages: NonNullable<DeploymentConfig['pages']>,
  fetchImpl: typeof fetch,
): Promise<string | undefined> {
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const repositoryResponse = await fetchImpl(`https://api.github.com/repos/${repository}`, { headers });
  if (!repositoryResponse.ok) {
    return `GitHub API could not confirm access to ${repository} (${repositoryResponse.status}).`;
  }

  const pagesResponse = await fetchImpl(`https://api.github.com/repos/${repository}/pages`, { headers });
  if (!pagesResponse.ok) {
    return `GitHub API could not read Pages settings for ${repository} (${pagesResponse.status}).`;
  }

  const actualPages = await pagesResponse.json() as { build_type?: string; html_url?: string };
  if (actualPages.build_type !== pages.buildType) {
    return `GitHub Pages build type is ${actualPages.build_type ?? 'unset'}, expected ${pages.buildType}.`;
  }
  if (actualPages.html_url !== pages.url) {
    return `GitHub Pages URL is ${actualPages.html_url ?? 'unset'}, expected ${pages.url}.`;
  }
}

export async function runPreflight(options: PreflightOptions = {}): Promise<PreflightReport> {
  const root = resolve(options.root ?? process.cwd());
  const configPath = resolve(options.configPath ?? 'config/deployment.json');
  const environment = options.environment ?? process.env;
  const { config, error: configError } = await readConfig(configPath);
  const checks: PreflightCheck[] = [];
  const remoteName = config.remoteName ?? 'origin';
  const tokenEnv = config.tokenEnv ?? 'GITHUB_TOKEN';
  const token = environment[tokenEnv]?.trim() ?? '';
  const pagesConfigured = Boolean(config.pages?.buildType && config.pages.url);
  const repositoryConfigured = Boolean(config.repository?.match(/^[^/\s]+\/[^/\s]+$/));

  addCheck(checks, 'Git metadata', await exists(resolve(root, '.git')), 'Local Git metadata is present.', 'Local Git metadata is missing.');
  addCheck(checks, 'Deployment configuration', !configError, 'Deployment configuration was read.', `Deployment configuration is unavailable: ${configError}`);
  addCheck(checks, 'Deployment record', Boolean(config.deploymentRecord?.trim()), 'A deployment record is configured.', 'A deployment record is required.');
  addCheck(checks, 'Named remote', await hasNamedRemote(root, remoteName), `Named remote ${remoteName} is configured.`, `Named remote ${remoteName} is missing.`);
  addCheck(checks, 'Target repository', repositoryConfigured, 'A target repository is configured.', 'A target repository in owner/repository form is required.');
  addCheck(checks, 'Token', Boolean(token), `Token environment variable ${tokenEnv} is present.`, `Token environment variable ${tokenEnv} is missing.`);
  addCheck(checks, 'Pages settings', pagesConfigured, 'Expected Pages settings are configured.', 'Expected Pages build type and public URL are required.');

  if (config.production === true && token && repositoryConfigured && pagesConfigured) {
    try {
      const error = await apiCheck(config.repository!, token, config.pages!, options.fetchImpl ?? fetch);
      addCheck(checks, 'Effective target-repository API access', !error, 'GitHub API confirmed target-repository access and Pages settings.', error ?? 'GitHub API check failed.');
    } catch (error) {
      addCheck(checks, 'Effective target-repository API access', false, '', `GitHub API check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    addCheck(checks, 'Effective target-repository API access', false, '', 'API check was not attempted; production configuration, target repository, Pages settings, and token are all required.');
  }

  return {
    ok: checks.every((check) => check.status === 'pass'),
    production: config.production === true,
    checks,
    assuranceBoundary: ASSURANCE_BOUNDARY,
  };
}

async function main(): Promise<void> {
  const report = await runPreflight({ configPath: process.argv[2] });
  for (const check of report.checks) {
    process.stdout.write(`${check.status.toUpperCase()}: ${check.name} — ${check.detail}\n`);
  }
  process.stdout.write(`ASSURANCE: ${report.assuranceBoundary}\n`);
  if (!report.ok) {
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
