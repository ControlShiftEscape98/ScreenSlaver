---
name: tdd-workflow
description: Enforces test-driven development principles with a comprehensive workflow to ensure 80%+ code coverage.
---

# TDD Workflow

## Overview
This skill mandates a Test-Driven Development (TDD) approach to software engineering. It ensures that every logic change is preceded by a failing test and that high coverage standards are maintained throughout the project lifecycle.

## Allowed Tools
- `jest`, `vitest`, `pytest`
- `playwright` (for E2E)
- `git`

## Triggers
- Writing new features.
- Fixing bugs.
- Refactoring critical logic.

## Workflow: Red-Green-Refactor

1. **Phase 1: RED**
   - Write a unit test that describes the desired behavior.
   - Run the test and verify that it fails.

2. **Phase 2: GREEN**
   - Write the *minimal* amount of code necessary to make the test pass.
   - Verify that all tests are now green.

3. **Phase 3: REFACTOR**
   - Clean up the code and logic while keeping tests passing.
   - Ensure the implementation adheres to project architecture standards.

## Standards
- **Minimum Coverage**: 80% line coverage for all new modules.
- **Layers**: Include unit tests (business logic), integration tests (API/DB), and E2E tests (crucial user flows).
