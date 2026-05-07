# Victoria Fox — Portfolio Website

## Project overview
A portfolio for Victoria Fox, a Product Design Lead (12+ years) currently pivoting into AI. Static, no-framework website — plain HTML, CSS, and vanilla JS only.

## Goals
- Present Victoria as a senior design leader and credible AI practitioner with a focus on startups
- Reflect her design sensibility: considered, high-craft, minimal, purposeful

## Tech stack
- **HTML/CSS/JS** — no frameworks, no build tools, no dependencies
- **Fonts:** Roslindale Display (headings, local variable TTF) + DM Sans (body/UI, Google Fonts)
- **No CMS, no backend** — pure static files

## File structure
```
index.html          — single page, all sections in order
styles.css          — all styles
script.js           — scroll reveal, mobile nav, email copy toast
hero-animation.js   — animated hero stage
bloom-wild.html     — case study page
attest.html         — case study page
on-deck.html        — case study page
translucent.html    — case study page
little-desk.html    — case study page
cv.md               — full CV/work history (source of truth for copy)
case-studies.md     — case study metadata and status
recommendations.md  — full LinkedIn recommendation text
context-for-claude-design.md — comprehensive design + content reference
references.md       — design reference sites
```

## Page sections (in order)
1. **Nav** — sticky; VF logo left; Email link right; `nav__contextual` centre (LinkedIn, GitHub, Email, Download CV — shown contextually)
2. **Hero** — animated stage driven by `hero-animation.js`
3. **Tagline** — standalone section; "Product designer – building with AI"
4. **About** — bio paragraph, then portrait + three columns (Experience, Education, Links)
5. **Recommendations** — carousel of 4 cards with LinkedIn avatars; labelled "Praise"
6. **Case Studies** — filterable list of 5 work items with coloured `wtag` tags; labelled "Case Studies"
7. **Skills** — numbered rows 01–06 + logo row of SVG tool icons; labelled "Skills"
8. **Reading** — exists in HTML but commented out / hidden
9. **Footer** — "© Victoria Fox"

## Identity
- **Name:** Victoria Fox · nav/logo: VF
- **Email:** vickyloufox@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/victoria-fox-b267708/
- **GitHub:** https://github.com/vickylouloufox
- **Key credential:** App of the Year 2017 (Bloom & Wild iOS, Startup Awards)

## Conventions
- BEM class naming — e.g. `.rec-card__meta`, `.work-item__tags`, `.skill-row__title`
- Section structure: `.section` > `.container` > section-specific elements
- Many sections use `.sl` > `.sl__label` + `.sl__body` layout pattern
- Shared utilities: `.btn`, `.btn--primary`, `.btn--ghost`, `.reveal`, `.tag`, `.wtag`, `.wtag--[type]`
- Do not introduce CSS frameworks, JS libraries, or build steps without agreement

## Design principles + references
Follow [context-for-claude-design.md](context-for-claude-design.md) for design principles and current content detail. Consult [references.md](references.md) when making visual or layout decisions.

## Source files
- [cv.md](cv.md) — full work history with bullet-point detail; use when writing case study copy or bio
- [case-studies.md](case-studies.md) — case study metadata and status
- [recommendations.md](recommendations.md) — full LinkedIn recommendation text
