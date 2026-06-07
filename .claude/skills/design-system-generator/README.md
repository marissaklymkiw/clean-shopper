# Design System Generator

A Claude Code skill that turns light direction into a complete, buildable design system. You answer up to five short questions about the look and feel you want. The skill does the rest: it generates a `design.md` token specification and a `design-system.html` page that visualizes the whole system before you build anything.

This is the example skill used in **Module 2 of Claude Code for Designers (CCD)**, where you learn to download a skill from GitHub, install it, and run it. Read the `SKILL.md` file in this repo. It is intentionally short and plain so you can see how a skill is put together: a frontmatter block that tells Claude when to use it, followed by clear instructions for what to do.

## What you get

- **`design.md`** — the source of truth. Color, typography, spacing, radius, shadow, component styling, and voice, written as both CSS custom properties and a Tailwind theme block. This is the file Claude reads when building your project.
- **`design-system.html`** — a self-contained page showing your palette, type scale, spacing, and components rendered with the real tokens. Open it in a browser to see your system.

## What's in this repo

```
clean-shopper/
└── design-system-generator/
    ├── SKILL.md                  the skill itself (read this)
    ├── templates/
    │   ├── design-template.md    structure for the generated design.md
    │   └── design-system.html    structure for the visualizer page
    ├── examples/
    │   └── example-design.md     a sample of what the skill produces
    ├── LICENSE
    └── README.md
```

---

## Install

You need Claude Code installed and working. If you don't have it yet, follow the Module 1 setup first.

### Step 1 — Download the skill

Clone the repo:

```bash
git clone https://github.com/tinkerbellrc/clean-shopper.git
```

Or, on the GitHub page, click the green **Code** button, choose **Download ZIP**, and unzip it.

### Step 2 — Install it into Claude Code

Skills live in a `.claude/skills/` folder. You can install the skill for a single project or for every project on your machine.

**For one project** (recommended while you are learning). From inside your project folder:

```bash
mkdir -p .claude/skills
cp -r /path/to/clean-shopper/design-system-generator .claude/skills/
```

**For every project** (user level):

```bash
mkdir -p ~/.claude/skills
cp -r /path/to/clean-shopper/design-system-generator ~/.claude/skills/
```

Replace `/path/to/` with wherever you cloned or unzipped the repo. The important part is that `SKILL.md` ends up at `.claude/skills/design-system-generator/SKILL.md`.

### Step 3 — Confirm it's there

```bash
ls .claude/skills/design-system-generator
```

You should see `SKILL.md`, `templates/`, and `examples/`.

---

## Run

Open Claude Code in your project folder and ask for a design system in plain language. Any of these will trigger the skill:

```
Create a design system for this project
Set up the visual direction before we build
Help me style this site
```

Claude will look at your project, ask you up to five quick questions about the direction you want, and then write `design.md` and `design-system.html` into your folder. Open the HTML file in a browser to see the result. If something feels off, tell Claude what to change and it will regenerate.

You only give direction. The skill does the heavy lifting.

---

## How it works

1. **Reads your project.** It checks for a brief, your framework, and any existing styling. A brand new project with nothing in it is fine. The questions carry the direction in that case.
2. **Asks up to five questions.** Overall direction (minimal, natural, modern, bold, futuristic), the feeling you want, reference sites, color leaning, and any dos and don'ts. Easy to answer, no design jargon required.
3. **Generates the system.** A coherent palette with contrast checks, a type pairing, spacing and elevation scales, component styling, and a short voice section, written into `design.md` and rendered into `design-system.html`.

## License

MIT. See `LICENSE`.
