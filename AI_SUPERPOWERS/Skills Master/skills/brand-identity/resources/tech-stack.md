# Technical Stack & Coding Rules

Strictly follow these rules for all code generation related to this brand.

## Core Stack
- **Framework:** React / Next.js (unless explicitly asked)
- **Component Library:** shadcn/ui (Use these primitives as the base for all new components)
- **Icons:** Lucide React

## Implementation Guidelines

### 1. Tailwind Usage
- Use utility classes directly in JSX.
- Utilize the color tokens defined in `design-tokens.json` (e.g., use `bg-primary` instead of hardcoded hex values).
- **Dark Mode:** Support dark mode using Tailwind's `dark:` variant modifier.

### 2. Component Patterns
- **Buttons:** Primary actions must use the solid Primary color. Secondary actions should use the 'Ghost' or 'Outline' variants from shadcn/ui.
- **Forms:** Labels must always be placed *above* input fields. Use standard Tailwind spacing (e.g., `gap-4`) between form items.
- **Layout:** Use Flexbox and CSS Grid via Tailwind utilities for all layout structures.

### 3. Forbidden Patterns
- Do NOT use jQuery.
- Do NOT use Bootstrap classes.
- Do NOT create new CSS files; keep styles located within component files via Tailwind.
