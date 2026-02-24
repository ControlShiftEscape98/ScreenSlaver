---
name: content-creation-engine
description: "AI-powered content creation workflows: The Content Repurposing Engine, YouTube Research Assistant, and Podcast Show Prep utilizing NotebookLM."
---

# 📰 Content Creation & Repurposing Engine

A powerful skill designed to turn individual pieces of research into vast, multi-platform media empires. This skill uses the `notebooklm-mcp` tools to automate content repurposing, YouTube strategy, and Podcast guest preparation.

## 1. The Content Repurposing Engine
Turn one piece of deep research into 12 discrete pieces of content effortlessly.

### The Pipeline:
1. **Deep Research on Topic:** `research_start (deep)` + `source_add` + `research_import`.
2. **Asset Generation:**
   - 📝 **Blog Post:** `studio_create` (artifact_type: `report`, report_format: `Blog Post`)
   - 🎬 **YouTube Script:** `studio_create` (artifact_type: `video`) -> Provides storyboard & intro video framework.
   - 🎙️ **Podcast Episode:** `studio_create` (artifact_type: `audio`, audio_format: `deep_dive`) -> Full audio overview.
   - 📊 **Infographic:** `studio_create` (artifact_type: `infographic`) -> Visual data representation.
   - 🎴 **Slide Deck:** `studio_create` (artifact_type: `slide_deck`)
   - 🗺️ **Mind Map:** `studio_create` (artifact_type: `mind_map`)
   - 🐦 **Twitter Thread:** Extracted via `notebook_query` focusing on concise, viral hooks.
   - 📧 **Newsletter:** `studio_create` (artifact_type: `report`, report_format: `Briefing Doc`) adapted for email.
   - 📱 **LinkedIn Carousel:** Combines `infographic` extraction into a sliding carousel format.
   - ❓ **FAQ Document:** Extracted dynamically via `notebook_query`.
   - 📚 **Lead Magnet PDF:** `studio_create` (artifact_type: `report`, report_format: `Study Guide`).
   - 🎓 **Mini-Course:** Aggregation of all elements structured by AntiGravity into a web/course platform format.

---

## 2. YouTube Research Assistant
Never run out of high-performing video ideas based on algorithm-friendly research.

### Features & Workflow:
1. **Trend Research:** Deep research on trending topics within a specified niche (`research_start`).
2. **Mind Mapping:** Generate a **mind map** of content clusters using NotebookLM (`studio_create` with `artifact_type: mind_map`).
3. **Competitor Data:** Create a **data table** analyzing competitor videos, upload dates, and respective views (`studio_create` with `artifact_type: data_table`).
4. **Dashboard:** AntiGravity visualizes this `data_table` in a custom dashboard highlighting immediate content gaps.
5. **Video Outlines:** Auto-generate specific video outlines for the top-identified gap opportunities using `notebook_query`.

---

## 3. Podcast Show Prep
Sound like a meticulously prepared expert on any guest you interview.

### Workflow:
1. **Guest Research:** Feed the guest's background, past interviews, website, and articles into NotebookLM (`source_add`).
2. **Produce Assets:**
   - **Briefing Doc:** `studio_create` (artifact_type: `report`, report_format: `Briefing Doc`) containing key talking points and contrarian takes.
   - **Audio Overview:** `studio_create` (artifact_type: `audio`, audio_format: `brief`) to listen to during your commute/prep time.
3. **Question Bank Extraction:** Use `notebook_query` to build a unique question bank synthesized from their most frequent content themes, highlighting areas they *haven't* discussed purely.

## Tool Requirements
To execute this skill effectively, the `notebooklm-mcp` server must be active and authenticated (`nlm login` or `refresh_auth`). Use `studio_status` to monitor the creation of reports, video, audio, and infographic artifacts.
