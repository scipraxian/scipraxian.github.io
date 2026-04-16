# Are-Self Docs — Tasks

Documentation site tasks for the Docusaurus deployment at are-self.com.
**Release: April 7, 2026.**

Last updated: April 14, 2026.

> **📘 Curriculum Framework — Planning lives elsewhere.**
> All curriculum-related planning (the new `are-self-learn` repo, the
> tag taxonomy, the course template, the frontmatter schema, the
> NanoBanana diagram, the HS Bio / CC Frameworks / Hypothalamus Cost
> Management courses, the vocabulary rules, and the frozen agile
> discussion) lives in:
> `are-self-documents/CURRICULUM-FRAMEWORK-PLAN.md`
> That file is the memory layer for the curriculum work. If this docs
> repo gets a curriculum-adjacent task, cross-reference that doc first.

## Docs-site tasks carried over from the curriculum discussion

- [ ] **Fix blockquote color contrast** — currently unreadable in the
  dark theme. File: `src/css/custom.css`. WCAG AA target.
- [x] **Storybook page published** — `docs/storybook.md` created with
  Chapters 1-7 + Epilogue (author notes appendix stripped). Added to
  `sidebars.js`. `curriculum/index.md` link updated to point to live
  `../storybook`.
- [ ] **Migrate `docs/curriculum/` → new `are-self-learn` repo** once
  that repo exists. Leave a redirect at the old URL. See planning doc.

## Completed

- [x] **CNS Editor walkthrough** (`docs/ui/cns-editor.md`) — Full content with 4 real screenshots
- [x] **API Reference crash fix** — MDX curly brace escaping (`{id}` → `&#123;id&#125;`)
- [x] **Hero button visibility** — Added dark-theme styles for `button--secondary` and `button--outline`
- [x] **Sidebar arrow artifacts** — Scoped `a::after` animated underline to `.markdown a` only
- [x] **501(c)(3) claim removed** from `docs/contributing.md`
- [x] **Research docs page** (`docs/research.md`) — Summaries of all 6 papers
- [x] **Research cross-linking** — Navbar, footer, homepage feature cards all link to research
- [x] **Homepage feature cards** — Now clickable links with glassmorphic hover effects
- [x] **are-self-research README** — Complete rewrite with paper table and build instructions
- [x] **All 6 LaTeX paper outlines** seeded in `are-self-research/papers/`
- [x] **Flagship paper draft** (`neuro-mimetic-architecture/paper.tex`) — Most complete
- [x] **Security documentation suite** — 5 docs in `docs/security/`
- [x] **Glassmorphic theme** — Dark-only, custom CSS complete
- [x] **CLAUDE.md** — Created and updated for session continuity
- [x] **Screenshot workflow** — html2canvas workaround documented in CLAUDE.md
- [x] **All 10 UI walkthrough stubs filled** (session 3) — blood-brain-barrier, identity,
  temporal-lobe, prefrontal-cortex, cns-monitor, frontal-lobe, hippocampus, hypothalamus,
  environments, pns. Each has full prose, Getting There, Key Concepts, and screenshot references.
- [x] **Quick Start guide** (`docs/quick-start.md`) — 5-minute install-to-first-spike walkthrough
- [x] **15 screenshots captured** via html2canvas + IBS, placed in `static/img/ui/`
- [x] **Broken links fixed** — contributing.md, getting-started.md, research.md, sbom.md,
  quick-start.md, environments.md, pns.md, hippocampus.md, hypothalamus.md, frontal-lobe.md
- [x] **MDX curly brace escaping** — `{id}`, `{value}`, `{query}` escaped across all brain-regions
  docs and api-reference
- [x] **Truncated config files restored** — package.json, sidebars.js, custom.css,
  index.js, index.module.css (corrupted during session 2, restored from git + manual repair)
- [x] **Corrupted CNS screenshots restored** — 4 files in static/img/ui/ had been overwritten
  with 4789-byte stubs; restored from git HEAD

## In Progress — Brain Region Docs Rewrite

