# Software Requirements — Warranty Ticket Intake (L2)

- **Student:** Trần Tuấn Kiệt — 2374802010263
- **Track:** Software Engineering (Node.js)
- **Business flow:** L2 — Warranty ticket intake and classification

## 1. Purpose and scope

The prototype records warranty requests for registered devices, verifies that
the device belongs to the supplied customer, and classifies warranty coverage
from the purchase date and warranty duration. Staff can search the received
ticket list by ticket ID, customer name, or device serial number.

The prototype does not implement login, authenticated customer identity,
technician assignment, ticket status updates, email notifications, or a
production deployment.

## 2. Business rules

| ID | Rule |
| --- | --- |
| QT-03 | A ticket can only be created when the device exists and is registered to the supplied customer ID. |
| QT-05 | Warranty coverage is `In-Warranty` through the final calendar day of `purchase_date + warranty_months`; later dates are `Out-of-Warranty`. |
| QT-06 | A new ticket is stored with status `Received` and a non-empty issue description of at most 1,000 characters. |
| QT-07 | Ticket search matches the ticket ID, customer name, or device serial number. |

## 3. Interfaces

| Method and path | Description |
| --- | --- |
| `GET /health` | Liveness response for the API process. |
| `GET /api/tickets?q={text}` | List warranty tickets; `q` is optional and limited to 100 characters. |
| `POST /api/tickets` | Validate ownership, classify coverage, and create a ticket. |

The API uses JSON. IDs must be positive integers. The database is MySQL 8.4;
the repository uses parameterized SQL queries.

## 4. Data entities

- `Customers`: customer name and unique email.
- `Devices`: owning customer, unique serial number, purchase date, and warranty
  duration in months.
- `Tickets`: customer/device references, issue description, warranty
  classification, workflow status, and creation timestamp.

## 5. Acceptance criteria

1. A registered device belonging to the customer can create a ticket.
2. The API classifies the final coverage day as covered and the following day
   as out of warranty.
3. Missing, malformed, or overlong request fields are rejected with HTTP 400.
4. An unknown device or customer/device ownership mismatch is rejected without
   creating a ticket.
5. Tickets can be listed and searched by supported fields.
6. The test command runs the unit and HTTP API tests without a live database.
