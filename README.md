# LogShield

> AI-powered SIEM platform with log ingestion, correlation rules, anomaly detection, forensic search, and real-time alerting.

## Features

- **Log Ingestion** — Ingest structured logs from any source via REST API
- **Correlation Rules** — 8 built-in rules (brute force, SQLi, port scans, malware, data exfiltration, etc.)
- **AI Anomaly Detection** — Rule-based correlation engine for real-time threat detection
- **Forensic Search** — Full-text search across ingested logs with source/severity filters
- **Real-Time Alerts** — WebSocket-powered instant alert streaming
- **Compliance-Ready** — Immutable log storage with full audit trail

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + Python 3.12 + async SQLAlchemy |
| Frontend | React 18 + TypeScript + Zustand |
| Engine | Correlation rule engine |
| Database | PostgreSQL + Redis |
| Infra | Docker Compose |
| Auth | JWT + bcrypt |
| Realtime | WebSockets |

## Quick Start

```bash
git clone https://github.com/ab069/LogShield.git
cd LogShield
docker compose up -d
open http://localhost:3000
```

## License MIT
