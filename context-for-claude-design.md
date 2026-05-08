# Portfolio Context — Victoria Fox

A complete reference for design work on Victoria Fox's portfolio website.

---

## Project overview

A portfolio for Victoria Fox, a Product Design Lead (12+ years) currently pivoting into AI. Static, no-framework website — plain HTML, CSS, and vanilla JS only.

**Goals:**
- Present Victoria as a senior design leader and credible AI practitioner with a focus on startups
- Reflect her design sensibility: considered, high-craft, minimal, purposeful

**Tech stack:** HTML/CSS/JS only. Fonts: Roslindale Display (headings, loaded as local variable TTF) + DM Sans (body/UI) via Google Fonts. DM Mono also loaded but not currently in use. No CMS, no backend, no build tools.

---

## Identity & contact

- **Name:** Victoria Fox
- **Nav/logo:** VF
- **Location:** United Kingdom
- **Email:** vickyloufox@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/victoria-fox-b267708/
- **Github:** https://github.com/vickylouloufox

---

## Page sections (in order, as built)

1. **Nav** — sticky; left: VF logo; centre: `nav__contextual` (LinkedIn, GitHub, Email, Download CV — hidden by default, shown contextually); right: Email link
2. **Hero** — animated stage driven by `hero-animation.js`; no static text fallback visible at load
3. **Tagline** — standalone section immediately below hero; reads "Product designer – building with AI" in display type
4. **About** — two-part layout: bio copy up top, then a horizontal rule, then a portrait + three columns (Experience, Education, Links)
5. **Recommendations** — carousel of 4 cards with avatar photos, quote, name, and relationship; labelled "Praise"
6. **Case Studies** — filterable list of 5 work items with coloured tags (sector + type); labelled "Case Studies"
7. **Skills** — numbered rows (01–06) + logo row of tool icons; labelled "Skills"
8. **Reading** — exists in HTML but is commented out / hidden
9. **Footer** — minimal: "© Victoria Fox"

**Not in the site:** Custom GPT section (removed). Experience & education are integrated into the About section, not a separate section.

---

## About section

### Bio (written)

> Twelve years as a founding and early-stage designer at startups — the kind of environments where you're defining the product, the process, and the design culture at the same time.
>
> I'm drawn to the technical edge: systems thinking, logic, the place where design meets engineering. Artistic taste with real technical ambition — and AI has made that edge a lot more interesting.

### Experience column

| Company | Role | Dates |
|---|---|---|
| Translucent | Head of Design | 2022–23 |
| On Deck | Product Design Manager | 2021–23 |
| Attest / Numan / Parla | Freelance Product Designer | 2018–20 |
| Bloom & Wild | Product Design Lead | 2016–18 |
| MR PORTER | Lead Interaction Designer | 2015–16 |

### Education column

- Ravensbourne — MA, Communication Design · 2010–11 · 1st
- Central St Martins — BA, Art & Design · 2000–03 · 2:1

### Manifesto themes (inform copy/tone, not all on-page)

- AI for extending thinking, not replacing it
- Generalist mindset
- Knowing what not to build — discernment is more important now
- The value of designers is managing the system, not producing the 90%-good-enough output a PM can now generate

---

## Recommendations

Four-card carousel, labelled "Praise". All cards have real LinkedIn avatar photos.

| Person | Role | Relationship |
|---|---|---|
| Yanel Bottini | Senior IC Designer | Reported to Victoria · On Deck · 2022 |
| Adam Francis | App Developer | Senior to Victoria · 2018 |
| Aimen Rafique-Marsh | Product · UX/UI | Same team · 2020 |
| Mag Leahy | Thinking Ally & Coach | Same team · 2017 |

Full quotes are in [recommendations.md](recommendations.md).

---

## Case studies

5 case studies, displayed as a filterable list. Each item has a sector tag + type tags. Case study pages live at the root (not a subdirectory).

| # | Company | Headline | Tags | File |
|---|---|---|---|---|
| 1 | Little Desk | From idea to launch: designing and shipping a children's learning app with Cursor AI | Education · 0→1 · iOS · B2C | `little-desk.html` |
| 2 | Translucent | Zero to one: designing and shipping a fintech suite from scratch | Fintech · 0→1 · Web · B2B SaaS | `translucent.html` |
| 3 | Attest | Fixing design debt: rebuilding Attest's core product flow | Research · Growth · Web · B2B SaaS | `attest.html` |
| 4 | On Deck | Migrating 100k members: designing a segmented upgrade flow | Community · Growth · Web · B2C | `on-deck.html` |
| 5 | Bloom & Wild | How research-led design helped Bloom & Wild scale from £4M to £13M | E-commerce · Growth · iOS · Android · B2C | `bloom-wild.html` |

All case study pages are drafts. Full content in [case-studies.md](case-studies.md).

**Filter tags in use:** `0→1`, `Growth`, `iOS`, `Android`, `Web`, `B2C`, `B2B SaaS` — each has a coloured `wtag` class.

---

## Skills

Numbered rows (not cards), labelled "Skills".

| # | Title | Body |
|---|---|---|
| 01 | Design Engineering | Building and shipping with modern tooling — not just handing off. |
| 02 | Product Strategy | Knowing what to build — and, more importantly, what not to. |
| 03 | Design Leadership | Building teams, practices and cultures — not just outputs. |
| 04 | Systems Thinking | Designing the system, not just the screen. |
| 05 | User Research | Empathy‑led process, validated with data. |
| 06 | Taste & Craft | A consistent, considered point of view — at speed. |

**Tools logo row** (SVG icons + label, class `logo-row`):
Claude · Antigravity · Cursor · Figma · GitHub · NotebookLM · Dovetail

Full skill descriptions and tools list in [skills.md](skills.md).

---

## Design principles

- Clean, editorial feel — generous whitespace, restrained colour palette
- Typography-led: Roslindale Display for display headings, DM Sans for everything else
- Scroll reveal animations (`.reveal` / `.reveal-group` classes, handled in `script.js`)
- Responsive-first — test mobile and desktop for every change
- No decorative clutter — icons are functional, not decorative
- The site itself should demonstrate taste — every spacing, type, and colour decision is an argument for Vicky's point of view

Full principles in [design-principles.md](design-principles.md). Visual/layout references in [references.md](references.md).

---

## Coding conventions

- BEM class naming (e.g. `.rec-card__meta`, `.work-item__tags`, `.skill-row__title`)
- Section structure: `.section` > `.container` > section-specific elements; many sections use `.sl` > `.sl__label` + `.sl__body` layout
- Shared utilities: `.btn`, `.btn--primary`, `.btn--ghost`, `.section-label`, `.tag`, `.reveal`, `.wtag`, `.wtag--[type]`
- No CSS frameworks, JS libraries, or build steps
- CSS custom properties for colours, fonts, and spacing defined in `:root`
