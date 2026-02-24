---
name: skill-lookup-installer
description: Use when needing to discover, retrieve, or install new AI agent capabilities and skills from external repositories.
---

# Skill Lookup & Installer

## Overview

This skill acts as a bridge to a community-driven ecosystem of AI capabilities. It allows for the discovery and automated installation of skills into the local environment.

## When to Use

- When looking for a specific capability (e.g., "how do I handle PDF forms?").
- When wanting to extend Claude's current set of skills.
- When prompted to search for "Agent Skills".

## Core Tools

- `search_skills`: Search for skills by keyword or category.
- `get_skill`: Download and install a skill by its ID.

## MANDATORY PERMISSION POLICY

**CRITICAL RULE**: ALWAYS ask the user for explicit permission BEFORE:
1. Installing a new skill found via discovery.
2. Reinstalling or updating an existing skill.
3. Modifying any existing skill configurations.

**Rationalization Counter**: Even if the installation seems "routine" or "obviously beneficial," user confirmation is required to prevent unexpected behavioral changes.

## Workflow

1. **Discovery**: Use `search_skills` to find potential matches.
2. **Review**: Present the skill's description and purpose to the user.
3. **Ask**: "I found a skill [Name] that helps with [Task]. Would you like me to install it?"
4. **Execution**: Only run `get_skill` after receiving a "Yes".
