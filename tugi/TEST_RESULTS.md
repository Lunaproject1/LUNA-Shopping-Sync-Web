# TUGI 0.1.12 TEST — atualização 4, TUG-59, 23 October 2026

Implementation continues e5a78d9 (8816fed/f2f9784/7b48a476/e5a78d9). The TUG-57 5561d0b fetch fix remains byte-for-byte identical. Publication and Android acceptance must be read from the latest Linear checkpoint; this report does not assert device acceptance.

## Current technical checks

`npm ci --ignore-scripts`, `npm test` (Node >=22). **49 PASS / 0 FAIL**, 20 core, 20 UI/jsdom, 4 service-worker VM, 4 controlled updater DOM, 1 release invariants. Production JS syntax and `git diff --check` pass. Runtime has no npm dependency.

New coverage: avatar picker lists all real profiles and independent recent photos; Escape/outside dismissal; each data module is isolated by selected dog; selection survives IndexedDB close/reopen; exact four-entry navigation and retained modules; quick form saves only visible required inputs with no invented success measurements; repeat uses new IDs, resets outcomes and explicitly selects participants; double submission does not duplicate; command groups/quick state preserve context reliability; contextual forms retain nonempty values; two IndexedDB clients atomically reject duplicate dog names; deleted-dog fallback; actual upload/invalid signature/reselect photo; dirty/stale form cannot write into a different dog.

The OAuth UI and actual SheetsTransport/SyncEngine are exercised against an isolated synthetic HTTP implementation: native Window receiver guard, schema checks, appendCells, exact read-back, two clients and two dogs/photos; repeated requests are idempotent. HTTP 403, network failure and server dropping writes keep the local queue and never claim cloud confirmation. Offline reopen, CRUD and checksummed backup survive; reconnect acknowledges only read-back data. **No real Google service was contacted or operational LUNA Data written for these tests.** These checks do not prove live OAuth or Android cloud sync.

Frozen SHA-256 checks retain sync.js, manifest and Android PNGs from update 3. Core implementation differs only in VERSION; DB name `luna-tugi-v2`, schema 2 and IDB version 1 remain. Updater keeps same origin, explicit activation, no unregister/new registration/storage clearing. Worker VM verifies cache whitelist/offline shell, error responses and preservation of other apps' caches. Source tree contains only tugi/ changes.

## Required Android acceptance (not executed in this environment)

Update existing installation in its original Brave via /update/?r=tug59-r4; verify 0.1.12 TEST / update 4 and retained old records. Exercise tap targets/layout, avatar switching/photos and reopened active dog. Create/edit offline, reconnect and use actual Google consent/account, verify pending queue/read-back, second device/concurrent edits and backup restore with synthetic/private data. No reinstall/data clearing/main/SAFE. Remote browser test in preceding TUG-57 work timed out; there is no rendered-browser PASS in this report.

## Test changes and failures during development

First candidate: 34/36; two old layout expectations (six quick tiles/five nav slots and removed health tile) failed and were updated to the approved TUG-59 arrangement without removing coverage. Expanded suite: 41/43; corrected test selectors (hidden home metric vs stats metric, picker already open) after inspection. All final tests pass; no unresolved technical failure is hidden. No Android/OAuth result inferred from this.

---

## Historical baseline evidence (preserved)

# TUGI 0.1.11 TEST — evidence, 16 October 2026

Functional candidate, not accepted/SAFE. Publication/OAuth/Android status must be read from the latest Linear checkpoint.

## Executed

Node v24.19.0; jsdom 30.1.3; fake-indexeddb 6.2.5. Production JavaScript syntax checked. Full suite: **32 PASS / 0 FAIL**. Test dependencies are development-only; the deployed runtime uses no npm dependencies.

20 core cases: truthful bootstrap; IndexedDB transaction/reopen/concurrent tabs; quota/corruption preservation; invalid dates/metrics/IDs/relationships; dog isolation/shared events; trash/history/Tugi protection; checksummed backup with attachments; malicious MIME/oversize; cloud chunks/checksum/duplicate collisions; read-back/idempotence; false ACK; interruption after server commit; concurrent clients/conflict resolution; edits during upload; 2 MiB attachment atomic batches/partial detection; appendCells/literal formulas; both legacy formats; prototype-pollution keys/immutable dog association; Unicode-safe chunk boundaries; repeated legacy import identity.

8 DOM cases: all modules/approved icons; Ares/Jessa optional profiles; session/ABC/health/walk/calendar CRUD and re-opening; command measurements/custom/search; invalid form preservation/inert XSS; manifest identity/scope/assets/PNG dimensions; custom command editing/archival and measured accessible trend charts. These are jsdom behavior tests, not a rendered browser.

4 worker VM cases: shell/offline assets; no interception of other apps/Google/auth/query requests; own-cache cleanup/HTTP-error protection; no forced skipWaiting. Simulated worker/cache behavior is not installability proof.

## Real Google Sheets — isolated data

Fixture spreadsheet `1H1Gf0XHsyWDEcv7vQJ-aspMSxLXYSazzU0EpZIn68R8`, new tab `TUGI_Synthetic_16Oct` (1498877056). Existing `Audit` tab preserved. Actual encoder's two synthetic operations → appendCells → read-back A1:I5 → decode/SHA-256/full comparison: **PASS**. Included Unicode, formula-like text and inert HTML-like text. Transport: authenticated Google connector, **not application OAuth/fetch**.

Operational setup: only added `Tugi_Operations_v2` (1886101601, header A1:I1; no synthetic/clinical rows) and `Tugi_Metadata_v2` (1886101602, A1:C3) to LUNA Data. Exact schema read back. Prior 15 tab properties compared unchanged; no write referenced their sheetIds. This is targeted isolation evidence, not a full operational content snapshot.

## Not executed / acceptance gates

- Real Chrome/Brave/Android rendering, keyboard, touch, portrait/landscape/tablet/PC or accessibility inspection.
- PWA first install, standalone launch, private-host sign-in, worker control, airplane mode and update via the same icon.
- Google OAuth on the new origin. Google Cloud client-origin administration is not exposed by current tools; authorization is not assumed.
- Installed-device local → cloud → second device → conflict → resolution → re-open; expired auth/interrupted network in a real browser.
- Owner's real prototype backup/documents, Google quota exhaustion or large operational history; synthetic equivalents only.
- External calendars/background notifications are not enabled; reminders appear on application opening.

## Device acceptance

1. Open fixed HTTPS URL, authenticate as owner if requested, install, confirm icon/standalone start. Keep prototype JSON.
2. Create clearly synthetic records/optional dog; save/close/reopen and compare fields/line breaks/checkboxes.
3. Go offline, edit/create, close/reopen, export a backup including a small image/PDF; validate import preserves history.
4. Authorize the exact origin in Google OAuth, connect, sync and verify actual TUGI rows. Pull on a second device. Do not use other apps' tables.
5. Edit the same record offline on two devices; reconnect, compare both versions, resolve and inspect history. Test deletion/restoration and auth failure with queue retained.
6. After a future TUGI-only TEST update, close all windows and reopen the same icon; confirm version/data. Keep main/SAFE/PR #21 isolated.

No absence-of-bugs, SAFE approval, cloud acceptance or Android approval follows from automated results.
