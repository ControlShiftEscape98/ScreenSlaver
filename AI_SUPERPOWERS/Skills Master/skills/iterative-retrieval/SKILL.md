---
name: iterative-retrieval
description: Refines AI context retrieval through an intelligent four-phase feedback loop to solve the context problem in complex workflows.
---

# Iterative Context Retrieval

## Overview
Traditional context retrieval often misses relevant files because of terminology mismatches. This skill solves that by using a feedback loop to discover hidden context.

## Allowed Tools
- `grep_search`
- `find_by_name`
- `read_file`

## Triggers
- When subagents lack codebase knowledge.
- During initial exploration of large, unfamiliar repositories.
- When specific functionality is "missing" from first-pass search results.

## Workflow: The Four-Phase Feedback Loop

1. **DISPATCH (Phase 1)**
   - Execute an initial broad query based on the task description.

2. **EVALUATE (Phase 2)**
   - Score the relevance of the retrieved files (0 to 1).
   - Identify "Context Gaps" (e.g., "I found the API but not the implementation").

3. **REFINE (Phase 3)**
   - Learn new keywords from the discovered files. (e.g., if searching for "rate-limit" but code uses "throttle").
   - Update search patterns for the next iteration.

4. **LOOP (Phase 4)**
   - Repeat the cycle (Max 3 times) until the relevance score is sufficiently high.

## Logic
Progressively discovers relevant files by learning codebase terminology on the fly.
