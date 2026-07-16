import { createHash } from 'node:crypto';
import { lstat, readdir, readFile } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';

const EXCLUDED_TOP_LEVEL_DIRECTORIES = new Set([
  '.git',
  '.gjc',
  'node_modules',
  'dist',
  'artifacts',
  'test-results',
  'playwright-report',
]);

function toEvidencePath(root: string, filePath: string): string {
  return relative(root, filePath).split(sep).join('/');
}

async function listEvidenceFiles(root: string, directory = root): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name, 'en'))) {
    if (directory === root && entry.isDirectory() && EXCLUDED_TOP_LEVEL_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listEvidenceFiles(root, entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function writeFrame(hash: ReturnType<typeof createHash>, value: string | Buffer): void {
  const bytes = typeof value === 'string' ? Buffer.from(value, 'utf8') : value;
  hash.update(`${bytes.byteLength}:`);
  hash.update(bytes);
}

/** Hashes regular files under root using length-prefixed path and content frames. */
export async function createEvidenceKey(root = process.cwd()): Promise<string> {
  const absoluteRoot = resolve(root);
  const hash = createHash('sha256');
  hash.update('intel-rats-evidence-key-v1\0');

  for (const filePath of await listEvidenceFiles(absoluteRoot)) {
    const stat = await lstat(filePath);
    if (!stat.isFile()) {
      continue;
    }

    hash.update('file\0');
    writeFrame(hash, toEvidencePath(absoluteRoot, filePath));
    writeFrame(hash, await readFile(filePath));
  }

  return hash.digest('hex');
}

async function main(): Promise<void> {
  const root = resolve(process.argv[2] ?? process.cwd());
  process.stdout.write(`${await createEvidenceKey(root)}  ${root}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
