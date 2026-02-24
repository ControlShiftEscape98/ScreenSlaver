# The Reasoning Engine: 100 Industry-Specific Rules

This engine uses specialized rules to match project types to design requirements.

## 🏢 Tech & SaaS
- **Categories:** Micro SaaS, B2B Enterprise, Dev Tools, AI Platform.
- **Priority Style:** Linear/Vercel (Dark Mode) or Bento Grid.
- **Color Mood:** Vibrant & Modern (Indigo/Emerald).
- **Pattern:** Hero + Features + Demo.

## 🏦 Finance & Fintech
- **Categories:** Banking, Crypto, Insurance, Trading.
- **Priority Style:** Clean Minimalism / High Contrast.
- **Color Mood:** Trust & Professionalism (Navy/Slate).
- **Anti-Pattern:** No "AI purple/pink gradients" or harsh animations.

## 🌿 Healthcare & Wellness
- **Categories:** Spa, Medical Clinic, Dental, Mental Health.
- **Priority Style:** Soft UI Evolution / Biomorphic.
- **Color Mood:** Wellness (Cyan/Sage/Warm White).
- **Pattern:** Hero-Centric (Emotion-driven) + Social Proof.

## 💎 Luxury & E-commerce
- **Categories:** Fashion, High-end Marketplace, Editorial.
- **Priority Style:** Minimalist Luxury / Editorial.
- **Color Mood:** Sophisticated (Stone/Gold/Warm Black).
- **Typography:** Serif headings (Cormorant Garamond) + Sans body.

## 🎨 Creative & Entertainment
- **Categories:** Portfolio, Agency, Gaming, Music.
- **Priority Style:** Aurora UI / Liquid Glass / Cyberpunk.
- **Color Mood:** Creative/Playful (Pink/Purple/Amber).
- **Interaction:** High energy, immersive transitions.

---

## Processing Decision Rules
1.  **Product Match**: Determine the industry category.
2.  **Style Ranking**: Use BM25 ranking principles to prioritize the top 3 styles from the 67 available.
3.  **Palette Filtering**: Select from 96 palettes based on the "Color Mood."
4.  **Anti-Pattern Audit**: Cross-reference the industry with forbidden patterns (e.g., No dark mode for high-end healthcare unless requested).
