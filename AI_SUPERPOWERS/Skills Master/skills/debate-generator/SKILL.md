---
name: debate-generator
description: "Generates structured, multi-perspective debates on any topic. Researches multiple viewpoints, generates 'two-host' audio arguments, creates visual comparisons, and builds interactive 'choose your side' UIs."
---

# ⚖️ The Debate Generator

This skill leverages AI to break down complex topics, ensuring you see every side of an argument before making a decision. It utilizes NotebookLM to ingest opposing viewpoints and generate dynamic back-and-forth audio discussions.

## Core Automations & Workflow

Executing this skill involves the following pipeline:

### 1. Research Topic from Multiple Perspectives 🕵️
* **Description:** Gather diverse arguments, opinion pieces, and data sets surrounding a specific topic.
* **NotebookLM Integration:**
  * Use `mcp_notebooklm-mcp_research_start` (mode: `deep`) to scour the web for articles representing both the "Pro" and "Con" sides of the argument.
  * You can also use `mcp_notebooklm-mcp_source_add` to manually inject specific PDF reports or URLs representing distinct viewpoints into a fresh notebook.

### 2. Generate Debate-Style Audio 🎧
* **Description:** Transform the conflicting sources into a dynamic, two-host audio debate.
* **NotebookLM Integration:**
  * Use `mcp_notebooklm-mcp_studio_create` with `artifact_type: "audio"`.
  * Crucially, set the `audio_format` flag to `"debate"` (or a similarly prompted custom instruction) to force the two AI hosts to actively disagree, challenge each other's points, and represent the opposing sides found in the sources.

### 3. Create Comparison Infographic 📊
* **Description:** Generate a visual "T-chart" or comparative breakdown of the core arguments.
* **NotebookLM Integration:**
  * Use `mcp_notebooklm-mcp_studio_create` with `artifact_type: "infographic"`.
  * Pass a `focus_prompt` such as *"Create a visual comparison contrasting the main arguments for and against [Topic]."*

### 4. Build Interactive "Choose Your Side" Experience 💻
* **Description:** Package the audio debate, the infographic, and the raw sources into an interactive web interface.
* **AntiGravity Action:**
  * AntiGravity will act as the frontend developer, scaffolding a React/Next.js interface.
  * The UI will feature an embedded audio player for the debate, a display for the infographic, and an interactive "Tinder-style" or voting mechanism allowing the user to weigh the arguments and "choose their side" after consuming the generated media.

## Execution Requirements
- **NotebookLM MCP:** Essential for generating the debate audio and infographic synthesis.
- **AntiGravity Sync:** Required to build and serve the interactive web component at the end of the pipeline.
