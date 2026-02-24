---
name: storyline-research
description: "Storytelling and world-building assistant. Researches historical periods, generates visual mood boards, creates deep character briefings, and builds a comprehensive story bible dashboard."
---

# 📚 Storytelling Research & World-Building

This skill is designed for authors, screenwriters, and narrative designers. It uses NotebookLM to conduct deep research into specific eras or settings and synthesize that data into actionable creative assets, culminating in a structured Story Bible.

## Core Automations & Workflow

The skill executes the following 4-step narrative pipeline:

### 1. Research Historical Period / Setting 🗺️
* **Description:** Gather historically accurate data, cultural nuances, terminology, and setting details to ground the story.
* **NotebookLM Integration:**
  * Use `mcp_notebooklm-mcp_research_start` (mode: `deep`) using prompts like *"Daily life, fashion, and political climate in 1920s Berlin"* or *"Hard science behind terraforming Mars."*
  * Collect these sources into a "World-Building" notebook.

### 2. Generate Visual Mood Boards 🎨
* **Description:** Create visual references and color palettes that define the tone and aesthetic of the narrative.
* **NotebookLM Integration:**
  * Use `mcp_notebooklm-mcp_studio_create` with `artifact_type: "infographic"`.
  * Pass a `focus_prompt` detailing the specific scene, character vibe, or location to generate a cohesive visual mood board summarizing the aesthetic research.

### 3. Create Character Background Briefings 🧑‍🤝‍🧑
* **Description:** Develop deep, multi-dimensional character profiles based on the established world constraints.
* **NotebookLM Integration:**
  * Use `mcp_notebooklm-mcp_studio_create` with `artifact_type: "report"`.
  * Specify a custom `report_format: "Character Briefing"` (or "Create Your Own") with instructions to generate a psychological profile, backstory, motivations, and unique dialogue markers for a specific character archetype within the researched setting.

### 4. Build Story Bible Dashboard 📖
* **Description:** Compile all research, mood boards, and character briefings into an easily navigable master document or application.
* **AntiGravity Action:**
  * AntiGravity retrieves the generated artifacts (Briefings, Infographics, raw source notes).
  * It then scaffolds a local React/Next.js "Story Bible" web application—or a highly structured Markdown repository—allowing the writer to instantly search through locations, characters, and historical notes while writing.

## Execution Requirements
- **NotebookLM MCP:** Required for deep context generation, ensuring character briefings and world-building details remain consistent with the ingested source material.
- **AntiGravity Sync:** Required to assemble the final Story Bible frontend.
