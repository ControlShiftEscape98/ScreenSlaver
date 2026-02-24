---
name: backend-patterns
description: Implements scalable backend architecture, API design best practices, and database optimization for Node.js and Next.js applications.
---

# Backend Architecture Patterns

## Overview
This skill provides the blueprints for building production-grade server-side applications. It focuses on scalability, security, and separation of concerns.

## Allowed Tools
- `npm` / `node`
- `prisma` / `typeorm` / `mongoose`
- `redis-cli`

## Triggers
- Designing new API endpoints.
- Architecting server-side logic or service layers.
- Optimizing database interactions or caching.

## Workflow

1. **Structural Patterns**
   - Implement **Repository Pattern** for data access abstraction.
   - Use **Service Layers** to house core business logic, keeping controllers thin.

2. **Security & Auth**
   - Standardize JWT authentication flows.
   - Implement Role-Based Access Control (RBAC) middleware.

3. **Resilience & Performance**
   - Use **Redis** for caching high-traffic read operations.
   - Implement exponential backoff for external API retries.
   - Prevent N+1 query problems in database fetches.
