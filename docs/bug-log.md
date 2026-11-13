# L2 Warranty Ticket — Bug Log

The first four defects were identified by inspecting the prototype against
the L2 requirements and corrected in the implementation commit. A fifth
sample-data encoding defect was found during the live Docker smoke check and
corrected in a follow-up seed change. Regression tests were added after the
original fixes; no failing pre-fix test run was recorded.
The fixes are included in [commit 13456e085e0d427dff8bcc131456a3087046c39f](https://github.com/Tuankiet39/cdtn1-trantuankiet-l2/commit/13456e085e0d427dff8bcc131456a3087046c39f).
This commit is local and has not been pushed; the public link will resolve
only after publishing it to the repository.

## BUG-01 — Critical: Application entry point did not expose the L2 API

- **Regression coverage:** T08, T10.
- **Symptom:** The root `app.js` served a hard-coded sample list while
  `src/index.js` only exposed a health endpoint; the warranty service and
  repository were not wired into the running application.
- **Reproduction:** Start the former root entry point and request
  `POST /api/tickets`; there was no warranty-ticket endpoint.
- **Root cause:** The project had multiple standalone Express entry points
  instead of one entry point constructing the MySQL repository, service, and
  route.
- **Fix:** Wire the root entry point to `TicketRepository`, `TicketService`,
  and the Express app factory; serve the L2 UI and ticket routes.
- **Commit and verification:** [13456e085e0d427dff8bcc131456a3087046c39f](https://github.com/Tuankiet39/cdtn1-trantuankiet-l2/commit/13456e085e0d427dff8bcc131456a3087046c39f). Verified by T08 and T10 in `npm test -- --runInBand`.

## BUG-02 — Major: Ticket route still accepted order-shaped requests

- **Regression coverage:** T10, T11.
- **Symptom:** The route exposed `/orders` and called order service methods,
  even though the domain had changed to warranty tickets.
- **Reproduction:** POST a valid L2 payload to `/api/orders`; no ticket was
  created, and the ticket UI endpoint was unavailable.
- **Root cause:** The route and validator had not been updated with the
  domain refactor.
- **Fix:** Replace the order endpoints with `GET /api/tickets` and
  `POST /api/tickets`, and validate customer, device, and issue fields.
- **Commit and verification:** [13456e085e0d427dff8bcc131456a3087046c39f](https://github.com/Tuankiet39/cdtn1-trantuankiet-l2/commit/13456e085e0d427dff8bcc131456a3087046c39f). Verified by T08–T12.

## BUG-03 — Major: Database tables did not match the ticket repository

- **Regression coverage:** T01, T02, T06, T10.
- **Symptom:** The repository queried `Customers`, `Devices`, and `Tickets`,
  while the migration and sample data created `Users`, `Products`, `Orders`,
  and `OrderItems`.
- **Reproduction:** Initialize a fresh database from the previous migration,
  then invoke the ticket repository; required tables were absent.
- **Root cause:** SQL schema and seeds were left over from the earlier
  order-management flow.
- **Fix:** Replace the migration and idempotent sample data with the L2
  customer/device/ticket schema.
- **Commit and verification:** [13456e085e0d427dff8bcc131456a3087046c39f](https://github.com/Tuankiet39/cdtn1-trantuankiet-l2/commit/13456e085e0d427dff8bcc131456a3087046c39f). Service/API tests use a repository double; a separate Docker smoke check confirmed MySQL initialization and reads from `/api/tickets`.

## BUG-04 — Major: Warranty boundary misclassified the final covered day

- **Regression coverage:** T03, T04.
- **Symptom:** Comparing a date-only warranty expiration with a timestamp
  could mark the expiration date as already expired; adding a month to dates
  at month end could also roll into the following month.
- **Reproduction:** Use a purchase date of January 31, a one-month warranty,
  and test February 28 and March 1.
- **Root cause:** The calculation used JavaScript month rollover and compared
  full timestamps rather than calendar dates.
- **Fix:** Clamp month arithmetic to the target month's last day and compare
  date-only values.
- **Commit and verification:** [13456e085e0d427dff8bcc131456a3087046c39f](https://github.com/Tuankiet39/cdtn1-trantuankiet-l2/commit/13456e085e0d427dff8bcc131456a3087046c39f). Verified by T03 and T04.

## BUG-05 — Major: Vietnamese sample names were corrupted on MySQL import

- **Symptom:** The live ticket list displayed customer names as mojibake even
  though the seed file was UTF-8.
- **Root cause:** The SQL import did not explicitly set its connection
  character set before reading non-ASCII literals.
- **Fix:** Set the seed session to `utf8mb4` and re-apply the seed to the
  existing Docker database.
- **Verification:** Imported the seed into an isolated fresh MySQL schema using
  a non-UTF-8 client setting; confirmed the stored UTF-8 bytes and refreshed
  the live UI. Names display as `Trần Tuấn Kiệt` and `Nguyễn Văn A`.
- **Regression coverage:** Manual live MySQL smoke check; no automated
  character-set integration test is included in T01–T12.
