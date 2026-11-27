import { createHydraDbGraphPersistence } from '@ankhorage/graph-hydradb';

/*** Open an explicit server-side HydraDB graph persistence session. @usage @readme @title HydraDB graph persistence */
const persistence = createHydraDbGraphPersistence({ endpoint: 'https://hydradb.example', token: 'server-side-token', namespace: 'architecture', graphId: 'default', cellId: 'cell-0' });
const session = await persistence.openAsync();
console.log(session.capabilities);
await session.closeAsync();
