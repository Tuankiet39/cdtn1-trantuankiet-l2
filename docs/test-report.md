# L2 Warranty Ticket — Test Report

**Recorded run:** 2026-11-13

**Command:** `npm test -- --runInBand`

**Environment:** Node.js, Jest, Supertest; no live MySQL or Docker container

**Result:** 2 suites passed; 12 tests passed; 0 failed.

| ID | Preconditions | Steps | Test data | Expected result | Priority | Actual result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T01 | Device belongs to customer; purchase date is inside its warranty term. | Submit a ticket through the service. | Purchase `2026-01-01`, 12 months; fixed date `2026-11-13`. | Ticket is classified `In-Warranty`, status `Received`. | High | Repository received the expected classification and status. | PASS |
| T02 | Device belongs to customer; warranty term has elapsed. | Submit a ticket through the service. | Purchase `2024-01-01`, 12 months; fixed date `2026-11-13`. | Ticket is classified `Out-of-Warranty`. | High | Repository received `Out-of-Warranty`. | PASS |
| T03 | Device belongs to customer; warranty ends on the test date. | Submit a ticket through the service. | Purchase `2025-01-31`, 1 month; date `2025-02-28`. | Last calendar day remains `In-Warranty`. | High | Repository received `In-Warranty`. | PASS |
| T04 | Device belongs to customer; warranty ended the previous day. | Submit a ticket through the service. | Purchase `2025-01-31`, 1 month; date `2025-03-01`. | Following day is `Out-of-Warranty`. | High | Repository received `Out-of-Warranty`. | PASS |
| T05 | No valid ticket payload. | Call the service with `null`. | `null`. | Reject with `INVALID_INPUT`, HTTP-layer status metadata 400; do not query repository. | High | Rejected with `INVALID_INPUT`; repository was not queried. | PASS |
| T06 | Device lookup returns no owner/device match. | Submit a ticket for a different customer. | Customer 2, device 1. | Reject with `DEVICE_NOT_FOUND`; do not create a ticket. | High | Rejected with `DEVICE_NOT_FOUND`; create was not called. | PASS |
| T07 | Stored device warranty data is malformed. | Submit a ticket for the device. | Purchase date `not-a-date`, 12 months. | Reject as invalid stored data; do not create a ticket. | Medium | Rejected with `INVALID_DEVICE_DATA`; create was not called. | PASS |
| T08 | API has two in-memory ticket records. | Request `GET /health`, then `GET /api/tickets`. | Two records with IDs 1 and 2. | Health returns HTTP 200 and `{"status":"ok"}`; list returns HTTP 200 with both records. | High | Both requests returned HTTP 200 with expected bodies. | PASS |
| T09 | API has a ticket with serial `SN123456`. | Request the same search twice. | `GET /api/tickets?q=SN123456`. | Both responses are HTTP 200 and identical; one matching record. | Medium | Both responses matched and contained one record. | PASS |
| T10 | Customer 1 owns device 10. | `POST /api/tickets` with valid JSON. | Customer 1, device 10, description `Screen issue`. | HTTP 201; ticket has ID 3, `In-Warranty`, and `Received`. | High | HTTP 201; response matched the expected ticket fields. | PASS |
| T11 | API is available. | POST an invalid customer ID and empty description. | Customer ID `"1"`, device 10, empty description. | HTTP 400 `INVALID_FORMAT`, field errors present, no create. | High | HTTP 400; `customer_id` and `issue_description` errors returned. | PASS |
| T12 | Device 10 belongs to customer 1. | POST device 10 under customer 2. | Customer 2, device 10. | HTTP 404 `DEVICE_NOT_FOUND`; response does not disclose serial number. | High | HTTP 404; response contained no serial number. | PASS |

These are automated unit/API results only. They are not evidence of a live
database integration test, browser test, or white-box Docker run.
