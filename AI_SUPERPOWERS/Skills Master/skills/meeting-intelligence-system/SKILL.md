---
name: meeting-intelligence-system
description: "AI-powered meeting automation: Extracts key decisions, action items, and follow-ups. Generates briefing docs, task lists, and visual recaps using NotebookLM."
---

# 📅 Meeting Intelligence System

Make every single meeting actionable instantly. This skill leverages the `notebooklm-mcp` integrations to record, transcribe, and automatically distill meetings into actionable formats.

### The Automated Pipeline:
1. **Meeting Ingestion:** Upload the raw meeting recording or transcript directly to a dedicated Notebook using `source_add`.
2. **NotebookLM Extraction:**
   - **Meeting Summary:** `studio_create` (artifact_type: `report`, report_format: `Briefing Doc`) -> Captures the high-level flow and key decisions made.
   - **Task List:** `studio_create` (artifact_type: `data_table`) -> Strictly extracts Action Items with assigned owners and deadlines.
   - **Visual Recap:** `studio_create` (artifact_type: `infographic`) -> Provides a visual breakdown of the meeting's topics and outcomes.
3. **AntiGravity Action:**
   - Parses the Data Table (`data_table`) to create actionable items in your Project Manager (Notion, Jira, Trello, etc.).
   - Distributes the Summary Briefing Doc directly to the attendees via email/Slack.
   - Extracts "Follow-Up Questions" via `notebook_query` and schedules automatic follow-up reminders.

## Tool Requirements
To execute this skill effectively, the `notebooklm-mcp` server must be active and authenticated (`nlm login` or `refresh_auth`). To keep context clean, each meeting should ideally be mapped to a specific notebook or grouped by project using `notebook_create`.
