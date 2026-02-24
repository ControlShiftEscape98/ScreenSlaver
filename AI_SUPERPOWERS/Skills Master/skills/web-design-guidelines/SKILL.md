---
name: web-design-guidelines
description: Audits frontend code for compliance with Vercel's Web Interface Guidelines for UI/UX and accessibility.
---

# Web Design Guidelines Auditor

## Overview
This skill ensures that UI implementations adhere to modern web design standards defined by industry leaders. It focuses on accessibility, performance, and user experience.

## Allowed Tools
- `read_url_content` / `read_browser_page` (WebFetch)

## Triggers
- When asked to "review my UI".
- When checking accessibility.
- During "audit design" or "review UX" requests.

## Workflow

1. **Fetch Guidelines**
   - Retrieve the latest version of Vercel's guidelines from:
     - `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`

2. **Audit Process**
   - Scan the codebase (HTML, JSX/TSX, CSS) for compliance.
   - Look for:
     - Proper semantic HTML.
     - Accessible color contrast.
     - Component reuse patterns.
     - Layout responsiveness.

3. **Reporting**
   - Output findings in a terse `file:line` format for quick fixing.
   - Provide "Before/After" examples for non-compliant code.
