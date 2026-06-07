# CLAUDE.md

## Design system (read before any UI work)
Before creating or changing any UI — components, pages, styles, layout, copy in the interface — **read [docs/design.md](docs/design.md) first and apply it.** It is the single source of truth for color, typography, spacing, radius, shadow, component styling, and voice. Do not introduce colors, fonts, spacing, radii, or shadows that are not defined there; if something the design needs is missing, update `docs/design.md` (and regenerate `docs/design-system.html`) rather than hardcoding a one-off value.

## References
- [docs/project-context.md](docs/project-context.md) — Clean Shopper project context document (problem, ICP, solution, constraints, open questions).
- [docs/design.md](docs/design.md) — Design system source of truth (see the rule above). [docs/design-system.html](docs/design-system.html) visualizes it.
- [.claude/skills/prompt-optimizer/SKILL.md](.claude/skills/prompt-optimizer/SKILL.md) — Use /prompt-optimizer to evaluate and refine instructions before sending them.
- [.claude/skills/project-context/SKILL.md](.claude/skills/project-context/SKILL.md) — Use /project-context to generate a structured project context document from a brief, PRD, or rough notes.
- [.claude/skills/design-system-generator/SKILL.md](.claude/skills/design-system-generator/SKILL.md) — Use /design-system-generator to (re)generate the design system (design.md + design-system.html) from light style direction.
