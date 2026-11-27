# HydraDB compatibility evaluation

Target: HydraDB `v0.5.0` (release published 2026-11-20). Evidence below combines its published `USING-HYDRADB.md` and real-container acceptance.

Real acceptance: passed on 2026-11-27 using `ghcr.io/hydra-db/hydradb@sha256:6edb164cfe06015443bbc67003c68ee5e04e42b2d4f088779867ff1654b9bc0b` (upstream `v0.5.0`, commit `58390740c6d7`). A node seeded with native scalar properties plus the explicit Ankhorage metadata mapping was retrieved through the published adapter, then retrieved unchanged after `docker restart`.

| Contract area                                        | Status                                                   | Evidence / consequence                                                                                                                                                                                     |
| ---------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTP transport, bearer token, namespace, graph, cell | implemented                                              | Documented `POST /v1/graphs/{graph_id}/query`, bearer token, `X-Graph-Namespace`, and mandatory `cell_id`.                                                                                                 |
| Node lookup                                          | implemented for the explicit Ankhorage ingestion mapping | Typed response cells and scalar parameterization are documented.                                                                                                                                           |
| Traversal                                            | unsupported                                              | Real `algo.SSpaths` returned native edge IDs, endpoints, type and properties, but rejects an empty `relTypes` list. Canonical traversal permits omitted filters, so full conformance cannot be advertised. |
| Atomic mutations                                     | unsupported                                              | Writes are durable per statement; the Bolt transaction implementation documents no multi-statement transaction / rollback.                                                                                 |

The adapter intentionally advertises only `nodes`. Unsupported operations return the canonical `unsupported` result before any write. The package never reads environment variables and never logs tokens or graph data.

The measured traversal query was `CALL algo.SSpaths({sourceNode: 1001, relTypes: ['DEPENDS_ON'], maxLen: 1, relDirection: 'outgoing'}) YIELD path RETURN path`; its typed path included relationship `id`, `edge_type`, `src`, `dst`, and properties. The same procedure without relationship types returned `native path procedures require a non-empty relTypes list`.

The example-only ingestion format reserves four provider properties: `__ankhorage_id`, `__ankhorage_labels`, `__ankhorage_properties`, and `__ankhorage_document`. Native scalar properties must remain native; JSON metadata is only for labels and the optional structured document because HydraDB v0.5.0 documents scalar property values and has no documented label-enumeration projection. This is a limitation to discuss with HydraDB, not a claim of full persistence conformance.

HydraDB is Elastic License 2.0; this adapter is MIT and contains no copied upstream implementation. Managed-service licensing needs separate legal review.
