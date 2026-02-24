---
name: business-agency-automation
description: "AI-powered business and agency workflows: Client Onboarding on Autopilot, Weekly Competitor Intelligence, Sales Call Prep System, and Proposal Generator utilizing NotebookLM."
---

# 💼 Business & Agency Automation

Help build businesses, monetize them, and create the backend infrastructure effortlessly. This skill uses the `notebooklm-mcp` tools to automate client onboarding, competitor tracking, sales preparation, and proposal generation.

## 1. Client Onboarding on Autopilot
Reduce 8 hours of client onboarding to 10 minutes. Clients will think you have a dedicated research team.

### Workflow:
1. **Intake & Research:**
   - Input: Client fills out an intake form.
   - Tool: `research_start` (mode: `deep`)
   - Action: Conduct deep research on the client's industry and their top competitors. Import findings with `research_import`.
2. **Asset Generation (NotebookLM):**
   - **Video Overview ("Your Industry Landscape"):** Tool: `studio_create` (artifact_type: `video`).
   - **Market Opportunity Map:** Tool: `studio_create` (artifact_type: `infographic`).
   - **Competitor Comparison:** Tool: `studio_create` (artifact_type: `data_table`).
   - **Strategy Presentation:** Tool: `studio_create` (artifact_type: `slide_deck`).
3. **Portal Building:**
   - Action: AntiGravity builds a custom client portal (e.g., using React/Tailwind wrapper) to host these assets securely.
4. **Delivery:**
   - Result: Client receives a highly personalized onboarding package spanning videos, tables, slides, and infographics seamlessly.

---

## 2. Weekly Competitor Intelligence
Stay ahead without trying. A fully automated flow designed to run weekly (e.g., every Monday at 6am).

### Features & Workflow:
* 🌐 **Scrape Competitor Websites & Media:** Pull data from websites, YouTube videos, and blogs. Add these automatically via `source_add` (using `url` or `text` source types) to a dedicated competitor intelligence Notebook.
* 🧠 **Feed to NotebookLM:** Let the MCP index the raw materials.
* 📈 **Trend Report Generation:** Output a consolidated trend report using `studio_create` (artifact_type: `report`, report_format: `Briefing Doc`).
* 🗺️ **Opportunity Heat Map:** Output an infographic showing opportunity gaps (`studio_create` with `artifact_type: infographic`).
* 🔔 **Slack Notification:** Integrate with internal messaging tools or send a quick summary to notify of detected opportunities.

---

## 3. Sales Call Prep System
Show up more prepared than anyone else on the call.

### Workflow:
1. **Input:** Prospect's website URL + LinkedIn profile.
2. **Research:** Use `research_start` and `source_add` to deep dive into their company, industry trends, and specific pain points.
3. **Generate Assets:**
   - **Briefing Doc (2-min read):** `studio_create` (artifact_type: `report`, report_format: `Briefing Doc`).
   - **Audio Overview (listen in car):** `studio_create` (artifact_type: `audio`).
   - **Tech Stack Data Table:** `studio_create` (artifact_type: `data_table`).
4. **Build Cheat Sheet:** AntiGravity processes the NotebookLM outputs directly into a concise, formatted one-page markdown or HTML cheat sheet for the call.

---

## 4. Proposal Generator
Win more deals with completely research-backed proposals.

### Features & Workflow:
* **Industry Research:** Utilize existing NotebookLM research on the client's industry challenges (`notebook_query` against industry sources).
* **Case Study Comparisons:** Prompt NotebookLM to generate data highlighting similarities between their needs and your successful case studies.
* **Solution Infographics:** `studio_create` (artifact_type: `infographic`) visually showing your proposed solution over time.
* **Strategy Slide Deck:** `studio_create` (artifact_type: `slide_deck`) mapping out the exact proposal and timelines.
* **Brand Assembly:** AntiGravity wraps the text, data, slides, and infographics into a branded final document template (Notion, PDF, or Web format).

## Tool Requirements
To execute this skill effectively, the `notebooklm-mcp` server must be active and authenticated (`nlm login` or `refresh_auth`). Use `notebook_create` to organize client-specific or competitor-specific notebooks respectively.
