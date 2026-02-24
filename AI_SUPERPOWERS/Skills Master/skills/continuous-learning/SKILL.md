---
name: continuous-learning
description: Automatically extracts reusable coding patterns and debugging techniques from sessions to build a personalized knowledge base.
---

# Continuous Learning & Pattern Extraction

## Overview
This skill turns every coding session into a learning opportunity. It analyzes the interaction history to identify new patterns, workarounds, and project-specific knowledge that can be reused in future tasks.

## Allowed Tools
- `evaluate-session.sh` (shell script hook)

## Triggers
- Automatically triggered via the `Stop` hook at the end of each Claude Code session.

## Workflow

1. **Session Evaluation**
   - Check if the session was significant (10+ messages).
   - Analyze the conversation for "Aha!" moments or complex problem resolutions.

2. **Pattern Detection**
   - Identify:
     - `error_resolution`: How a specific bug was fixed.
     - `user_corrections`: Preferences or feedback from the user.
     - `workarounds`: Non-obvious fixes for library limitations.
     - `debugging_techniques`: Effective strategies used.

3. **Storage**
   - Save extracted patterns to `~/.claude/skills/learned/` for future retrieval.

## Implementation Details
Requires setup in `~/.claude/settings.json` using a `Stop` hook to execute the evaluation script.
