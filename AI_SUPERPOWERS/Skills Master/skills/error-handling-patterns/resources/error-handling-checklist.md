Want to create a skill that integrates your code using Pinecon to facilitate data compression, etc. Go search for what Pinecon does and let me know how best to integrate it. I already have an API key, so let's see what you propose# Error Handling Checklist

Run this checklist before marking any feature complete.

## Error Boundaries

- [ ] All external service calls wrapped in try/catch (or Result type)
- [ ] All async functions have proper error handling (not just top-level)
- [ ] No unhandled promise rejections (TypeScript/JS)
- [ ] Goroutine errors collected via channels (Go)
- [ ] All database transactions roll back on failure

## Error Types

- [ ] Custom exception/error hierarchy defined for the app
- [ ] Errors have meaningful `code` strings (e.g., `"USER_NOT_FOUND"`)
- [ ] Errors carry structured `details` object with relevant context
- [ ] HTTP status codes mapped correctly (400 validation, 404 not found, 409 conflict, 500 internal)

## Resource Cleanup

- [ ] Files/connections closed in `finally` / context manager / `defer`
- [ ] Transactions rolled back on exception path
- [ ] Locks released even on error
- [ ] Timers/intervals cleared on component unmount

## Logging

- [ ] Unexpected errors logged with full stack trace (`logger.exception` / `logger.error`)
- [ ] Expected/handled failures logged at WARNING or lower — not ERROR
- [ ] No duplicate logging (log once, at the catch site — don't log AND re-throw)
- [ ] Log includes request ID / correlation ID for traceability

## Retry & Recovery

- [ ] Retry only applied to *transient* errors (network, rate limit, timeout)
- [ ] Retry NOT applied to validation or not-found errors
- [ ] Circuit breaker in place for external service calls
- [ ] Fallback values / degraded responses defined for non-critical paths

## Error Messages (User-Facing)

- [ ] Message says what went wrong in plain language
- [ ] Message suggests what the user can do next
- [ ] No raw exception messages or stack traces exposed to users
- [ ] Validation errors reference the specific field that failed

## Tests

- [ ] Each custom error class has at least one test
- [ ] Happy path AND error path both tested
- [ ] Retry behavior tested (mock transient failure N times)
- [ ] Circuit breaker opens/closes tested
