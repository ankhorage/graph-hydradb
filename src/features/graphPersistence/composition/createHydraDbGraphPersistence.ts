import type {
  GraphPersistenceOperation,
  GraphPersistencePort,
  GraphPersistenceResult,
  GraphPersistenceSession,
  StoredGraphNode,
} from '@ankhorage/graph/persistence';
import {
  assertGraphPersistenceOperation,
  assertGraphStorageData,
} from '@ankhorage/graph/persistence';

import type { HydraDbGraphPersistenceConfiguration } from '../../../types/config.js';
import { executeHydraQueryAsync } from '../adapters/hydraHttp.js';

/*** Create a server-side HydraDB adapter for the canonical Graph persistence boundary. */
export function createHydraDbGraphPersistence(
  configuration: HydraDbGraphPersistenceConfiguration,
): GraphPersistencePort {
  return {
    openAsync(): Promise<GraphPersistenceSession> {
      let closed = false;
      return Promise.resolve({
        capabilities: ['nodes'],
        async executeAsync(operation: GraphPersistenceOperation): Promise<GraphPersistenceResult> {
          if (closed) throw new Error('The HydraDB graph persistence session is closed.');
          assertGraphPersistenceOperation(operation);
          if (operation.kind !== 'nodes')
            return {
              kind: 'unsupported',
              capability: operation.kind === 'mutate' ? 'mutate' : 'traverse',
            };
          return {
            kind: 'nodes',
            nodes: await Promise.all(
              operation.nodeIds.map((id) => readNodeAsync(configuration, id)),
            ).then((nodes) => nodes.filter((node): node is StoredGraphNode => node !== undefined)),
          };
        },
        closeAsync(): Promise<void> {
          closed = true;
          return Promise.resolve();
        },
      });
    },
  };
}

/*** Read one losslessly mapped canonical node through the documented typed-cell response. */
async function readNodeAsync(
  configuration: HydraDbGraphPersistenceConfiguration,
  id: string,
): Promise<StoredGraphNode | undefined> {
  const response = await executeHydraQueryAsync({
    configuration,
    query:
      'MATCH (n) WHERE n.__ankhorage_id = $id RETURN n.__ankhorage_id AS id, n.__ankhorage_labels AS labels, n.__ankhorage_properties AS properties, n.__ankhorage_document AS document',
    parameters: { id },
  });
  const [row] = response.rows;
  if (row?.length !== 4) return undefined;
  const values = row.map((cell) => cell.value);
  if (values.some((value) => typeof value !== 'string'))
    throw new Error('HydraDB returned malformed canonical node metadata.');
  const [nodeId, labelsText, propertiesText, documentText] = values as [
    string,
    string,
    string,
    string,
  ];
  const labels = JSON.parse(labelsText) as unknown;
  const parsedProperties: unknown = JSON.parse(propertiesText);
  const parsedDocument: unknown = documentText === 'null' ? undefined : JSON.parse(documentText);
  const data: unknown = {
    properties: parsedProperties,
    ...(parsedDocument === undefined ? {} : { document: parsedDocument }),
  };
  if (
    !Array.isArray(labels) ||
    labels.length === 0 ||
    labels.some((label) => typeof label !== 'string')
  )
    throw new Error('HydraDB returned invalid node labels.');
  assertGraphStorageData(data);
  return { id: nodeId, labels: labels as [string, ...string[]], data };
}
