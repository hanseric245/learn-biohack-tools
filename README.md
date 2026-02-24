# learn.biohack.tools

A step-by-step tutorial site for safely self-administering research peptides.

**Live:** https://learn.biohack.tools
**Repo:** https://github.com/hanseric245/learn-biohack-tools

---

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + **shadcn/ui**
- **next-mdx-remote** — MDX content loaded from the filesystem at build time
- **next-themes** — light/dark mode toggle
- Deployed on **Vercel**, auto-deploys on push to `main`

---

## Project Structure

```
learn-biohack-tools/
├── app/
│   ├── layout.tsx              # Root layout: ThemeProvider + Header
│   ├── page.tsx                # Redirects / → /step/0
│   ├── globals.css             # CSS custom properties for light/dark themes + prose styles
│   └── step/[slug]/page.tsx    # Dynamic page: loads MDX by slug, renders with layout
│
├── components/
│   ├── Header.tsx              # Sticky top nav with logo and theme toggle
│   ├── Sidebar.tsx             # Sticky left nav with all 8 steps + active state
│   ├── TutorialLayout.tsx      # Sidebar + main content wrapper
│   ├── SafetyCallout.tsx       # Reusable warning/info/danger callout block
│   ├── StepNav.tsx             # Previous / Next navigation at bottom of each page
│   ├── PeptideCalculator.tsx   # Embedded calculator (see note below)
│   ├── ThemeProvider.tsx       # next-themes wrapper
│   ├── ThemeToggle.tsx         # Sun/moon toggle button
│   ├── mdx-components.tsx      # Registers components available in MDX files
│   └── ui/button.tsx           # shadcn/ui Button
│
├── content/steps/              # MDX content files — one per step
│   ├── 0.mdx                   # Decide Which Peptides
│   ├── 1.mdx                   # Procure Peptides and Supplies
│   ├── 1a.mdx                  # Storage
│   ├── 2.mdx                   # Decide on Dose
│   ├── 3.mdx                   # Reconstitute (embeds PeptideCalculator)
│   ├── 4.mdx                   # Draw Into Needle
│   ├── 5.mdx                   # Inject
│   └── 6.mdx                   # Dispose Safely
│
└── lib/
    ├── steps.ts                # Step order, slugs, titles — single source of truth
    └── utils.ts                # cn() helper (clsx + tailwind-merge)
```

---

## Content

All tutorial content lives in `content/steps/*.mdx`. Each file uses frontmatter:

```mdx
---
title: Your Step Title
step: 0
description: One-sentence description shown under the heading.
estimatedReadTime: 5
prerequisites:
  - Step 0 — Decide Which Peptides
---

Your content here...
```

### Available components in MDX

No imports needed — these are globally registered in `components/mdx-components.tsx`:

**`<SafetyCallout>`**
```mdx
<SafetyCallout variant="warning" title="Optional Title">
  Your warning text here.
</SafetyCallout>
```
Variants: `warning` (amber), `danger` (red), `info` (cyan)

**`<PeptideCalculator />`**
```mdx
<PeptideCalculator />
```
Renders the embedded dosage calculator (used on Step 3).

---

## Adding or Editing Steps

### Edit content
Open the relevant file in `content/steps/` and edit the MDX. Push to `main` — Vercel auto-deploys.

### Add a new step
1. Create a new MDX file in `content/steps/` (e.g. `7.mdx`)
2. Add it to the `STEPS` array in `lib/steps.ts` in the correct position
3. The sidebar, StepNav prev/next, and static generation all derive from that array automatically

### Change step order
Edit the `STEPS` array in `lib/steps.ts`. Everything else follows.

---

## PeptideCalculator Note

`components/PeptideCalculator.tsx` is a **copy** (not a shared package) of the calculator from [biohack.tools](https://biohack.tools) (`hanseric245/biohack-tools`). The page-level chrome (header, background, version number) has been stripped so it renders as an embedded card.

If the calculator is updated in `biohack-tools`, copy the file over manually and re-apply the same changes:
- Change `export default` → `export` (named export)
- Replace the outer return wrapper with `<div className="print:hidden">` directly wrapping the card
- Remove the `<header>` section, `<main>` wrapper, disclaimer `<p>`, and version `<p>`

---

## Local Development

```bash
npm install
npm run dev     # runs on http://localhost:3000
```

To use a different port:
```bash
npm run dev -- --port 3335
```

---

## Deployment

Vercel is connected to this GitHub repo. Push to `main` to deploy.

To force a manual deploy:
```bash
npx vercel --prod --yes
```

Custom domain (`learn.biohack.tools`) is configured in Vercel and points to this project via a CNAME record on Namecheap DNS for `biohack.tools`.
