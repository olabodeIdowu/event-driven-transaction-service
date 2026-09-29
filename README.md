# event-driven-transaction-service

```markdown
# Event-Driven Transaction Processing Service

Resilient Node.js microservice that processes high-volume financial events with strong consistency and observability.

## Features
- Message queue based processing
- Exactly-once semantics where possible
- Redis for idempotency keys
- MySQL as source of truth
- Structured logging + metrics

## Tech Stack
Node.js • TypeScript • Redis • BullMQ / RabbitMQ • MySQL • Docker

## How to Run
```bash
docker-compose up --build
