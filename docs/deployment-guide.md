# Deployment Guide

## 1. Requirements

- Docker Engine with Docker Compose v2.20 or later (`docker compose`).
- A supported 64-bit Windows, macOS, or Linux host.
- About 2 GB of free disk space for the MySQL and Node.js images.
- Host port `3000` available.
- Internet access for the first image build. Node.js and MySQL run in
  containers; a host Node.js installation is only needed to run tests locally.

## 2. Build and start

From the repository root, run:

```sh
docker compose up -d --build --wait
```

No `.env` file is required for a local demonstration. Compose applies the
non-production defaults listed below. If a local `.env` file is used, set
`DB_HOST=db` and do not commit it. The API listens on host port 3000.

To stop the services while retaining the sample database:

```sh
docker compose down
```

To delete this project's database volume and recreate the sample data on the
next start:

```sh
docker compose down -v
```

Do not run a global Docker prune command for routine project cleanup.

## 3. Environment variables

| Variable | Purpose | Local sample value | Required |
| --- | --- | --- | --- |
| `PORT` | Host port mapped to the API container's port 3000. | `3000` | No |
| `DB_HOST` | MySQL hostname used by the API. | `db` | No |
| `DB_NAME` | Database name. | `mekong_crm` | No |
| `DB_USER` | Application database user. | `warranty_app` | No |
| `DB_PASSWORD` | Application database password. | `local_dev_password` | No |
| `MYSQL_ROOT_PASSWORD` | MySQL root password used only by the container. | `local_root_password` | No |

These are local demo credentials, not production secrets. Change them through
the host environment or an untracked `.env` file before using a non-local
environment. Never publish real credentials in the repository or container
image.

## 4. Sample data

On the first start with a new Docker volume, MySQL runs
`migrations/001_init_schema.sql` followed by `seeds/001_sample_data.sql`.
The seed contains two customers, two devices, and two tickets: one in warranty
and one out of warranty. Verify the records at `GET /api/tickets`. The SQL
seed statements are safe to re-run for their sample IDs; the Docker
entrypoint itself only runs initialization files when the database volume is
empty.

## 5. Verify the deployment

1. Run `docker compose ps`; both `db` and `api` should show `healthy`.
2. Request `http://localhost:3000/health`; expect HTTP 200 and
   `{"status":"ok"}`. This checks API liveness only.
3. Request `http://localhost:3000/api/tickets`; expect two sample records
   after a fresh start.
4. Open `http://localhost:3000/`; the search page should load.
5. To run the automated suite from the repository root, run
   `npm ci` and then `npm test -- --runInBand`. Expected result: two suites
   and 12 tests pass. The automated tests use an in-memory repository and do
   not replace a live MySQL check.

## Operational limits

The API has no authentication and must not be exposed as a production service.
The health endpoint does not test database connectivity. Database-backed
startup and white-box deployment still need to be verified on a machine with
Docker.