Target: rewrite all brain-region docs from dry textbook style to kid-friendly, biology-first tone.
Write for a 10-year-old. Biological analogy woven in naturally (not a separate section). Every
brain-region cross-reference must be a clickable link. Technical accuracy stays — just framed warmly.

- [x] `hypothalamus.md` — Full rewrite. Circuit breaker, resource cooldown, scar tissue, vector
  matching, budgets, failover strategy. Mermaid error flow diagram. All verified against actual code.
- [x] `frontal-lobe.md` — Full rewrite. Reasoning loop, focus economy, failover, session statuses,
  Synapse Client error handling. Cross-linked to Hypothalamus for circuit breaker details.
- [x] `central-nervous-system.md` — Full rewrite. Pathways, spike trains, neurons, axons, axoplasm, cerebrospinal fluid.
- [x] `hippocampus.md` — Full rewrite. Engrams, vector dedup, provenance, focus economy tie-in.
- [x] `identity.md` — Full rewrite. Identities vs IdentityDiscs, addons, tools, tags, vectors.
- [x] `parietal-lobe.md` — Full rewrite. Tool execution, hallucination armor, MCP gateway.
- [x] `peripheral-nervous-system.md` — Full rewrite. Celery workers, heartbeats, tick cycle.
- [x] `prefrontal-cortex.md` — Full rewrite. Epics, stories, tasks, shift scoping.
- [x] `synaptic-cleft.md` — Full rewrite. WebSocket events, neurotransmitter types, dendrite hook.
- [x] `temporal-lobe.md` — Full rewrite. Iterations, shifts, temporal scheduling.
- [x] `thalamus.md` — Full rewrite. Chat relay, standing sessions, human-AI interface.

## Immediate Priority — Release Day (April 7, 2026)

- [ ] **GitHub Actions workflow for Pages deployment.** Create `.github/workflows/deploy.yml`
  that runs `npm run build` and deploys the `build/` folder to GitHub Pages on every push to
  main. Source set to "GitHub Actions" in repo Settings → Pages. This automates deployment —
  no manual builds needed.

- [ ] **Document OpenRouter sync feature.** OpenRouter provider sync has been restored. Needs
  documentation explaining: what it does, how to configure an OpenRouter API key, what models
  become available, and the sync_remote endpoint. Add to Hypothalamus docs and/or a new page.

- [ ] **FAQ page.** Create `docs/faq.md` — common questions about installation, hardware
  requirements, Ollama setup, model selection, safety/offline usage, what Are-Self is vs isn't.

- [ ] **Homepage visual refresh.** The main docs landing page (`src/pages/index.js`) needs more
  visual impact. Add game screenshots / UI screenshots to the homepage. Images exist in
  `static/img/ui/` — Michael can place more if needed.

- [ ] **Run `npm run build` on Windows and confirm zero broken links.** All known broken
  links have been patched. The sandbox build compiled client+server successfully but could
  not write output files due to sandbox permissions. Build on Windows should pass cleanly.

- [ ] **Compile LaTeX papers to PDF.** `pdflatex` needs the `apa7` document class.
  Easiest path: import paper directories into Overleaf.

## Tier 3 — Research Papers Polish

- [ ] Complete flagship `neuro-mimetic-architecture` paper (has TODO subsections in Evaluation)
- [ ] Flesh out remaining 5 paper drafts beyond outlines
- [ ] Add `.bib` bibliography files to each paper directory
- [ ] Compile all papers to PDF and verify they render correctly

## Tier 4 — Polish

- [ ] Review and update API repo README.md (GitHub landing page)
- [ ] Review and update UI repo README.md (GitHub landing page)
- [ ] Add Are-Self logo to docs site header/favicon
- [ ] Migrate `onBrokenMarkdownLinks` config to `siteConfig.markdown.hooks.onBrokenMarkdownLinks`
  (Docusaurus v4 deprecation warning)

## Tier 5 — Post-Release

- [ ] Migrate API_REFERENCE.md content into structured Docusaurus pages with try-it links
- [ ] Add search (Algolia DocSearch or local search plugin)
- [ ] Add versioning for docs
- [ ] CI/CD pipeline for automated builds and deployment
