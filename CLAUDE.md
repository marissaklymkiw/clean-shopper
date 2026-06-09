# CLAUDE.md

## Design system (read before any UI work)
Before creating or changing any UI — components, pages, styles, layout, copy in the interface — **read [docs/design.md](docs/design.md) first and apply it.** It is the single source of truth for color, typography, spacing, radius, shadow, component styling, and voice. Do not introduce colors, fonts, spacing, radii, or shadows that are not defined there; if something the design needs is missing, update `docs/design.md` (and regenerate `docs/design-system.html`) rather than hardcoding a one-off value.

## Conventions
- **Styling:** Use Tailwind theme classes for all design token values. Never hardcode hex colors, pixel font sizes, or spacing values in components. If a needed token does not exist in the Tailwind config, add it there rather than hardcoding the value. This means `bg-accent` not `#2B8463`, `text-h3` not `text-lg`, `p-lg` not `p-4`.
- **Components:** Always check [docs/component-spec.md](docs/component-spec.md) before building any UI element. If an existing component covers the use case, use it. Only create a new component if no spec covers the pattern, and add the new component to component-spec.md before moving on.

## References
- [docs/project-context.md](docs/project-context.md) — Clean Shopper project context document (problem, ICP, solution, constraints, open questions).
- [docs/design.md](docs/design.md) — Design system source of truth (see the rule above). [docs/design-system.html](docs/design-system.html) visualizes it.
- [docs/component-spec.md](docs/component-spec.md) — Component spec: use existing components before creating new ones. Follow the spec for props, states, and visual structure.
- [tailwind.config.js](tailwind.config.js) — Design tokens as Tailwind theme extensions. Always use theme classes, never hardcode values.
- [.claude/skills/prompt-optimizer/SKILL.md](.claude/skills/prompt-optimizer/SKILL.md) — Use /prompt-optimizer to evaluate and refine instructions before sending them.
- [.claude/skills/project-context/SKILL.md](.claude/skills/project-context/SKILL.md) — Use /project-context to generate a structured project context document from a brief, PRD, or rough notes.
- [.claude/skills/design-system-generator/SKILL.md](.claude/skills/design-system-generator/SKILL.md) — Use /design-system-generator to (re)generate the design system (design.md + design-system.html) from light style direction.
