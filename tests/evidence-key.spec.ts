import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import { createEvidenceKey } from '../scripts/evidence-key.js';

function emptyEvidenceDigest(): string {
  return createHash('sha256').update('intel-rats-evidence-key-v1\0').digest('hex');
}

test('frames empty evidence with a version marker', async () => {
  const root = await mkdtemp(join(tmpdir(), 'evidence-key-empty-'));
  await mkdir(join(root, 'dist'));
  await writeFile(join(root, 'dist', 'ignored.txt'), 'generated');

  assert.equal(await createEvidenceKey(root), emptyEvidenceDigest());
});

test('hashes sorted file paths and length-framed content', async () => {
  const root = await mkdtemp(join(tmpdir(), 'evidence-key-content-'));
  await writeFile(join(root, 'b.txt'), 'first');
  await writeFile(join(root, 'a.txt'), 'second');
  const first = await createEvidenceKey(root);

  await writeFile(join(root, 'a.txt'), 'changed');
  const changed = await createEvidenceKey(root);
  assert.notEqual(changed, first);

  await mkdir(join(root, 'node_modules'));
  await writeFile(join(root, 'node_modules', 'ignored.txt'), 'ignored');
  assert.equal(await createEvidenceKey(root), changed);
});
