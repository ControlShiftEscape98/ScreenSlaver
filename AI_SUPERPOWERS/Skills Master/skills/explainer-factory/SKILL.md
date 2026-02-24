---
name: explainer-factory
description: "Turns complex topics into simple, multi-format educational content. Generates ELI5 briefing docs, Explainer Videos, Visual Infographics, Flashcards, and interactive learning modules."
---

# 🏭 The Explainer Factory

This skill is a content multiplication engine. Provide it with a complex topic (e.g., "Quantum Computing", "The 2008 Financial Crisis", "CRISPR"), and it will automatically research the fundamentals and generate a suite of simplified, multi-format educational assets.

## Core Automations & Workflow

The skill executes the following pipeline to deconstruct and explain complex concepts:

### 1. Research: Fundamentals + Latest Developments 🔬
* **Description:** Gather foundational knowledge and recent breakthroughs on the target topic.
* **NotebookLM Integration:**
  * Use `mcp_notebooklm-mcp_research_start` (mode: `deep` or `fast` depending on topic obscurity) using the provided complex topic as the query.
  * Import the resulting sources into a dedicated Explainer Notebook.

### 2. Generate: Multi-Format Asset Suite 📦
* **Description:** Once the research is compiled, generate customized assets catering to different learning styles.
* **NotebookLM Integration (`mcp_notebooklm-mcp_studio_create`):**
  * **ELI5 Briefing Doc:** `artifact_type: "report"`, `report_format: "Briefing Doc"`. Use custom instructions to enforce an "Explain Like I'm 5" tone, removing jargon and using analogies.
  * **Explainer Video:** `artifact_type: "video"`. 
    * *Style Options:* `whiteboard` (Educational), `kawaii` (Fun/Playful), `anime` (Engaging), `classic` (Professional). *Default to `whiteboard` or `kawaii` for maximum accessibility.*
  * **Visual Infographic:** `artifact_type: "infographic"`. Summarizes the core steps, timelines, or mechanisms of the topic visually.
  * **Flashcards:** `artifact_type: "flashcards"`. Generates a deck of key terms and vocabulary associated with the complex topic.
  * *(Optional)* **Audio Overview:** `artifact_type: "audio"`. Format: `deep_dive` or `brief`.

### 3. Build: Interactive Learning Module 🏫
* **Description:** Assemble all the generated assets into a cohesive, interactive learning experience.
* **AntiGravity Action:**
  * AntiGravity acts as the frontend builder, scaffolding a React/Next.js "Learning Module" application.
  * The UI will feature the Video at the top, followed by the ELI5 Briefing Doc text, embed the Infographic for visual reference, and include an interactive Javascript component to click through the generated Flashcards.

## Configuration & Output References

When calling NotebookLM Studio tools, utilize these supported formats based on the desired tone:

**Audio Overview Styles:**
* `deep_dive`: Comprehensive exploration
* `brief`: Quick summary
* `critique`: Critical analysis
* `debate`: Multiple perspectives

**Video Overview Styles:**
* `classic`: Professional
* `whiteboard`: Educational
* `kawaii`: Fun/Playful
* `anime`: Engaging
* `watercolor`: Artistic
* `retro_print`: Vintage
* `heritage`: Traditional
* `paper_craft`: Crafty

**Report Formats:**
* `Briefing Doc`: Executive summary
* `Study Guide`: Learning-focused
* `Blog Post`: Publication-ready
* `Create Your Own`: Custom format
