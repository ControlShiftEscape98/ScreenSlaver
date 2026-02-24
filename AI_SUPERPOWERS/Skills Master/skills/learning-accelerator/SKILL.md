---
name: learning-accelerator
description: "AI-powered education system: The 30-Minute Course Creator, Learning Accelerator, and Language Learning System utilizing NotebookLM for research, audio overviews, and study materials."
---

# 🎓 Learning & Education Accelerator

Master any skill 10x faster with AI-generated curriculum and turn any topic into a sellable course — automatically.

This skill integrates deeply with the `notebooklm-mcp` tools to research topics, extract key modules, generate study materials (flashcards, quizzes, study guides), and produce podcast-style audio lessons and intro videos.

## 1. The 30-Minute Course Creator
Turn any topic into a sellable course — automatically. Output: Complete course worth $997 in under 30 minutes.

### Workflow:
1. **Research & Source Gathering**
   - Tool: `research_start` (mode: `deep`)
   - Action: Gather 40+ high-quality sources on the chosen topic. Import sources using `research_import`.
2. **Content Extraction & Structuring**
   - Tool: `source_get_content` / `notebook_query`
   - Action: Extract key concepts and structure them into distinct modules as markdown files.
3. **Video Overview Creation**
   - Tool: `studio_create` (artifact_type: `video`)
   - Action: Generate intro videos for each specific module.
4. **Audio Lesson Generation**
   - Tool: `studio_create` (artifact_type: `audio`)
   - Action: Create Podcast-style audio lessons covering the module's core material.
5. **Student Assessments**
   - Tool: `studio_create` (artifact_type: `quiz`), `studio_create` (artifact_type: `flashcards`)
   - Action: Generate quizzes and flashcards for knowledge retention and student assessments.
6. **Platform Assembly**
   - Action: Utilize AntiGravity to build the course platform architecture, combining the markdown, videos, audio, and assessments into a structured web application with payment integration.

---

## 2. The Learning Accelerator
Master any skill 10x faster with AI-generated curriculum.

### Features & Workflow:
* 📚 **Deep Research:** Run deep research on the target skill to find the best resources and foundational knowledge using `research_start`.
* 🗺️ **Mind Map:** Map out the entire learning path visually. Use `studio_create` (artifact_type: `mind_map`).
* 📝 **Study Guide:** Generate a comprehensive guide with key concepts using `studio_create` (artifact_type: `report`, report_format: `Study Guide`).
* 🎧 **Audio Briefings:** Create audio briefings for commute learning using `studio_create` (artifact_type: `audio`).
* ✅ **Quizzes:** Validate knowledge and test retention with module-specific quizzes (`studio_create` with `artifact_type: quiz`).
* 📊 **AntiGravity Dashboard:** Build a custom dashboard tracking progress through the curriculum.

---

## 3. Language Learning System
Learn a new language with personalized content.

### Workflow:
1. **Grammar & Vocabulary Research:** Research grammar rules and compile comprehensive vocabulary lists.
2. **Flashcards:** Generate spaced-repetition ready flashcards using `studio_create` (artifact_type: `flashcards`).
3. **Audio Overviews:** Create audio overviews and conversational practice sessions in the target language (`studio_create` with `artifact_type: audio`, specifying the `language` parameter).
4. **Practice Applications:** Build an AntiGravity app featuring daily practice drills, flashcard interactive testing, and audio playback.

## Tool Requirements
To execute this skill effectively, the `notebooklm-mcp` server must be active and authenticated (`nlm login` or `refresh_auth`). Use `studio_status` to monitor the asynchronous generation of audio, video, and other curriculum artifacts.
