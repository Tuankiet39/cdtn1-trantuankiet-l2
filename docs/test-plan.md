# L2 Warranty Ticket — Test Plan

## 1. Scope and exclusions

The test scope covers request validation, device ownership matching, warranty
date classification, ticket creation, and ticket search through the HTTP
handlers. Authentication, technician assignment, status transitions, load,
UI browser behavior, and MySQL engine behavior are intentionally excluded:
those features are not implemented or are not exercised by the current
automated suite.

## 2. Test levels and selection

The suite contains 7 service unit tests and 5 HTTP API tests, for 12 test
cases. API tests exercise Express routes with Supertest and an in-memory
repository. They do not connect to MySQL. The test data is constructed in each
test run and does not depend on developer-specific data.

Coverage map:

- Correct flows and implemented business rules: T01, T02, T06, T08, T10.
- Both sides of the warranty boundary: T03 (last covered day), T04 (day after).
- Invalid data and safe rejection: T05, T11.
- Ownership mismatch: T06, T12.
- Repeatability: T09 repeats the same search request and compares responses.

## 3. Measurable exit criteria

- All 12 test cases pass with `npm test -- --runInBand`.
- Every implemented business rule QT-03, QT-05, QT-06, and QT-07 is covered by
  at least one test.
- No Critical issue remains open in the implemented intake/search path.
- The test report records actual results and is updated if a subsequent run
  differs.

## 4. Environment and test data

- Node.js 20 or later; dependencies are resolved from `package-lock.json`.
- Run from the repository root with `npm ci` followed by
  `npm test -- --runInBand`.
- Service tests use a fixed clock and repository stubs. HTTP API tests use
  Supertest and a fresh in-memory repository per test.
- No database reset is required. The Docker MySQL sample data is separate from
  this automated suite; this is a known test limitation.
