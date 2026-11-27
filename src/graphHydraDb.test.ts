import { describe, expect, test } from 'bun:test';

import { createHydraDbGraphPersistence } from './graphHydraDb.js';

const configuration = {
  endpoint: 'http://127.0.0.1:8443',
  allowInsecureLoopbackHttp: true,
  token: 'secret',
  namespace: 'default',
  graphId: 'default',
  cellId: 'cell-0',
};

describe('createHydraDbGraphPersistence', () => {
  test('returns canonical unsupported results without transport writes', async () => {
    const session = await createHydraDbGraphPersistence(configuration).openAsync();
    expect(session.capabilities).toEqual(['nodes']);
    expect(session.executeAsync({ kind: 'mutate', mutations: [] })).resolves.toEqual({
      kind: 'unsupported',
      capability: 'mutate',
    });
    expect(
      session.executeAsync({
        kind: 'traverse',
        startNodeIds: ['a'],
        direction: 'outgoing',
        maxDepth: 1,
        pageSize: 1,
      }),
    ).resolves.toEqual({ kind: 'unsupported', capability: 'traverse' });
  });
});
