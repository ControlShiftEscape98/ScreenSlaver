---
name: python-patterns
description: Standardizes Python development through idiomatic patterns, PEP 8 compliance, and modern type-hinting techniques.
---

# Python Patterns & Best Practices

## Overview
This skill enforces high-quality Python engineering. It moves beyond simple syntax to ensure that code is idiomatic ("Pythonic"), maintainable, and leverages modern language features.

## Allowed Tools
- `pyright` / `mypy` (for type checking)
- `ruff` / `black` (for formatting)
- `grep`

## Triggers
- Writing new Python code.
- Reviewing or refactoring existing Python code.
- Designing Python packages or modules.

## Workflow

1. **Idiomatic Patterns**
   - Use EAFP (Easier to Ask Forgiveness Than Permission) for error handling.
   - Leverage context managers (`with` statements) for robust resource management.
   - Use Data Classes for clean state representation.

2. **Modern Standards**
   - Mandatory type-hinting for all function signatures.
   - Strict compliance with PEP 8.
   - Use of `pathlib` over legacy `os.path` operations.

3. **Optimization**
   - Use list comprehensions and generator expressions appropriately.
   - Prefer `dict.get()` and `collections.defaultdict` for safer access.
