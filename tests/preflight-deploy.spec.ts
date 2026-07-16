import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import { ASSURANCE_BOUNDARY, runPreflight } from '../scripts/preflight-deploy.js';

test('reports every missing deployment prerequisite without making a network call', async () => {
  const root = await mkdtemp(join(tmpdir(), 'preflight-missing-'));
  const configPath = join(root, 'deployment.json');
  await writeFile(configPath, JSON.stringify({ production: false }));
  let fetchCalled = false;

  const report = await runPreflight({
    root,
    configPath,
    environment: {},
    fetchImpl: async () => {
      fetchCalled = true;
      throw new Error('network call must not occur');
    },
  });

  assert.equal(report.ok, false);
  assert.equal(fetchCalled, false);
  assert.deepEqual(
    report.checks.filter((check) => check.status === 'blocker').map((check) => check.name),
    [
      'Git metadata',
      'Deployment record',
      'Named remote',
      'Target repository',
      'Token',
      'Pages settings',
      'Effective target-repository API access',
    ],
  );
  assert.equal(report.assuranceBoundary, ASSURANCE_BOUNDARY);
});

test('treats an unreadable deployment record as a blocker', async () => {
  const root = await mkdtemp(join(tmpdir(), 'preflight-config-'));
  const report = await runPreflight({
    root,
    configPath: join(root, 'missing.json'),
    environment: {},
  });

  assert.equal(report.ok, false);
  assert.equal(report.checks.find((check) => check.name === 'Deployment configuration')?.status, 'blocker');
  assert.equal(report.checks.find((check) => check.name === 'Deployment record')?.status, 'blocker');
});
