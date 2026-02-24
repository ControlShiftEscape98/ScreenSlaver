---
name: error-handling-patterns
description: Applies robust error handling patterns across Python, TypeScript, Rust, and Go — including custom exception hierarchies, Result types, retry logic, circuit breakers, and graceful degradation. Use when implementing error handling, debugging failures, designing resilient APIs, or improving application reliability.
---

# Error Handling Patterns

Build resilient applications that handle failures gracefully and provide excellent debugging experiences.

## When to Use This Skill

- Implementing error handling in new features or bug fixes
- Designing error-resilient APIs and service boundaries
- Debugging production failures or unexpected behavior
- Adding retry, fallback, or circuit breaker logic
- Writing better error messages for users and developers
- Handling async/concurrent errors correctly
- Building fault-tolerant distributed systems

## Core Decision: Which Pattern to Use?

| Scenario | Pattern |
|---|---|
| Unexpected / exceptional conditions | Exceptions (try/catch) |
| Expected failures, validation, API results | Result / Either types |
| Nullable values | Option / Maybe types |
| Unrecoverable bugs | Panic / crash (fail fast) |

## Workflow Checklist

When implementing error handling on any task:

- [ ] Classify errors: recoverable vs. unrecoverable
- [ ] Define a typed error hierarchy (see `resources/exception-hierarchy-design.md`)
- [ ] Handle at the right layer — catch where you can meaningfully respond
- [ ] Write helpful error messages (see `resources/error-message-guide.md`)
- [ ] Clean up resources in `finally` / context managers / `defer`
- [ ] Log appropriately — errors get logged; expected failures do not spam logs
- [ ] Add retry logic for transient failures (network, rate limits)
- [ ] Add circuit breakers at external service boundaries
- [ ] Review against `resources/error-handling-checklist.md` before marking done

## Language-Specific Instructions

### Python
- Build a custom exception hierarchy from a single `ApplicationError` base class
- Use `@contextmanager` for resource cleanup
- Use the `@retry` decorator with exponential backoff for network calls
- See full patterns → `resources/exception-hierarchy-design.md`

### TypeScript / JavaScript
- Extend `Error` with typed `ApplicationError`, `ValidationError`, `NotFoundError`
- Use the `Result<T, E>` pattern for operations that predictably fail
- Always handle unhandled promise rejections; use `.catch()` on all Promise chains
- See full patterns → `resources/async-error-handling.md`

### Rust
- Use `Result<T, E>` and `Option<T>` exclusively — no exceptions
- Implement `From<ErrorType>` traits for automatic error conversion
- Use the `?` operator to propagate errors cleanly up the call stack

### Go
- Return `(value, error)` pairs explicitly; never ignore errors
- Use sentinel errors (`var ErrNotFound = errors.New(...)`) for comparison
- Wrap errors with context: `fmt.Errorf("context: %w", err)`
- Use `errors.Is` / `errors.As` for structured error checking

## Universal Patterns

### Retry with Exponential Backoff
Use for: network calls, external APIs, database connections.
Template → `resources/error-recovery-strategies.md`

### Circuit Breaker
Use for: external service calls in distributed systems.
Prevents cascading failures by opening after N consecutive failures, then testing recovery.
Template → `resources/error-recovery-strategies.md`

### Error Aggregation
Use for: form validation, batch processing — collect ALL errors before throwing.
Template → `resources/error-recovery-strategies.md`

### Graceful Degradation
Use for: non-critical features — try primary, fall back silently.
Template → `resources/error-recovery-strategies.md`

## Anti-Patterns — Never Do These

- `except Exception: pass` — silently swallowing errors
- Catching too broadly and hiding root bugs
- Logging AND re-throwing the same error (duplicate log spam)
- Returning `null` / `-1` / `""` as implicit error signals — use typed errors
- Forgetting to close files, DB connections, or sockets on error paths
- Vague messages like `"Error occurred"` — always include what, where, and why

## Resources

- [Exception Hierarchy Design](resources/exception-hierarchy-design.md)
- [Error Recovery Strategies](resources/error-recovery-strategies.md) — retry, circuit breaker, aggregation, degradation
- [Async Error Handling](resources/async-error-handling.md)
- [Error Handling Checklist](resources/error-handling-checklist.md)
- [Error Message Writing Guide](resources/error-message-guide.md)
