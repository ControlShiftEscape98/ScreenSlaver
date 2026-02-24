---
name: documentation-lookup
description: Retrieves real-time, up-to-date documentation and API references for libraries and frameworks.
---

# Documentation Lookup

## Overview
This skill solves the "outdated knowledge" problem by fetching live documentation for libraries and frameworks. It ensures that the AI uses the latest APIs and best practices.

## Allowed Tools
- `resolve-library-id`
- `query-docs` (via Context7 or similar documentation indexing services)

## Triggers
- Setup or configuration questions.
- Code involving libraries is requested.
- Specific frameworks (React 19+, Next.js 15+, etc.) are mentioned.

## Workflow

1. **Resolve Library**
   - Identify the correct library name and version from the user's query or project files.
   - Use `resolve-library-id` to get the documentation source ID.

2. **Selection**
   - Choose the best documentation match based on benchmark scores and version compatibility.

3. **Query**
   - Execute a targeted search against the live documentation index to answer the specific technical question.

## Capabilities
- Version-aware lookups (e.g., distinguishing between Next.js Pages and App Router).
- Real-time API reference retrieval.
