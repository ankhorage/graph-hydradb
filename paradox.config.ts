import { defineParadoxConfig } from '@ankhorage/paradox';

export default defineParadoxConfig({
  mode: 'write',
  docs: {
    title: '@ankhorage/graph-hydradb',
    description: 'Native HydraDB HTTP persistence adapter for the canonical Ankhorage graph port.',
  },
  package: { root: '.', entrypoints: ['src/graphHydraDb.ts'] },
  output: { dir: './paradox' },
});
