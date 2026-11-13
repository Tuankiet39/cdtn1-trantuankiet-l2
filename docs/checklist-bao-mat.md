# Security Checklist — L2 Warranty Ticket Prototype

Assessment date: 2026-11-13. This is a prototype self-assessment, not a
penetration test or a claim that the service is production-ready.

| # | Status | Evidence |
| --- | --- | --- |
| 1. No secrets in the repository | **ĐÃ LÀM** | `.env` is ignored in `.gitignore`; `git ls-files .env` and `git log --all -- .env` returned no entries; a tracked-source search found no hard-coded password/secret assignment. `.env.example` contains clearly labeled local demo values only. |
| 2. Input validation at application layer | **ĐÃ LÀM** | `src/validators/ticket.validator.js` validates positive integer IDs and a 1–1,000 character issue description; T11 verifies HTTP 400 and field errors. |
| 3. Ownership access control | **CHƯA LÀM** | The service checks that the device's stored customer ID matches the request (`src/services/ticket.service.js`), and T12 verifies mismatch rejection. There is no authentication; a caller can supply another customer ID, so this is not authenticated authorization. |
| 4. Passwords and sensitive data hashed or encrypted | **CHƯA LÀM** | The prototype has no password/login feature. Customer names and emails are stored as ordinary MySQL columns; transport encryption and encryption at rest are not configured. |
| 5. Error responses do not disclose internals | **ĐÃ LÀM** | Route handlers return generic 500 messages and log only an error code; SQL, stack traces, and connection strings are not returned in HTTP responses (`src/routes/ticket.routes.js`, `src/index.js`). |
| 6. Logs avoid secrets and unnecessary personal data | **ĐÃ LÀM** | Application logging is limited to startup text and error codes in `app.js`, `src/index.js`, and `src/routes/ticket.routes.js`; request bodies and customer/device fields are not logged. |
| 7. Pinned dependencies and basic vulnerability audit | **CHƯA LÀM** | `package-lock.json` is committed for repeatable dependency resolution, but `npm audit` has not been run for this submission. Run and record it before claiming this item complete. |

Unimplemented authentication, data encryption, and vulnerability audit are
known limitations. Do not expose this prototype to the public internet.
