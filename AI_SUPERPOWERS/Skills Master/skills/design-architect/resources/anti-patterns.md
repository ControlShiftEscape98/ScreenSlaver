# The Anti-Patterns Checklist: What to AVOID

## 🚫 Design Sins
- **Flash Over Function:** No animations that block user action or take >300ms.
- **Low Contrast:** No light grey on white. Ensure WCAG AA compliance.
- **Cluttered Chaos:** Max 3 primary colors, 2 font families.
- **Mystery Meat:** Icons MUST have labels or tooltips.
- **Pure Black/White:** Use off-blacks (#0A0A0A) and off-whites to avoid eye strain.

## 🚫 UX Sins
- **Form Frustration:** No labels inside inputs. No "clear all" without confirmation.
- **Mobile Hostility:** Minimum 44x44px tap targets. No hover-dependent logic for touch.
- **Content Crimes:** No walls of text. No auto-playing carousels.
- **Performance Crimes:** No unoptimized images. No layout shifts (CLS < 0.1).

## 🚫 Accessibility Failures
- **Keyboard Traps:** Ensure every interactive element is focusable via Tab.
- **Alt Text:** Every image needs descriptive alt text.
- **Color-Only info:** Never convey status (Error/Success) via color alone; use icons or text.
