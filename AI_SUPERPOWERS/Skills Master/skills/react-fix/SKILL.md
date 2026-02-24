---
name: react-fix
description: Automates code formatting and linting checks for React projects to ensure CI compliance.
---

# React Code Fix & Linter

## Overview
This skill provides an automated way to clean up React codebases. It focuses on resolving lint errors and formatting issues before code is committed to version control.

## Allowed Tools
- `yarn prettier`
- `yarn linc` (linting for changed files)

## Triggers
- When lint errors are reported in CI or local environment.
- Before committing code (pre-commit quality check).
- When formatting is inconsistent across files.

## Workflow
1. **Prettier**: Run `yarn prettier` to automatically fix formatting in all staged/changed files.
2. **Lint**: Run `yarn linc` to catch logic errors or anti-patterns in changed files.
3. **Resolution**: Manually address any issues that the automated tools cannot fix.

## Standard
Ensures 100% compliance with Facebook/React coding standards.
