---
name: personal-productivity
description: "AI-powered personal workflows: The Decision Maker, Travel Planning System, Health & Fitness Research, and Book Club preparation utilizing NotebookLM."
---

# 🏠 Personal Productivity

Make life-improving decisions, plan world-class trips, and take control of your health using pure data and research. This skill leverages the `notebooklm-mcp` integrations to enhance your personal systems outside of work.

## 1. The Decision Maker
Make better life decisions (e.g., "Should I move to Austin?") based on deep research rather than gut feelings alone.

### Workflow:
1. **Research Variables:** Perform initial research (e.g., cost of living, job market, climate, lifestyle) using `research_start` and import with `source_add` or manual texts.
2. **Generate Visuals:**
   - **Pros/Cons:** `studio_create` (artifact_type: `infographic`).
   - **Data Comparison:** `studio_create` (artifact_type: `data_table`) comparing variables directly against your current situation.
3. **Build the Matrix:** Utilize AntiGravity to format the generated data table and infographic into an interactive Decision Matrix Dashboard.

---

## 2. Travel Planning System
Plan trips with the thoroughness of an expert travel agent.

### Features & Workflow:
* **Destination Research:** Add deep dive articles, vlogs, and blogs on culture, safety, and best times to visit (`source_add`).
* **Visual Guide:** Output an infographic highlighting key sights (`studio_create` with `artifact_type: infographic`).
* **Day-by-Day Itinerary:** Generate a heavily structured schedule (`studio_create` with `artifact_type: report`, report_format: `Create Your Own` using a custom prompt for daily planning).
* **AntiGravity App:** Extract the itinerary into a customized personal app incorporating maps and booking links directly into the schedule.

---

## 3. Health & Fitness Research
Understand your body and nutrition using the latest science.

### Workflow:
1. **Research Accumulation:** Gather and ingest the latest medical studies tailored to your specific health goals (`research_start`).
2. **Generate Insights:** Synthesize findings into a high-level **Study guide** (`studio_create` with `artifact_type: report`, report_format: `Study Guide`).
3. **Meal Plan Data:** Use the study guide context to generate a precise **Meal plan data table** (`studio_create`, `artifact_type: data_table`).
4. **Tracking Dashboard:** Build an AntiGravity-powered progress tracking dashboard linking the meal data table to daily inputs.

---

## 4. Book Club on Steroids
Never show up unprepared to a book club again. 

### Output Pipeline:
* **Ingest the Book:** Input the core material directly as a PDF or comprehensive summary using `source_add` (file path or text).
* **Discussion Generator:** Query the notebook (`notebook_query`) for specific, thought-provoking discussion questions.
* **Thematic Mind Map:** Visually link character arcs and major themes via `studio_create` (artifact_type: `mind_map`).
* **Audio Refresher:** Create an **Audio Overview** (`studio_create`, `artifact_type: audio`) summarizing the book for a quick listen on your commute right before the club meets.

## Tool Requirements
To execute this skill effectively, the `notebooklm-mcp` server must be active and authenticated (`nlm login` or `refresh_auth`). Use `notebook_create` to organize distinct personal projects (e.g., separate notebooks for specific trips or specific books).
