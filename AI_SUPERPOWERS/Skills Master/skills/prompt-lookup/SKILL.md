---
name: prompt-lookup
description: Accesses, retrieves, and optimizes community-sourced AI prompts within the terminal workflow.
---

# Prompt Finder & Enhancer

## Overview
This skill leverages a massive community library of AI prompts to improve user interactions. It allows the assistant to quickly find, adapt, and enhance prompts for any task.

## Allowed Tools
- `prompts.chat` MCP server / API

## Triggers
- When searching for prompt templates.
- Requests to "improve my prompt" or "make this prompt better".
- When mentions of specific community prompt libraries are made.

## Workflow
1. **Search**: Use the community library to find prompts relevant to the user's keywords.
2. **Optimization**: Retrieve the best structure for the specific AI task (creative writing, coding, analysis).
3. **Enhancement**: Apply best practices (role setting, few-shot examples) to the user's current prompt to maximize output quality.
