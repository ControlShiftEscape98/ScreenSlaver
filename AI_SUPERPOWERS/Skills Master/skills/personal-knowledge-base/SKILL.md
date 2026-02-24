---
name: personal-knowledge-base
description: "AI-powered Second Brain. Captures notes/articles, autos-generates mind maps, queries across all knowledge, generates content, and builds a searchable personal wiki."
---

# 🧠 Personal Knowledge Base (Second Brain)

This skill transforms NotebookLM into an active, intelligent Second Brain. It moves beyond static note-taking by auto-organizing content, visualizing connections, and surfacing insights across all captured knowledge.

## Core Automations & Workflow

The following capabilities define the 5-step knowledge architecture:

### 1. Capture 📥
* **Description:** Seamlessly add articles, videos, PDFs, and raw text notes into your Second Brain.
* **NotebookLM Integration:**
  * Utilize `mcp_notebooklm-mcp_source_add` to continuously pipe new information into a master "Second Brain" notebook.
  * Supports adding URLs (web pages, YouTube), Text (quick thoughts/notes), Google Drive documents, and local files (PDFs, audio).

### 2. Organize 🕸️
* **Description:** Move away from rigid folder structures. Let AI auto-generate visual connections between disparate ideas.
* **NotebookLM Integration:**
  * Once new sources are added, use `mcp_notebooklm-mcp_studio_create` with `artifact_type: "mind_map"`.
  * The mind map visually connects themes, recurring concepts, and overlapping data points across *all* sources in the notebook, organizing the chaos automatically.

### 3. Query 🔍
* **Description:** Ask complex questions that synthesize answers across all your accumulated knowledge, complete with citations.
* **NotebookLM Integration:**
  * Use `mcp_notebooklm-mcp_notebook_query`. 
  * Example Queries: *"What are the key differences between the marketing strategies I saved last week and the ones from Q1?"*, *"Summarize all my notes on prompt engineering from the last 6 months."*

### 4. Create ✍️
* **Description:** Generate new, original content (blog posts, emails, strategies) directly from your curated knowledge base.
* **NotebookLM Integration:**
  * Use `mcp_notebooklm-mcp_studio_create` with `artifact_type: "report"`.
  * Specify `report_format: "Blog Post"` or `"Create Your Own"` and provide custom instructions to draft new material based entirely on your saved sources, ensuring it matches your voice and utilizes your research.

### 5. Build 🏗️
* **Description:** Construct a personal wiki dashboard providing a unified, searchable interface for your Second Brain.
* **AntiGravity Action:**
  * AntiGravity acts as the frontend builder. It pulls down the generated mind maps, briefing docs, and query results from NotebookLM and compiles them into a secure, locally-hosted (or Vercel-deployed) React/Next.js "Personal Wiki" dashboard with global search functionality.

## Execution Requirements
- **NotebookLM MCP:** Must be authenticated (`nlm login`) to manage the master notebook, add sources, and execute queries.
- **AntiGravity Sync:** AntiGravity must be utilized to build and serve the final Wiki dashboard UI (Step 5).
