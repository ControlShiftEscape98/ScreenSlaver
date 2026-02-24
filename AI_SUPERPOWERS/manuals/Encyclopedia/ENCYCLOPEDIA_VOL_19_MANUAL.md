# Entrepreneurship, Product Management, and Technical Strategy Study Guide

This study guide synthesizes principles from a wide array of business, technical, and strategic domains to provide a comprehensive foundation for building, launching, and scaling modern software products.

---

## I. Core Frameworks and Strategic Concepts

### 1. Launch Strategy: The ORB Framework
Successful launches build momentum over time rather than relying on a single moment of exposure. The ORB Framework categorizes channels to ensure sustainable growth:
*   **Owned Channels:** Platforms you control (Email lists, blogs, branded communities). These provide direct access and compound value over time.
*   **Rented Channels:** Third-party platforms (Social media, App Stores, YouTube). These provide speed and visibility but are subject to algorithm shifts.
*   **Borrowed Channels:** Tapping into others' audiences (Guest posts, influencer partnerships, podcast interviews). These provide instant credibility and shortcuts to attention.

### 2. Product Management: Prioritization and Discovery
The **RICE Framework** is the standard for objective feature prioritization:
*   **Reach:** Number of users affected per quarter.
*   **Impact:** Contribution to the goal (Massive, High, Medium, Low, Minimal).
*   **Confidence:** How sure you are about your estimates (High, Medium, Low).
*   **Effort:** Person-months required to build.

**The MoSCoW Method** further categorizes requirements into *Must Have*, *Should Have*, *Could Have*, and *Won't Have*.

### 3. Market Opportunity Analysis (TAM/SAM/SOM)
Evaluating a startup opportunity requires a three-tier framework to understand the market scale:
*   **TAM (Total Addressable Market):** Total revenue opportunity at 100% market share.
*   **SAM (Serviceable Available Market):** The portion of TAM targetable with current products/capabilities.
*   **SOM (Serviceable Obtainable Market):** The realistic market share achievable within 3–5 years given competition and resources.

### 4. SEO Fundamentals: E-E-A-T and Core Web Vitals
Modern search engines evaluate quality through the **E-E-A-T** framework:
*   **Experience:** First-hand, real-world involvement.
*   **Expertise:** Subject-matter competence.
*   **Authoritativeness:** Recognition by others/citations.
*   **Trustworthiness:** Reliability, safety, and transparency.

**Core Web Vitals (CWV)** measure user experience via three metrics:
*   **LCP (Largest Contentful Paint):** Loading performance (< 2.5s).
*   **INP (Interaction to Next Paint):** Interactivity (< 200ms).
*   **CLS (Cumulative Layout Shift):** Visual stability (< 0.1).

---

## II. Short-Answer Practice Questions

**1. What is the defining trait of a successful founder according to Paul Graham’s observations?**
*Answer:* Being "Relentlessly Resourceful." This means treating obstacles as puzzles rather than walls and finding ways to move forward even when resources are lacking.

**2. Why is retention considered the "ultimate truth" of Product-Market Fit (PMF)?**
*Answer:* Vanity metrics (like downloads or signups) can be bought, but retention proves that a product actually satisfies a strong market demand over time. PMF is a spectrum measured by users staying and finding value.

**3. What are the three methods used to calculate market size?**
*Answer:* Top-down (industry reports), Bottom-up (customer segment calculations/pricing), and Value Theory (estimating willingness to pay based on value created).

**4. In technical debt management, what is the "Boy Scout Rule"?**
*Answer:* It means "leaving the code better than you found it." Instead of isolated refactoring sprints, developers should refactor in context while building features that touch that specific code.

**5. What is an "Idempotent" webhook handler in payment processing?**
*Answer:* It is a system that ensures a webhook event (like a payment confirmation) is only processed once, even if the payment provider sends the same notification multiple times due to retries or network issues.

**6. What is the "Feasibility Index" in Programmatic SEO?**
*Answer:* A diagnostic score (0–100) that determines if a use case is structurally suited for generating pages at scale. It weights factors like search pattern validity, unique value per page, and data quality.

---

## III. Essay Prompts for Deeper Exploration

### 1. The Interplay of Growth Loops and Sustainable Growth
Discuss the difference between "growth hacks" and "growth loops." Using the principle that "acquisition without retention is a leaky bucket," explain how a self-reinforcing system (where the output of one cycle becomes the input for the next) is superior to traditional linear marketing campaigns. Reference the idea that the best loops are invisible and feel like natural product usage.

### 2. Strategic Technical Debt vs. Reckless Debt
"Technical debt is not a sin; it is a tool." Evaluate this statement in the context of a startup's journey from MVP to Series A. Contrast *deliberate debt* (conscious trade-offs for speed) with *accidental debt* (mess created by lack of knowledge). How should a technical leader communicate the "interest payments" of debt to non-technical stakeholders in terms of velocity and reliability?

### 3. The YC Playbook and the "Launch Now" Mentality
Y Combinator emphasizes "launching now" and "talking to users." Analyze why building in secret is considered a critical anti-pattern for Micro-SaaS and startups. How does early, manual work (doing things that don't scale) provide the necessary "Message-Market Fit" that paid advertising fails to deliver?

---

## IV. Glossary of Important Terms

| Term | Definition |
| :--- | :--- |
| **ACV** | Average Contract Value; the average revenue generated from a single customer contract. |
| **AMM** | Automated Market Maker; a decentralized finance (DeFi) protocol that allows for the automated trading of assets using liquidity pools. |
| **CAC** | Customer Acquisition Cost; the total cost of winning a customer to purchase a product or service. |
| **Default Alive** | A state where a company will become profitable before running out of money if current growth and burn rates continue. |
| **ERC-3643 (T-REX)** | A standard for tokenizing Real-World Assets (RWA) that includes built-in compliance and transfer restriction logic. |
| **LTV** | Lifetime Value; the total revenue a business can reasonably expect from a single customer account. |
| **North Star Metric** | The single most important metric that reflects the core value a product delivers to its customers. |
| **PDA (Solana)** | Program Derived Address; an account address on Solana derived from a program ID and specific seeds, used for secure on-chain storage. |
| **RICE Score** | A calculated value (Reach × Impact × Confidence / Effort) used to rank and prioritize product features. |
| **Tokenization** | The process of converting rights to an asset into a digital token on a blockchain. |
| **Van Westendorp** | A price sensitivity research method used to identify acceptable price ranges by asking customers at what point a product is "too cheap" or "too expensive." |
| **Waitlist (FOMO)** | A marketing tactic used to build demand and exclusivity by restricting immediate access to a product. |
| **Webhook Signature** | A security mechanism (usually HMAC) used to verify that a notification sent to your server actually came from the intended provider (e.g., Stripe or Plaid). |