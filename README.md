# Event-Driven Transaction Processing Service

> Resilient Node.js microservice that processes high-volume financial events with strong consistency, idempotency, and observability.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Redis](https://img.shields.io/badge/Redis-7-red)
![MySQL](https://img.shields.io/badge/MySQL-8-orange)
![BullMQ](https://img.shields.io/badge/BullMQ-Queue-blue)
![Docker](https://img.shields.io/badge/Docker-ready-blue)

## Overview

This service ingests financial transaction events via a message queue, processes them reliably, and persists the results with strong consistency guarantees.

**Key capabilities:**
- High-throughput event processing with BullMQ + Redis
- Exactly-once / at-least-once processing with idempotency keys
- MySQL as the source of truth
- Structured error handling + dead-letter queue support
- Horizontal scaling ready (multiple workers)
- Observability hooks (structured logs + job metrics)

## Architecture

External Systems / API
        │
        ▼
┌───────────────────┐
│  Transaction API  │  (optional producer)
└─────────┬─────────┘
          │ enqueue
          ▼
┌───────────────────┐
│   Redis + BullMQ  │  (Queue + Idempotency store)
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Worker Processes │  (stateless, scalable)
│  - Validate       │
│  - Idempotency    │
│  - Business logic │
│  - Persist        │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│      MySQL        │  (Source of Truth)
└───────────────────┘


### Design Decisions & Trade-offs

| Decision | Why | Trade-off |
|----------|-----|---------|
| BullMQ + Redis | Reliable, Redis-backed queue with retries, delays, and concurrency control | Additional infrastructure dependency |
| Idempotency key in Redis | Prevents duplicate processing of the same transaction | Short TTL window (configurable) |
| MySQL transactions | Strong consistency for financial data | Slightly higher latency than pure eventual systems |
| Stateless workers | Easy horizontal scaling | Requires external coordination (Redis) |
| Dead-letter handling | Failed jobs after max retries are isolated for investigation | Manual intervention needed for poison messages |

## Tech Stack

- **Runtime:** Node.js 18+ + TypeScript
- **Queue:** BullMQ
- **Cache / Broker:** Redis
- **Database:** MySQL 8
- **Validation:** Zod
- **Infra:** Docker + Docker Compose

## Quick Start

```bash
git clone https://github.com/olabodeIdowu/event-driven-transaction-service.git
cd event-driven-transaction-service
cp .env.example .env
docker-compose up --build

The worker will start automatically and begin processing jobs from the transactions queue.To enqueue a test transaction:

curl -X POST http://localhost:4100/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "tx_12345",
    "merchantId": "merch_001",
    "amount": 1500.75,
    "currency": "NGN",
    "type": "payment"
  }'

Project Structure

src/
├── config/
│   ├── index.ts
│   ├── database.ts
│   └── redis.ts
├── modules/
│   └── transactions/
│       ├── transaction.schema.ts
│       ├── transaction.service.ts
│       └── transaction.worker.ts
├── producers/
│   └── transaction.producer.ts
├── routes/
│   └── transaction.routes.ts
├── utils/
│   └── logger.ts
├── app.ts
└── server.ts

What I OwnedEnd-to-end design of the event-driven flow
Idempotency and consistency strategy
Worker concurrency and retry configuration
Error handling and dead-letter approach
Dockerized local development experience
Clear separation between producer and consumer

Observability & ReliabilityStructured logging for every job lifecycle event
Configurable retry attempts with exponential backoff
Failed jobs moved to a dead-letter queue after max attempts
Health check endpoint for container orchestration

Future ImprovementsAdd OpenTelemetry tracing
Introduce schema registry for events
Support multiple event types with a proper event bus
Add Prometheus metrics exporter
Implement outbox pattern for even stronger guarantees



