# Error Message Writing Guide

Good error messages are the first line of debugging. Write them for two audiences: the user and the developer.

---

## The Formula

Every error message should answer:
1. **What happened?** (fact)
2. **Why did it happen?** (cause, if known)
3. **What can they do next?** (action)

---

## User-Facing Messages

Write for non-technical users. Be honest, calm, and specific.

| ❌ Bad | ✅ Good |
|---|---|
| `"Error occurred"` | `"We couldn't process your payment. Please check your card details and try again."` |
| `"Invalid input"` | `"Your email address doesn't look right — double-check it and try again."` |
| `"Not found"` | `"We couldn't find this order. It may have been deleted or never existed."` |
| `"Internal server error"` | `"Something went wrong on our end. We've been notified and are looking into it."` |
| `"403 Forbidden"` | `"You don't have permission to view this. Contact your admin if you think this is a mistake."` |

**Rules:**
- Never expose raw exception messages, stack traces, or SQL errors to users
- Use "we" not "you" when blaming the system — don't make users feel stupid
- Suggest next steps whenever possible
- Include a support reference number for errors users need to report

---

## Developer-Facing Messages (Logs & Error Objects)

Write for the engineer who's debugging at 2am.

**Include:**
- The specific resource that failed (ID, path, URL)
- The operation that was attempted
- The values that caused the failure
- The service or layer that threw the error
- Timestamp (should be automatic)

```python
# ❌ Bad
raise ApplicationError("User not found")

# ✅ Good
raise NotFoundError(
    "User not found",
    code="USER_NOT_FOUND",
    details={"user_id": user_id, "lookup_field": "email"}
)
```

```typescript
// ❌ Bad
throw new Error("Failed")

// ✅ Good
throw new ExternalServiceError(
  `Payment gateway returned 503 after 3 retries`,
  { service: 'stripe', orderId, amount, attempt: 3 }
)
```

---

## Validation Error Messages

Be field-specific. Tell users exactly what's wrong and how to fix it.

```
❌ "Form is invalid"
✅ {
     email: "Must be a valid email address",
     password: "Must be at least 8 characters and include one number",
     age: "You must be 18 or older to register"
   }
```

---

## Error Codes

Use structured string codes for machine-readable errors. Follow a consistent convention:

```
RESOURCE_PROBLEM format:
USER_NOT_FOUND
ORDER_ALREADY_CANCELLED
PAYMENT_INSUFFICIENT_FUNDS
FILE_TOO_LARGE
AUTH_TOKEN_EXPIRED
```

- All caps, underscores
- Resource first, problem second
- Include in all API error responses alongside the human message
- Never reuse codes across different errors

---

## API Error Response Format

Consistent JSON structure across all endpoints:

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "No user found with the provided ID.",
    "details": {
      "userId": "abc-123"
    },
    "timestamp": "2026-02-19T05:00:00Z",
    "requestId": "req_987xyz"
  }
}
```
