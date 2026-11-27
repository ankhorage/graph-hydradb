# HydraDB compatibility evaluation

Target: HydraDB `v0.5.0` (release published 2026-11-20). Evidence below is from its published `USING-HYDRADB.md` and `cypher-compat.md`; real-container acceptance remains pending.

| Contract area                                        | Status                                                   | Evidence / consequence                                                                                                                                         |
| ---------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTP transport, bearer token, namespace, graph, cell | implemented                                              | Documented `POST /v1/graphs/{graph_id}/query`, bearer token, `X-Graph-Namespace`, and mandatory `cell_id`.                                                     |
| Node lookup                                          | implemented for the explicit Ankhorage ingestion mapping | Typed response cells and scalar parameterization are documented.                                                                                               |
| Traversal                                            | unsupported                                              | Published path encoding does not expose stable relationship metadata sufficient to reconstruct canonical edges, and no snapshot cursor contract is documented. |
| Atomic mutations                                     | unsupported                                              | Writes are durable per statement; the Bolt transaction implementation documents no multi-statement transaction / rollback.                                     |

The adapter intentionally advertises only `nodes`. Unsupported operations return the canonical `unsupported` result before any write. The package never reads environment variables and never logs tokens or graph data.

The example-only ingestion format reserves four provider properties: `__ankhorage_id`, `__ankhorage_labels`, `__ankhorage_properties`, and `__ankhorage_document`. Native scalar properties must remain native; JSON metadata is only for labels and the optional structured document because HydraDB v0.5.0 documents scalar property values and has no documented label-enumeration projection. This is a limitation to discuss with HydraDB, not a claim of full persistence conformance.

HydraDB is Elastic License 2.0; this adapter is MIT and contains no copied upstream implementation. Managed-service licensing needs separate legal review.
