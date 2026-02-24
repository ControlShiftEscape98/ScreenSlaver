# Exception Hierarchy Design

Design error class trees with a single base class. All app exceptions inherit from it.
This enables catch-all handling at boundaries without catching system-level exceptions.

## Python Hierarchy

```python
from datetime import datetime

class ApplicationError(Exception):
    """Base exception for all application errors."""
    def __init__(self, message: str, code: str = None, details: dict = None):
        super().__init__(message)
        self.code = code
        self.details = details or {}
        self.timestamp = datetime.utcnow()

class ValidationError(ApplicationError):
    """Input failed validation rules."""
    pass

class NotFoundError(ApplicationError):
    """Requested resource does not exist."""
    pass

class AuthorizationError(ApplicationError):
    """User lacks permission for this action."""
    pass

class ConflictError(ApplicationError):
    """Resource state conflicts with request (e.g., duplicate key)."""
    pass

class ExternalServiceError(ApplicationError):
    """External API or service failed."""
    def __init__(self, message: str, service: str, **kwargs):
        super().__init__(message, **kwargs)
        self.service = service
```

## TypeScript Hierarchy

```typescript
class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApplicationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

class NotFoundError extends ApplicationError {
  constructor(resource: string, id: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404, { resource, id });
  }
}

class UnauthorizedError extends ApplicationError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

class ConflictError extends ApplicationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'CONFLICT', 409, details);
  }
}
```

## Design Rules

- **One base class per app** — never catch raw `Exception` at service boundaries; catch `ApplicationError`
- **HTTP status codes baked in** — map errors to responses without switch statements
- **Error codes as strings** — machine-readable, loggable, and API-safe (e.g. `"USER_NOT_FOUND"`)
- **Details dict/object** — carry structured context alongside the message
- **Capture stack trace** — in TypeScript, always call `Error.captureStackTrace`
- **Keep hierarchy shallow** — 2 levels max (Base → Specific). Deep hierarchies create fragile catch chains.
