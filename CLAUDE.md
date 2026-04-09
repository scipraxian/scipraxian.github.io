# CLAUDE.md — Are-Self Documentation Site

The single source of truth for any AI agent working on the are-self-docs codebase.
Read completely before making any changes.

## What This Is

A Docusaurus 3.x documentation site for **Are-Self**, an open-source AI reasoning engine.
Dark-only glassmorphic theme. Deployed at are-self.com. **Public release: April 7, 2026.**

**Sister repos (all in the same parent folder):**
- [are-self-api](https://github.com/scipraxian/are-self-api) — Django 6.x backend (brain regions as Django apps)
- [are-self-ui](https://github.com/scipraxian/are-self-ui) — React/Vite/TypeScript frontend
- [are-self-research](https://github.com/scipraxian/are-self-research) — Academic papers (LaTeX, APA 7th edition)

## Running Locally

```bash
npm install
npm start        # http://localhost:3000
```

After changing `docusaurus.config.js` or `src/pages/index.js`, the dev server often needs a
manual restart (`Ctrl+C` then `npm start`) — hot reload doesn't always pick up config changes.

## Theme

Dark-only glassmorphic. All styling in `src/css/custom.css`. Key colors:

- Background: `#0a0a0f` → `#1a1a2e` gradient
- Glass panels: `rgba(26, 26, 46, 0.6)` + `backdrop-filter: blur(12px)`
- Border: `rgba(255, 255, 255, 0.1)`
- Accents: teal `#06b6d4`, purple `#a855f7`, amber `#f59e0b`, indigo `#6366f1`
- Text: primary `rgba(255,255,255,0.95)`, secondary `0.7`, tertiary `0.5`

Color mode switch is disabled — dark only.

## Architecture Overview (for context)

Are-Self maps brain regions to Django apps. The tick cycle runs:
PNS → Temporal Lobe → CNS → Frontal Lobe → Parietal/Hippocampus/Hypothalamus

Key components:
- **CNS** — Central Nervous System: neural pathway graph editor (ReactFlow-based), spike trains
- **Frontal Lobe** — LLM reasoning engine with addon-based prompt assembly
- **Hippocampus** — Vector-embedded memory (pgvector, 768-dim, cosine similarity)
- **Hypothalamus** — Model routing, Ollama integration
- **Parietal Lobe** — Output validation ("hallucination armor")
- **PFC** — Prefrontal Cortex: task/project management
- **PNS** — Peripheral Nervous System: worker fleet discovery/coordination
- **Temporal Lobe** — Scheduled task definitions and iterations
- **Identity** — Agent identity sheets with addon/tool configurations
- **Synaptic Cleft** — Real-time event bus (Django Channels/WebSocket)

CNS Graph Editor node types: Gate (PK5), Retry (PK6), Delay (PK7), Frontal Lobe (PK8), Debug (PK9).
Effector palette grouped by role: Logic (teal/amber/indigo), Reasoning (purple), Effectors (gray).
Axon ports: FLOW, SUCCESS, FAIL.

Focus Economy: agents earn execution budget by saving novel memories (engrams with <90% cosine
similarity to existing knowledge). Prevents infinite loops and degenerate behavior.

## Known Issues & Fixes (Already Applied)

### MDX Curly Brace Escaping
MDX (used by Docusaurus) interprets `{id}` in markdown as JSX expressions. This crashes
pages that contain URL patterns like `/api/v2/spiketrains/{id}/`. Fix: escape with HTML
entities `&#123;id&#125;` or wrap the entire block in a code fence.

**Affected file:** `docs/api-reference.md` — all `{id}`, `{value}`, `{query}` occurrences
have been escaped.

### CSS `a::after` Scope
The animated underline effect (`a::after` with expanding width) was originally applied to
ALL links globally, causing visual artifacts on sidebar menu items, navbar links, buttons,
and breadcrumbs. Fixed by scoping to `.markdown a::after` only (content area links). An
explicit `display: none !important` override is set for `.menu__link::after`,
`.navbar__link::after`, `.button::after`, etc.

### Hero Button Visibility
Docusaurus `button--secondary` and `button--outline` classes have no dark-theme defaults.
Custom styles added in the BUTTONS section of `custom.css` to ensure visible text on the
dark hero background.

### 501(c)(3) Claim Removed
`docs/contributing.md` previously claimed "building toward a 501(c)(3) nonprofit." Replaced
with accurate language about making AI accessible to underserved communities.

## Screenshot Capture for UI Walkthroughs

**Problem:** The Chrome MCP `save_to_disk` flag stores screenshots in the extension's
in-memory store (accessible to the AI agent but NOT written to the filesystem). Playwright
cannot install browser binaries in the Cowork sandbox.

**Workaround — html2canvas via JavaScript injection:**

Navigate to the target page in the Chrome MCP tab, then run this via `javascript_tool`:

```javascript
(async function() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  document.head.appendChild(script);

  return new Promise((resolve) => {
    script.onload = async () => {
      try {
        const canvas = await html2canvas(document.body, {
          backgroundColor: '#0a0a0f',
          scale: 1,
          width: window.innerWidth,
          height: window.innerHeight,
        });

        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'FILENAME_HERE.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve('Download triggered');
        }, 'image/png');
      } catch(e) {
        resolve('Error: ' + e.message);
      }
    };
    script.onerror = () => resolve('Failed to load html2canvas');
  });
})()
```

This triggers a browser download to the user's Downloads folder. The user then moves the
file to `static/img/ui/`. html2canvas renders the DOM (not a pixel-perfect browser
screenshot) so complex WebGL/canvas elements may not capture perfectly — for those,
Michael uses IBS (screen capture tool) manually.

**Screenshot file convention:** All UI walkthrough images go in `static/img/ui/` with
kebab-case names matching the walkthrough page (e.g., `cns-dashboard.png`,
`cns-pre-release-editor.png`).

**Current state:** 4 real screenshots exist in `static/img/ui/`:
- `cns-dashboard.png` (2110x1080)
- `cns-effector-palette.png` (240x310)
- `cns-pre-release-editor.png` (2110x1080)
- `cns-temporal-lobe-pathway.png` (1264x653)

## UI Walkthrough Pages

Located in `docs/ui/`. Each page follows the same structure:
1. Frontmatter with `id`, `title`, `sidebar_position`
2. Intro paragraph explaining the page's purpose
3. "Getting There" section with navigation instructions
4. Annotated screenshots with descriptive prose (not bullet lists)
5. Key concepts glossary at the bottom

Images referenced as `/img/ui/filename.png` (Docusaurus static path).

**Completed:** `cns-editor.md` — full walkthrough with 4 real screenshots.
**Remaining stubs (10 pages):** blood-brain-barrier, identity, temporal-lobe, prefrontal-cortex,
cns-monitor, frontal-lobe, hippocampus, hypothalamus, environments, pns.

## Research Papers (are-self-research repo)

All 6 papers have substantial LaTeX outlines in `papers/*/paper.tex`. The flagship
`neuro-mimetic-architecture` paper has the most content (full draft with TODO evaluation sections).

**Papers need to be compiled to PDF.** `pdflatex` is available in the Cowork sandbox at
`/usr/bin/pdflatex`. Compile with:
```bash
cd papers/neuro-mimetic-architecture
pdflatex paper.tex
biber paper        # if biber is available; otherwise skip bibliography
pdflatex paper.tex
pdflatex paper.tex
```

The `apa7` LaTeX document class is required. If not installed, papers can also be compiled
via [Overleaf](https://overleaf.com) by importing the paper directory.

**Cross-linking is set up:**
- `docusaurus.config.js` navbar has Research link → `/docs/research`
- Footer has Research Papers link + GitHub (Research) link
- Homepage feature card "Small Models, Big Work" links to `/docs/research`
- `docs/research.md` has summaries of all 6 papers with links to the GitHub repo

## Security Docs

Located in `docs/security/`. Five files:
- `index.md` — Security overview landing page
- `data-flow-privacy.md` — COPPA/GDPR/HIPAA/FERPA alignment
- `responsible-ai.md` — Focus Economy, safety for minors
- `incident-response.md` — CVE response process
- `sbom.md` — Software bill of materials

**SBOM warning:** Table cells containing `<` followed by digits will be interpreted as HTML
tags by MDX. Use prose like "older than 2.4.0" instead of `<2.4.0`.

## Sidebar Structure

Defined in `sidebars.js`. Main categories:
- Top-level docs (What is Are-Self, Getting Started, The Brain, etc.)
- UI Walkthrough (category with 11 sub-pages)
- API Reference
- Security (category with sub-pages)
- Contributing, Style Guide, Features, Acknowledgments

## Homepage (src/pages/index.js)

Feature cards are clickable links with glassmorphic hover effects (defined in `index.module.css`).
Each feature has `title`, `description`, and `link` properties. Cards link to relevant doc pages.

## Session 3 Changes (April 6, 2026)

### All 10 UI Walkthrough Stubs Filled
Every stub in `docs/ui/` now has full prose content following the cns-editor.md template:
intro paragraph, "Getting There" section, annotated panel descriptions, and Key Concepts glossary.

Pages completed: blood-brain-barrier, identity, temporal-lobe, prefrontal-cortex, cns-monitor,
frontal-lobe, hippocampus, hypothalamus, environments, pns.

### Quick Start Guide Written
`docs/quick-start.md` — 5-minute guide: prerequisites, clone, install, first environment,
first identity, pull model, create pathway, fire spike.

### 15 Screenshots in static/img/ui/
Captured via html2canvas at 1280x800 (scale 2x). Files:
blood-brain-barrier.png, identity-roster.png, identity-loadout.png, temporal-lobe.png,
prefrontal-cortex.png, cns-monitor.png, hippocampus.png, hypothalamus.png, environments.png,
pns.png, frontal-lobe-session.png (IBS capture — html2canvas fails on CSS `color()` function).
Plus 4 original CNS screenshots restored from git.

### html2canvas CSS `color()` Limitation
Pages using Three.js / React Three Fiber (Frontal Lobe session detail, Background Canvas)
use the CSS `color()` function which html2canvas 1.4.1 cannot parse. For these pages,
use IBS or browser devtools screenshot instead.

### Truncated File Issue
Several files were truncated during session 2 (likely a write that was interrupted):
package.json, sidebars.js, src/css/custom.css, src/pages/index.js, src/pages/index.module.css.
All were repaired by restoring missing content from `git show HEAD:filename`.
**Lesson:** After writing config files, always verify with `npm run build` or at minimum
check file integrity with `wc -l` against git.

### MDX Escaping Applied Globally
All `{id}`, `{value}`, `{query}` patterns in docs/ were escaped to HTML entities.
This affects brain-regions/*.md and api-reference.md. The `<` + digit pattern
(e.g., `<90%`) must also be written as prose ("less than 90%") to avoid MDX JSX parsing.

## Session 4 Changes (April 7, 2026 — Release Day)

### Gemma4 Rollback
Gemma4 changed its output format, breaking the Frontal Lobe reasoning loop. Empirical testing
confirmed Qwen outperforms Gemma4 on the Are-Self framework. Rolled back to Qwen for release.
A parser is being developed to support Gemma4's new format post-release.

### OpenRouter Sync Restored
The OpenRouter provider sync feature (`sync_remote`) has been brought back. This allows
Are-Self to pull cloud model catalogs from OpenRouter in addition to local Ollama models.
Feature is untested but shipping. **Needs documentation** — add to Hypothalamus docs explaining
configuration, API key setup, and what models become available.

### READMEs Updated
All four repo READMEs updated for public release.

### Remaining Docs Work
- **OpenRouter documentation** — new feature needs a docs page or section
- **FAQ page** — `docs/faq.md` needed for common questions
- **Homepage visual refresh** — main landing page needs more screenshots/images for impact
- **AI transparency statement** — "Built With" section for READMEs and a docs page explaining
  the human-architect + AI-tool collaboration model (see MEDIA_PLAN.md in are-self-documents)

### Video Assets
Michael has recorded video of the major brain region UIs. First video target is the Unreal
end-to-end pipeline demo. Videos being assembled in kdenlive.

### Social Media Accounts Created
All accounts live under the `scipraxian` handle. See MEDIA_PLAN.md in are-self-documents
for full account list, media strategy, and content plan.

## Session 5 Changes (April 9, 2026)

### Brain Region Docs Rewrite — Kid-Friendly Tone
The brain-region docs were written by a previous agent in a dry, textbook style. Michael's
directive: write for a 10-year-old who's never heard of a hypothalamus. The biological
analogy should be the entry point, woven naturally into the explanation, not a separate
"Biological Analogy" section. Technical accuracy stays, but the framing meets a curious kid.

**All 11 brain-region docs rewritten:** hypothalamus, frontal-lobe, central-nervous-system,
hippocampus, identity, parietal-lobe, peripheral-nervous-system, prefrontal-cortex,
synaptic-cleft, temporal-lobe, thalamus. All cross-references are clickable links.
Hypothalamus and frontal-lobe were rewritten from the actual codebase with verified
technical details. Mermaid flowcharts for error classification in hypothalamus.

**Style rules discovered in this session:**
- Open with the real-world biology, woven into the Are-Self explanation (not a separate section)
- Every brain-region mention must be a `[link](./slug)` — no bare text references
- Explain like you're talking to someone excited and curious, not reading a spec
- Keep API endpoint tables but push them to the bottom
- "How It Connects" section at the end with all links
- Technical details (field names, method names) are fine but introduced through story

### Hypothalamus Circuit Breaker Fix
Code fix in `are-self-api` prompted the doc rewrite. The Hypothalamus docs now cover
circuit breaker backoff math, resource cooldown (OOM handling), scar tissue, and the
Synapse Client error classification flow — all verified against the actual code.

### All Brain Region Docs Complete
All 11 docs rewritten in same session. The 9 remaining docs (central-nervous-system,
hippocampus, identity, parietal-lobe, peripheral-nervous-system, prefrontal-cortex,
synaptic-cleft, temporal-lobe, thalamus) were parallelized across subagents. Each agent
read the hypothalamus.md as the style reference. Michael should review all 11 for
consistency — the hypothalamus and frontal-lobe docs were written directly with full
code verification; the other 9 were rewritten from the existing doc content (not the code)
so may have inherited inaccuracies from the previous agent's guesses.