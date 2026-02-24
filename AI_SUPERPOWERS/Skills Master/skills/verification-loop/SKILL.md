---
name: verification-loop
description: Standardizes code quality checks through a multi-phase verification process for builds, types, tests, and security.
---

# Verification Loop

## Overview
This skill standardizes the "Definition of Done" for any code change. It ensures that builds pass, types are correct, tests are green, and security standards are met before a task is considered complete.

## Allowed Tools
- `npm`, `pnpm`
- `tsc` (TypeScript Compiler)
- `pyright`
- `ruff`
- `grep`
- `git`

## Triggers
- After completing a feature.
- Before creating a Pull Request.
- When ensuring quality gates are met.
- After complex refactoring.

## Workflow: Multi-Phase Verification

1. **Phase 1: Build Verification**
   - Ensure the project builds without errors (`npm run build`).

2. **Phase 2: Type Check**
   - Run static analysis (`tsc` or `pyright`) to catch type errors.

3. **Phase 3: Lint Check**
   - Verify code style and common pitfalls (`ruff` or `eslint`).

4. **Phase 4: Test Suite**
   - Run all unit and integration tests. Target 80% coverage.

5. **Phase 5: Security Scan**
   - Perform secret detection to ensure no API keys or sensitive data are committed.

6. **Phase 6: Diff Review**
   - Review the final diff to ensure no accidental changes or debug code remains.

## Reporting
Produce a comprehensive VERIFICATION REPORT with PASS/FAIL status for each phase.

## Continuous Mode
For long development sessions, trigger a background verification every 15 minutes to catch regressions early.
