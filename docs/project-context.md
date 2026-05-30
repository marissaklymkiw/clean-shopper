# Project Context Document
**Project:** Clean Shopper
**Date:** 2026-05-30
**Source:** Project brief — "CCDCourse_CleanShopper_ProjectBrief.md" (Demo Project Brief for Claude Code for Designers)
**Version:** 1.0

---

## 1. Problem Statement
Researching whether home, personal care, and pantry products are genuinely clean and non-toxic is slow, fragmented, and requires expertise most shoppers don't have. Ingredient lists are hard to interpret, on-package "clean" and "natural" claims are often unverified, and there is no single place to hold a person's accumulated preferences — so informed purchasing decisions are far harder than they should be.

## 2. ICP (Ideal Customer Profile)
Someone actively trying to make more informed purchasing decisions for their home and family — replacing toxic cleaning products, finding personal care items without harmful chemicals, or stocking a pantry with cleaner food options. They are already motivated to research alternatives and care about ingredient safety and sustainability, but find the work overwhelming and time-consuming. They are currently piecing research together across multiple sources and have no consistent place to store the trusted brands and avoided ingredients they've learned over time.

## 3. Pain Points
- Product labels are confusing and ingredient lists require expertise to interpret.
- "Clean" and "natural" claims on packaging are often misleading or unverified.
- Researching alternatives across multiple sources is fragmented and slow.
- Preferences built up over time — trusted brands, avoided ingredients — have nowhere to live and must be re-applied manually each time.

## 4. Proposed Solution
Clean Shopper is an AI-powered agent, backed by Claude, that works through a conversational interface. A user can:
- Describe what they're looking for and receive researched product recommendations evaluated against clean standards, with reasoning. Claude searches the web in real time and draws on ingredient-safety databases like EWG's Skin Deep.
- Save preferences — ingredients to avoid, trusted brands, and certifications that matter (EWG Verified, USDA Organic, B Corp, etc.) — which are then applied automatically to every subsequent recommendation.
- Add recommended products to a shopping cart that persists across sessions.
- Ask Clean Shopper to compare products side by side and get a clear recommendation based on their saved preferences.

## 5. Success Metrics

**North Star: Recommendation → action rate** — the percentage of recommendations the user adds to their cart. This is the clearest single signal that Clean Shopper produced something trustworthy and relevant enough to act on, and it is measurable in V1 on a per-session basis without requiring accounts.

**Supporting metrics:**

| Dimension | Metric | Why it matters |
|---|---|---|
| Value delivered | Time from question to a usable recommendation | The core pain is that research is *slow*; speed is a primary value. |
| Trust / quality | Preference-adherence rate — share of recommendations that respect saved avoid-lists and required certifications | One bad recommendation breaks trust in a safety-oriented tool. |
| Personalization loop | Percentage of users who save at least one preference | Saved preferences are the product's differentiator; no preferences means a generic research tool. |
| Decision support | Comparison-to-decision rate — share of side-by-side comparisons that end in a clear choice | Validates the "help me decide" job specifically. |
| Stickiness | Return usage and cart reuse across sessions | Research tools earn their value on repeat use. |

**Measurement caveat:** V1 has no accounts or authentication, so any per-user or retention metric can only be approximated via device/session persistence. These figures will be noisy and will not survive a cleared browser or device switch. The North Star and most supporting metrics are deliberately session-measurable; "return usage" should be treated as directional only in V1.

## 6. Design Constraints
Platform: Conversational interface backed by Claude. Web is implied (no mobile app in V1), but the surface is not explicitly stated. Not a mobile app for V1.
Geography: Not defined in source material.
Accessibility: Not defined in source material.
Technical: Backed by Claude. Real-time web search for product research; draws on external ingredient-safety data sources such as EWG's Skin Deep. No user accounts or authentication in V1. Cart and saved preferences persist across sessions via browser **localStorage** (client-side only). Persistence scope in V1 is cart + preferences only — conversation history is not persisted and each session starts fresh. No checkout/payment processing, no direct retailer integrations, no barcode scanning in V1.

> **Persistence note (V1 decision):** localStorage was chosen over IndexedDB and a backend store because it satisfies "persist across sessions" with no infrastructure and fits the no-auth V1 scope. Accepted trade-offs: data is device- and browser-bound (no cross-device sync) and is lost if the user clears browsing data. A future version wanting durability or cross-device sync would move to an anonymous-ID backend store, which is the natural next step once accounts/auth are in scope.
Other: This is the course demo project for "Claude Code for Designers." Students build it over four weeks using Claude Code, with the instructor demonstrating the full workflow live each session — so the project doubles as a teaching artifact, which may influence scope and pacing decisions.

## 7. Open Questions
1. Which specific data sources beyond EWG's Skin Deep define the "clean standards" used to evaluate ingredients, and how are conflicting sources reconciled?
2. What is the exact delivery surface for the conversational interface (web app, embedded chat, other)?
3. How are product recommendations sourced for purchase if there are no direct retailer integrations — links out, manual lookup, or something else?
4. What does the cart enable if checkout and payment are out of scope (a saved list, an export, hand-off to a retailer)?
5. How current and trustworthy must the ingredient-safety data be, and how is freshness handled given real-time web search?

*Resolved: Cart/preference persistence (was Q1) — V1 uses client-side localStorage, cart + preferences only. See Section 6.*

## 8. Gaps
1. **Geography** — No launch region or regional restrictions are stated; ingredient regulations and certifications (and the relevance of databases like EWG) can be region-specific, which affects content and trust.
2. **Accessibility** — No accessibility requirements are stated; for a research-and-comparison tool with dense information, this materially shapes the design.
3. **Recommendation-to-purchase path** — With no checkout or retailer integration, how a user actually acts on a recommendation is undefined, leaving a gap in the end-to-end journey.
4. **Standards definition** — "Clean," "non-toxic," and "environmentally friendly" are central to the product but not concretely defined beyond example certifications and one named database; the design needs clear criteria to present trustworthy, consistent evaluations.

*Notes on previously listed gaps:*
- *Success metrics — now defined in Section 5. A target/baseline for the North Star (recommendation → action rate) still needs to be set once there is data to calibrate against.*
- *Persistence mechanism — now decided in Section 6 (client-side localStorage, cart + preferences only).*

---
*Generated by /project-context skill. Add to this document as decisions are made and questions are resolved.*
