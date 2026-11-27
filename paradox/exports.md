# Public API

## createHydraDbGraphPersistence

Kind: `function`
Module: `src/features/graphPersistence/composition/createHydraDbGraphPersistence.ts`
Source: `src/features/graphPersistence/composition/createHydraDbGraphPersistence.ts:17:1`

Create a server-side HydraDB adapter for the canonical Graph persistence boundary.

### Signatures

- `(configuration: HydraDbGraphPersistenceConfiguration) => GraphPersistencePort`
  - configuration: `HydraDbGraphPersistenceConfiguration`
  - returns: `GraphPersistencePort`

## HydraDB graph persistence configuration

Symbol: `HydraDbGraphPersistenceConfiguration`

Kind: `type`
Module: `src/types/config.ts`
Source: `src/types/config.ts:7:1`

Configuration for the server-side HydraDB HTTP persistence adapter.

### Members

| Name | Kind | Type | Required | Description |
| --- | --- | --- | --- | --- |
| allowInsecureLoopbackHttp | property | `boolean` | no |  |
| cellId | property | `string` | yes |  |
| endpoint | property | `string` | yes |  |
| graphId | property | `string` | yes |  |
| namespace | property | `string` | yes |  |
| timeoutMilliseconds | property | `number` | no |  |
| token | property | `string` | yes |  |
