# Dimension 5: Animations & Interactions (The Soul)

Advanced interaction guidelines for the "Ultimate Architect" skill.

## 🖱️ Premium Micro-Interactions
- **Magnetic Buttons:** Subtle pull towards the cursor within a 20px radius.
- **Tilt Effect:** 3D perspective rotation (max 2deg) on cards.
- **Border Beams:** Animated gradient border (Linear-style) for featured CTAs.
- **Glass Shimmer:** Shimmer background for loading skeletons (1.5s infinite).

## 📜 High-End Scroll Reveals
- **Staggered Entry:** 100ms delay between grid items.
- **Text Split Reveal:** Animate lines or words individually for editorial impact.
- **Parallax Layers:** Split background and foreground movement (0.5x vs 1.2x).

## 🔀 Route & Modal Transitions
- **The Crossfade:** Overlap old/new content with 200ms opacity transition.
- **Scale Entrance:** `scale(0.95 -> 1.0)` for modals to add "pop".
- **Backdrop Blur:** Animate blur `0 -> 10px` during modal entrance.

## 🚀 Performance & Performance Rules
- **Layer Optimization:** Use `will-change: transform` sparingly for heavy elements.
- **Passive Listeners:** Ensure scroll events are non-blocking.
- **Thresholds:** Animations should trigger when 20% of the element is visible.
- **Constraint:** Interaction feedback MUST be <300ms.

---

## ♿ Interaction Accessibility
- **Reduced Motion:** Provide static fallbacks for every animation.
- **Focus Indicators:** Always visible, minimum 3px width, contrast 3:1.
- **Avoid:** Flashing content (>3hz), auto-playing videos with sound.
