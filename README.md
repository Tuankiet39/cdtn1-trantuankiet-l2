# Mekong Mobile — Warranty Ticket Intake (L2)

Node.js/Express prototype for receiving warranty tickets, checking a device's
registered customer, classifying warranty coverage, and searching tickets.
Student: Trần Tuấn Kiệt (2374802010263), Software Engineering track.

## Run the application

Requires Docker Engine and Docker Compose v2. From the repository root, run
these two commands:

```sh
docker compose up -d --build --wait
docker compose ps
```

The API and UI are available at `http://localhost:3000`; liveness is at
`http://localhost:3000/health`. On the first run, MySQL loads the schema and
two sample tickets. See [docs/deployment-guide.md](docs/deployment-guide.md)
for environment variables, expected output, and limitations.

## Run automated tests

Requires Node.js 20 or later:

```sh
npm ci
npm test -- --runInBand
```

The suite contains 7 service unit tests and 5 HTTP API tests. API tests use an
in-memory repository and do not replace a live MySQL deployment check.

## Project layout

- `src/routes`, `src/services`, `src/repositories`, `src/validators`: L2 API.
- `src/client`: browser search UI.
- `migrations/`, `seeds/`: MySQL schema and idempotent sample data.
- `tests/`: service and HTTP API tests.
- `docs/`: requirements, test plan/report, bug log, deployment guide, security
  checklist, and API contract.

The prototype has no authentication and is not production-ready. Review
[docs/checklist-bao-mat.md](docs/checklist-bao-mat.md) before deployment.
