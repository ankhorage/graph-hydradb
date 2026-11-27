import type { GraphScalar } from '@ankhorage/graph/persistence';

import type { HydraDbGraphPersistenceConfiguration } from '../../../types/config.js';

interface HydraCell {
  readonly type: string;
  readonly value?: unknown;
}
interface HydraResponse {
  readonly columns: readonly string[];
  readonly rows: readonly (readonly HydraCell[])[];
}

/*** Execute one bounded, parameterized HydraDB HTTP query and validate its response envelope. */
export async function executeHydraQueryAsync(input: {
  readonly configuration: HydraDbGraphPersistenceConfiguration;
  readonly query: string;
  readonly parameters: Readonly<Record<string, GraphScalar>>;
}): Promise<HydraResponse> {
  const url = createQueryUrl(input.configuration);
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    input.configuration.timeoutMilliseconds ?? 10_000,
  );
  try {
    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${input.configuration.token}`,
        'Content-Type': 'application/json',
        'X-Graph-Namespace': input.configuration.namespace,
      },
      body: JSON.stringify({
        cell_id: input.configuration.cellId,
        query: input.query,
        parameters: input.parameters,
      }),
    });
    const payload: unknown = await response.json().catch(() => undefined);
    if (!response.ok || !isHydraResponse(payload))
      throw new Error(`HydraDB query failed with HTTP ${response.status}.`);
    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

/*** Construct a secure native HTTP query URL from explicit provider configuration. */
function createQueryUrl(configuration: HydraDbGraphPersistenceConfiguration): string {
  const endpoint = new URL(configuration.endpoint);
  const loopback =
    endpoint.hostname === '127.0.0.1' ||
    endpoint.hostname === 'localhost' ||
    endpoint.hostname === '::1';
  if (
    endpoint.protocol !== 'https:' &&
    !(configuration.allowInsecureLoopbackHttp === true && endpoint.protocol === 'http:' && loopback)
  )
    throw new Error(
      'HydraDB endpoints must use HTTPS unless explicit loopback development HTTP is enabled.',
    );
  return new URL(
    `/v1/graphs/${encodeURIComponent(configuration.graphId)}/query`,
    endpoint,
  ).toString();
}

/*** Narrow an untrusted JSON response to HydraDB's documented success envelope. */
function isHydraResponse(value: unknown): value is HydraResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { columns?: unknown }).columns) &&
    Array.isArray((value as { rows?: unknown }).rows)
  );
}
