---
name: n8n-pull-request-creator
description: Use when creating PRs for the n8n repository, submitting changes for review, or when prompted with /pr.
---

# n8n Pull Request Creator

## Overview

This skill automates the creation of GitHub pull requests for the n8n repository. It ensures that PR titles comply with internal CI validation rules (`check-pr-title`) by intelligently analyzing git changes to suggest appropriate conventional commit types and scopes.

## When to Use

- Use when preparing to submit a PR to the n8n repo.
- Use to ensure conventional commit compliance.
- Trigger manually with `/pr`.

## Workflow

1. **Analyze Changes**: Check git status and diffs to determine the type and scope.
2. **Format Title**: Follow the convention: `<type>(<scope>): <summary>`.
3. **Push & Create**: Use GitHub CLI to push the branch and open the PR using the official template.

### Supported Types

| Type | Description | Changelog |
| :--- | :--- | :--- |
| `feat` | New feature | Yes |
| `fix` | Bug fix | Yes |
| `perf` | Performance improvement | Yes |
| `test` | Adding/correcting tests | No |
| `docs` | Documentation only | No |
| `refactor` | Code change (no bug fix or feature) | No |

## Tools & Commands

- **GitHub CLI**: `gh pr create`
- **Git**: `git push origin [branch-name]`
- **Bash**: For analyzing diffs.

## Installation / Setup

```bash
npx skillfish add n8n-io/n8n create-pr
```

## Tips for Success

- **CI Compliance**: Strictly adhere to the type/scope formatting to avoid build failures.
- **Scope Precision**: Choose a scope that accurately reflects the modified sub-module or component.
