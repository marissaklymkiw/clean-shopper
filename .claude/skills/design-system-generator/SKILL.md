---
name: design-system-generator
description: Generates a complete design system for a project from light user input. Reads the project context, asks the user up to five short questions about style direction (feeling, references, color leanings, dos and don'ts), then produces a design.md token specification and a self-contained HTML page that visualizes the system. Use this skill when a user wants to define the look and feel of a site or app before building, says "create a design system," "set up the visual direction," "I need design tokens," "help me style this project," or is starting a build in Claude Code and wants a consistent foundation for color, typography, spacing, components, and voice. The skill does the heavy lifting. The user gives direction, not specifications.
---

# Design System Generator

You generate a complete, buildable design system for the user's project. The user should not have to know design vocabulary or write specifications. They give you direction and references. You translate that into a real system: color, typography, spacing, radius, shadow, component styling, and voice, expressed as design tokens the rest of the build can use.

You produce two files in the user's working folder:

1. `design.md` — the source of truth. Tokens written as CSS custom properties and a matching Tailwind theme block, plus component styling rules and a short voice section. This is the file Claude reads when building the project.
2. `design-system.html` — a self-contained page that visualizes the system so the user can see the palette, type scale, spacing, and components rendered before any building starts.

Keep the user's effort low. You ask at most five questions, and the questions are easy to answer. You do the synthesis.

---

## Step 1: Read the project context

Before asking anything, look at what already exists in the working folder. This tells you whether you are styling an existing project or starting from nothing, and it shapes the questions you ask.

Check for:

- A README, brief, PRD, or spec describing what the project is.
- The framework and stack: look for `package.json`, `tailwind.config.js`, `index.html`, or existing CSS. Note whether Tailwind is already in use.
- Existing components or pages, and any colors, fonts, or patterns already present.
- The project name and any stated audience or purpose.

If the folder is nearly empty, which is common for a new project, do not treat that as a problem. Say so briefly and lean more on the style questions in the next step. A greenfield project means the design questions carry the direction.

Summarize what you found in one or two sentences before moving on, for example: "This looks like a new portfolio site with Tailwind already installed and no styling yet. I'll ask you a few quick questions to set the direction."

---

## Step 2: Ask up to five questions

Ask the questions in a single message so the user can answer them together. Make them low effort. Offer concrete options so the user can pick rather than compose. The user can answer in a sentence or two total.

Adapt the set to what you learned in Step 1. Never ask more than five. If the project context already answers one of these, drop it and ask fewer.

The five areas to cover:

1. **Overall direction.** "Which of these is closest to what you want: minimal, natural and warm, modern and clean, bold and expressive, or futuristic? Pick one or blend two." Give them the vocabulary so they do not have to generate it.

2. **Feeling.** "When someone lands on this, what should they feel in the first few seconds? For example: calm and in control, energized, impressed by the craft, that this is serious and trustworthy." One or two words is enough.

3. **References.** "Are there any sites, products, or brands whose look you admire? Drop up to three. If none come to mind, skip this." References do a lot of work, but do not force them.

4. **Color leaning.** "Any color direction? You can name a vibe (earthy, cool and techy, monochrome, one bright accent on neutral), specific colors you want or want to avoid, or say 'you pick' and I will choose to fit the direction."

5. **Dos and don'ts.** "Anything you definitely want, or definitely want to avoid? For example: no dark mode, must be high contrast for accessibility, no rounded corners, keep it text-forward." Optional, but it prevents rework.

If the user gives thin answers, that is fine. Fill the gaps with sound choices that fit their stated direction and tell them what you assumed.

---

## Step 3: Generate the design system

Synthesize the answers into a coherent system. The goal is a system that feels intentional, where every choice supports the stated direction and the parts work together. Do not generate a generic palette. The minimal direction and the futuristic direction should produce visibly different systems.

Apply these standards as you build:

**Color.** Build a real palette, not a list of swatches. Include a background/surface foundation, primary text color, one or two accent colors, and functional colors (success, warning, error, info). Every color needs a stated usage. Check text-on-background contrast against WCAG AA (4.5:1 for body text, 3:1 for large text) and note the ratios. If the user asked for high contrast or accessibility, hold to AAA where practical.

**Typography.** Choose a display/heading face and a body face that fit the direction. Prefer typefaces available on Google Fonts or as reliable system stacks so the build works without licensing friction. Define a type scale (a modular scale such as 1.25 or 1.333 works well), line heights, and weights. State which font is used where.

**Spacing, radius, shadow.** Define a spacing scale (a consistent step such as 4px or 8px based), a radius scale, and a shadow/elevation scale. These should match the mood: tight and sharp for minimal or futuristic, softer and more generous for natural and warm.

**Components.** Give styling guidance for the common components a build will need: buttons (primary, secondary, and a disabled state), cards, inputs, and links. Describe them in terms of the tokens above, so the rules stay consistent with the system.

**Voice.** Write a short section on the written tone the interface should use: person (first, second, third), sentence rhythm, and how copy should feel. This keeps the words consistent with the look.

### Output format for design.md

Write `design.md` so Claude can read it and apply it directly during the build. Use the `templates/design-template.md` file in this skill as the structure. It must include both encodings: tokens as CSS custom properties in a `:root` block, and the same tokens mapped into a Tailwind theme block, so the system works whether or not the project uses Tailwind.

### Output for design-system.html

Generate `design-system.html` from `templates/design-system.html`. It is a single self-contained file with no external dependencies beyond Google Fonts. Inject the generated tokens into its `:root` and fill in the rendered swatches, type specimens, spacing scale, and component examples so the user sees their actual system, not a placeholder. The page must render correctly when opened directly in a browser by double-clicking.

---

## Step 4: Hand off

Save both files to the working folder. Tell the user what you created in two or three sentences: the direction you landed on, the key choices (palette character, type pairing), and how to use it. Point out that `design.md` is what Claude reads when building and `design-system.html` is for them to look at. Offer to adjust anything that does not feel right. Keep the handoff short. The files speak for themselves.

---

## Notes for this skill as a teaching artifact

This skill is used in the Claude Code for Designers course as the example students download, install, and run. Keep it readable. A student should be able to open this SKILL.md and understand how a skill is structured: frontmatter that tells Claude when to use it, then plain instructions for what to do. Do not add machinery that obscures that lesson.
