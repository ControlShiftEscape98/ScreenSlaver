# Error Recovery Strategies

Copy-paste templates for the four universal recovery patterns.

---

## 1. Retry with Exponential Backoff (Python)

Use for: network calls, external APIs, flaky DB connections.

```python
import time
from functools import wraps

def retry(max_attempts=3, backoff_factor=2.0, exceptions=(Exception,)):
    """Decorator: retry with exponential backoff."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(backoff_factor ** attempt)
        return wrapper
    return decorator

@retry(max_attempts=3, exceptions=(NetworkError, TimeoutError))
def fetch_data(url: str) -> dict:
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    return response.json()
```

**Rules:**
- Only retry on *transient* errors (network, rate limit, timeout) — never on `ValidationError` or `NotFoundError`
- Cap total wait time (e.g., 3 attempts × 2^n seconds = max ~6s)
- Add jitter in high-concurrency systems to avoid thundering herd

---

## 2. Circuit Breaker (Python)

Use for: external service calls. Prevents cascading failure when a dependency is down.

```python
from enum import Enum
from datetime import datetime, timedelta

class CircuitState(Enum):
    CLOSED = "closed"       # Normal — requests pass through
    OPEN = "open"           # Failing — reject requests immediately
    HALF_OPEN = "half_open" # Recovering — let one request through to test

class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout_seconds=60, success_threshold=2):
        self.failure_threshold = failure_threshold
        self.timeout = timedelta(seconds=timeout_seconds)
        self.success_threshold = success_threshold
        self.failure_count = 0
        self.success_count = 0
        self.state = CircuitState.CLOSED
        self.last_failure_time = None

    def call(self, func):
        if self.state == CircuitState.OPEN:
            if datetime.now() - self.last_failure_time > self.timeout:
                self.state = CircuitState.HALF_OPEN
            else:
                raise Exception("Circuit OPEN — service unavailable")
        try:
            result = func()
            self._on_success()
            return result
        except Exception:
            self._on_failure()
            raise

    def _on_success(self):
        self.failure_count = 0
        if self.state == CircuitState.HALF_OPEN:
            self.success_count += 1
            if self.success_count >= self.success_threshold:
                self.state = CircuitState.CLOSED

    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN

# Usage — one circuit breaker per external dependency
payment_circuit = CircuitBreaker(failure_threshold=5, timeout_seconds=30)

def charge_card(amount):
    return payment_circuit.call(lambda: payment_api.charge(amount))
```

---

## 3. Error Aggregation (TypeScript)

Use for: form validation, batch processing — collect ALL errors before throwing.

```typescript
class ErrorCollector {
  private errors: Error[] = [];

  add(error: Error): void { this.errors.push(error); }
  hasErrors(): boolean { return this.errors.length > 0; }

  throwIfErrors(): void {
    if (!this.hasErrors()) return;
    if (this.errors.length === 1) throw this.errors[0];
    throw new AggregateError(this.errors, `${this.errors.length} validation errors`);
  }
}

function validateUser(data: any): User {
  const errors = new ErrorCollector();
  if (!data.email) errors.add(new ValidationError('Email required'));
  if (!data.name || data.name.length < 2) errors.add(new ValidationError('Name too short'));
  if (!data.age || data.age < 18) errors.add(new ValidationError('Must be 18+'));
  errors.throwIfErrors();
  return data as User;
}
```

---

## 4. Graceful Degradation (Python)

Use for: non-critical features where a partial result is better than an error.

```python
def with_fallback(primary, fallback, log_error=True):
    """Try primary; on failure, silently use fallback."""
    try:
        return primary()
    except Exception as e:
        if log_error:
            logger.warning(f"Falling back: {e}")
        return fallback()

# Cache → DB fallback
def get_user_profile(user_id):
    return with_fallback(
        primary=lambda: cache.get(user_id),
        fallback=lambda: db.query_user(user_id)
    )

# Multi-provider fallback chain
def get_exchange_rate(currency):
    for provider in [provider_1, provider_2, cache]:
        try:
            return provider.get_rate(currency)
        except Exception:
            continue
    return DEFAULT_RATE  # Last resort static default
```

**Rules:**
- Only degrade on *non-critical* paths — never silently swallow errors that affect data integrity
- Always log the degradation so you know it's happening
- Monitor degradation frequency — if it spikes, the primary is broken and needs fixing
