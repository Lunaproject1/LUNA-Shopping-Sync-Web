# TUGI schema 2 — append-only operations

Operational spreadsheet: `1XqsIs_fp_nAOHNP7H5FVWO6usFInSCFXnCDSt6ov9eA`. Read/write only the exact TUGI tables below. Never change another application's sheets, columns or rows.

| Sheet | sheetId | Columns |
|---|---:|---|
| Tugi_Operations_v2 | 1886101601 | operation_id, part_index, part_count, sha256, entity_type, entity_id, dog_ids_json, created_at, payload_part |
| Tugi_Metadata_v2 | 1886101602 | key, value, schema |

Metadata contract: `contract / luna-tugi-append-log-v2 / 2`. The client validates exact headers and metadata before writing and obtains the verified sheetId. Both tabs were added at the end of the existing spreadsheet in one atomic batch, with no existing tab targeted. Data starts in row 2; headers and cells are literal strings.

Each immutable operation is canonical JSON: schema, id (UUID except deterministic bootstrap), entityId, kind (dog/progress/session/observation/health/event/attachment/plan/walk), dogIds, parents, deleted, at (UTC), clientId, value. Stable dog/entity IDs do not depend on names. A revision's dog association cannot change. Parents must belong to the same entity/kind and be present. Cycles, duplicate/divergent operation IDs, orphan dogs and invalid values are rejected. Main Tugi profile cannot be deleted.

Payloads are split into <=30,000 UTF-16 code-unit parts, <=100 parts per operation. All parts share the canonical payload's SHA-256. `appendCells` writes whole operations atomically at column A; batches up to 100 rows never split an operation. A response lost after server commit is recovered by read-back and operation-ID deduplication; retries do not invent new operation IDs. Exact duplicate rows are tolerated; conflicting duplicates and missing parts block acknowledgement, preserving local data.

Projection uses revision-graph heads. Two independent edits create two heads and a visible conflict, including edit/delete races. Resolving creates a new operation whose parents are all compared heads; previous versions remain available. No timestamp wins automatically. Tombstones support recovery. No physical deletion or compaction is implemented.

Sync: validate schema → read/decode/checksum → merge transactionally → append missing local operations → reread all TUGI operations → compare canonical payloads → acknowledge only confirmed IDs → report conflicts/pending changes separately. Operations created during upload stay pending. Concurrent edits may become visible on the next pull; global quiescence is not claimed.

Attachments are private payloads in the same contract, limited to 2 MiB and verified image/PDF signatures. OAuth scope: spreadsheets only. Tokens are never persisted, exported or cached.

This changes the unimplemented mutable-table proposal in TEST 0.1.9, which had no cloud records to migrate. No operational records were migrated, repaired or deleted. Rollback: retain these tabs, export JSON, redeploy a prior TUGI-only Site version when available; never truncate the log or delete other tabs. An older UI must not write an incompatible schema.

Limits: append-only history grows. Google quotas/cell limits cause errors with local pending data retained. Google account ACLs govern access to the spreadsheet, without per-row authorization. Direct-browser OAuth/write/read-back and multi-device acceptance remain unverified.
