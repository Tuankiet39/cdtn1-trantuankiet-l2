# Warranty Ticket API

This document describes the endpoints currently mounted by the L2 prototype.
Examples are from the automated in-process API tests (Supertest with a test
repository); they are not evidence of a live Docker/MySQL run.

## `GET /health`

1. **Method and path:** `GET /health`
2. **Business behavior:** Confirms that the API process is responding. This is
   a liveness check, not a database-readiness check.
3. **Authentication:** None in this prototype.
4. **Parameters and request body:** None.
5. **Success response (`200`):**

   ```json
   { "status": "ok" }
   ```

6. **Error codes:** No endpoint-specific error response.
7. **Limitations:** A successful response does not prove that MySQL queries
   will succeed.

## `GET /api/tickets`

1. **Method and path:** `GET /api/tickets`
2. **Business behavior:** Lists tickets; optional `q` searches ticket ID,
   customer name, and device serial.
3. **Authentication:** None. Customer-specific access control is not
   implemented.
4. **Parameters and request body:** Optional query parameter `q`, string of at
   most 100 characters; no request body.
5. **Success response (`200`):**

   ```json
   [
     {
       "id": 1,
       "customer_name": "Tran Tuan Kiet",
       "serial_number": "SN123456",
       "status": "In-Warranty"
     }
   ]
   ```

6. **Error codes:** `400 INVALID_QUERY`; `500 INTERNAL_SERVER_ERROR`.
7. **Limitations:** Results are not paginated. The list is not protected by
   authentication. Search uses substring matching.

## `POST /api/tickets`

1. **Method and path:** `POST /api/tickets`
2. **Business behavior:** Validates input and device ownership, computes
   warranty coverage, and stores the ticket in `Received` status.
3. **Authentication:** None. The client-supplied `customer_id` is not an
   authenticated identity; this must not be used as a production authorization
   boundary.
4. **Parameters and request body:** JSON fields `customer_id` (positive
   integer), `device_id` (positive integer), and `issue_description` (1–1,000
   characters).

   ```json
   {
     "customer_id": 1,
     "device_id": 10,
     "issue_description": "Screen issue"
   }
   ```

5. **Success response (`201`):**

   ```json
   {
     "status": "success",
     "data": {
       "ticket_id": 3,
       "customer_id": 1,
       "device_id": 10,
       "issue_description": "Screen issue",
       "warranty_status": "In-Warranty",
       "status": "Received"
     }
   }
   ```

6. **Error codes:** `400 INVALID_FORMAT` or `INVALID_JSON`; `404
   DEVICE_NOT_FOUND`; `500 INTERNAL_SERVER_ERROR`.
7. **Limitations:** There is no authentication, rate limiting, technician
   assignment, idempotency key, or ticket update endpoint. Database failures
   return a generic response; only an error code is logged.
