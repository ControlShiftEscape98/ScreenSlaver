# Async Error Handling

Async code swallows errors silently. These patterns prevent that.

---

## TypeScript: Async/Await

**Always use try/catch with await — never let async functions throw uncaught:**

```typescript
// ✅ Correct — errors are caught and handled at the right level
async function fetchUserOrders(userId: string): Promise<Order[]> {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    return orders;
  } catch (error) {
    if (error instanceof NotFoundError) return []; // Expected — handle silently
    if (error instanceof NetworkError) return retryFetchOrders(userId); // Recoverable
    throw error; // Unexpected — re-throw, let caller decide
  }
}

// ✅ Correct — Promise chains always have a .catch()
function fetchData(url: string): Promise<Data> {
  return fetch(url)
    .then(response => {
      if (!response.ok) throw new NetworkError(`HTTP ${response.status}`);
      return response.json() as Promise<Data>;
    })
    .catch(error => {
      logger.error('Fetch failed:', error);
      throw error; // Re-throw — don't swallow
    });
}
```

**Global safety net (add to app startup, not a substitute for proper handling):**

```typescript
// Node.js
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection:', reason);
  // In production: alert + graceful shutdown
});

// Browser
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled rejection:', event.reason);
});
```

---

## Python: Async/Await

```python
import asyncio

async def fetch_user_orders(user_id: str) -> list[Order]:
    try:
        user = await get_user(user_id)
        orders = await get_orders(user.id)
        return orders
    except NotFoundError:
        return []
    except NetworkError:
        return await retry_fetch_orders(user_id)
    except Exception:
        logger.exception(f"Unexpected error fetching orders for {user_id}")
        raise

# Running multiple async tasks — collect individual errors, don't lose them
async def fetch_all(user_ids: list[str]) -> list[Order]:
    tasks = [fetch_user_orders(uid) for uid in user_ids]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    orders = []
    for uid, result in zip(user_ids, results):
        if isinstance(result, Exception):
            logger.error(f"Failed for user {uid}: {result}")
        else:
            orders.extend(result)
    return orders
```

---

## Go: Goroutine Errors

```go
// Use channels to collect errors from goroutines
func fetchAllUsers(ids []string) ([]User, error) {
    type result struct {
        user User
        err  error
    }

    ch := make(chan result, len(ids))

    for _, id := range ids {
        go func(id string) {
            user, err := getUser(id)
            ch <- result{user, err}
        }(id)
    }

    var users []User
    var errs []error
    for range ids {
        r := <-ch
        if r.err != nil {
            errs = append(errs, r.err)
        } else {
            users = append(users, r.user)
        }
    }

    if len(errs) > 0 {
        return users, fmt.Errorf("%d errors fetching users", len(errs))
    }
    return users, nil
}
```

---

## Rules

- Never use `async` without wrapping the call site in try/catch
- `return_exceptions=True` in Python's `asyncio.gather` — always, for parallel calls
- In Go, always drain goroutine result channels — leaked goroutines cause memory leaks
- Don't `.catch(console.log)` and swallow — always re-throw or handle meaningfully
- Don't mix callbacks and async/await — pick one per codebase
