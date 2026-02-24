---
name: research-analysis-system
description: "AI-powered research and analysis system: Executive Briefing System, Market Research Package, Academic Research Assistant, and Due Diligence System leveraging NotebookLM."
---

# 🔬 Research & Analysis

Help to know anything that you don't and research with pure and real foundations on good sources, letting you learn about it and find the stuff that you do not know. This skill utilizes the `notebooklm-mcp` tools to automate executive briefings, market research, academic analysis, and due diligence reporting.

## 1. The Executive Briefing System
Stay informed on any topic — automatically. Converts deep topics into easily digestible cross-media formats.

### Component Breakdown:
* **Executive Summary:** `studio_create` (artifact_type: `report`, report_format: `Briefing Doc`) -> A concise 2-minute read.
* **Audio Briefing:** `studio_create` (artifact_type: `audio`, audio_format: `deep_dive`) -> For commute listening.
* **Visual Summary:** `studio_create` (artifact_type: `infographic`) -> For sharing with the team internally.
* **Deep Dive:** `studio_create` (artifact_type: `report`, report_format: `Blog Post` or customized) -> Full reference document.
* **Dashboard:** AntiGravity pulls all the generated MCP URLs (`studio_status`) into a live, interactive web app for live updates.

---

## 2. Market Research Package
Launch products with absolute confidence.

### Workflow:
1. **Research:** Use `research_start` focused on industry trends, top competitors, and customer pain points.
2. **Generate Assets (NotebookLM):**
   - **Market Size:** `studio_create` (artifact_type: `infographic`).
   - **Competitor Comparison:** `studio_create` (artifact_type: `data_table`).
   - **Trend Analysis:** `studio_create` (artifact_type: `report`).
   - **SWOT Analysis:** `studio_create` (artifact_type: `mind_map`).
3. **Build Delivery:** Assemble all artifacts into an interactive market dashboard via AntiGravity.

---

## 3. Academic Research Assistant
Crush any thorough research project effortlessly.

### Features & Workflow:
* **Source Intake:** Automate adding 40+ high-quality sources (papers, articles, youtube lectures) using `source_add` and `research_import`.
* **Study Guide:** Generate a master study guide highlighting key themes across all papers (`studio_create` with `artifact_type: report` and `report_format: Study Guide`).
* **Concept Mapping:** Visually map how these concepts interrelate with a **mind map** (`studio_create` with `artifact_type: mind_map`).
* **Exam Prep:** Build **flashcards** for testing and rapid review (`studio_create` with `artifact_type: flashcards`).
* **Precise Citations:** Use `notebook_query` to query the notebook for highly specific facts, quotes, or citations.

---

## 4. Due Diligence System
Evaluate investments, potential partnerships, or acquisitions rigorously.

### The Pipeline:
1. **Input Parameters:** Target company name, website url, and primary stakeholder names.
2. **Deep Research (`research_start`):** Scan financials, recent news, competitors, and leadership profiles.
3. **Generate Output Reports:**
   - **Risk Assessment:** `studio_create` (artifact_type: `report`, report_format: `Briefing Doc`).
   - **Competitor Positioning:** `studio_create` (artifact_type: `infographic`).
   - **Leadership Background:** `studio_create` (artifact_type: `data_table`).
   - **Red Flags Report:** Utilize `notebook_query` specifically checking against fraud/legal/negative PR keywords to format a report.
4. **Scoring Dashboard:** AntiGravity builds a final web-dashboard aggregating these and assigning an algorithmic risk score.

## Tool Requirements
To execute this skill effectively, the `notebooklm-mcp` server must be active and authenticated (`nlm login` or `refresh_auth`). Use distinct `notebook_create` calls to separate the context between different research subjects (e.g., a notebook for Academic vs. Due Diligence).
