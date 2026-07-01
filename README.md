# LogShield — SIEM Platform

![Version](https://img.shields.io/badge/version-1.0.0-10b981) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-10b981) ![React](https://img.shields.io/badge/React-18.3-10b981) ![License](https://img.shields.io/badge/license-MIT-10b981)

AI-powered SIEM platform with log ingestion, 8 correlation rules, anomaly detection, forensic search, and real-time alerting.

## Quick Start

```bash
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) and register a new account.

## Features

- **Log Ingestion** — Ingest structured logs from any source via REST API with source and severity tagging
- **Correlation Rules** — 8 built-in detection rules: brute force, SQL injection, port scans, malware, data exfiltration, DDoS, privilege escalation, DNS tunneling
- **Real-Time Alerting** — WebSocket-powered instant alert streaming to dashboard
- **Forensic Search** — Full-text search across ingested logs with source/severity/date filters
- **Threat Scoring** — Auto-calculated severity and risk scores based on correlation hits
- **Compliance-Ready** — Immutable log storage with full audit trail

### Correlation Rules

| Rule | Trigger | Severity |
|------|---------|----------|
| Brute Force | 5+ failed logins in 1 minute | Critical |
| SQL Injection | SQL syntax patterns in request body | High |
| Port Scan | 10+ unique ports in 30 seconds | High |
| Malware Detected | Known malware signature patterns | Critical |
| Data Exfiltration | >1MB outbound in single connection | Critical |
| DDoS | 1000+ requests in 10 seconds from single IP | Critical |
| Privilege Escalation | Admin access from non-admin user | High |
| DNS Tunneling | DNS queries with abnormal payload size | Medium |

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        LogShield System                        │
├────────────┬────────────┬────────────┬────────────┬────────────┤
│   Log      │ Correlation│  Anomaly   │ Forensic   │ WebSocket  │
│  Ingestion │   Engine   │  Detector  │  Search    │ Dashboard  │
├────────────┴────────────┴────────────┴────────────┴────────────┤
│               FastAPI + async SQLAlchemy + Redis                 │
├────────────────────────────────────────────────────────────────┤
│                  PostgreSQL + Redis + Docker Compose              │
└────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, SQLAlchemy (async), asyncpg |
| Frontend | React 18, TypeScript, Vite, Zustand |
| Engine | Correlation rule engine (8 rules) |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Realtime | WebSockets |
| Infra | Docker, Docker Compose, nginx |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/logs` | Ingest a log entry |
| GET | `/api/logs` | List/search logs |
| GET | `/api/logs/stats` | Log statistics |
| GET | `/api/alerts` | List correlation alerts |
| GET | `/api/alerts/stats` | Alert statistics |
| PATCH | `/api/alerts/{id}/status` | Update alert status |
| WS | `/ws/{user_id}` | WebSocket real-time feed |
| GET | `/api/health` | Health check |

## Project Structure

```
LogShield/
├── backend/
│   ├── app/
│   │   ├── core/        # Config, security, database, deps
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic layer
│   │   ├── agents/      # Correlation rule engine
│   │   ├── api/         # Route handlers
│   │   └── main.py      # FastAPI app entrypoint
│   ├── tests/           # Pytest test suite
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── store/       # Zustand state stores
│   │   ├── hooks/       # React hooks (WebSocket)
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Login, Register, Dashboard
│   │   ├── main.tsx     # Entry point
│   │   └── App.tsx      # Router
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://...` | PostgreSQL connection string |
| `REDIS_URL` | `redis://redis:6379/0` | Redis connection string |
| `SECRET_KEY` | `change-me-in-production` | JWT signing key |

## Demo Credentials

Register a new account at `/register` after starting the app.

## License

MIT
