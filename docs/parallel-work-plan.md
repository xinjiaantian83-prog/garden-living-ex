# Parallel Work Plan

Last updated: 2026-07-12

## Purpose

Speed up development by splitting work into safe, file-scoped lanes.

The Codex lead coordinates all lanes and prevents multiple agents from editing
the same file at the same time.

## Lane Structure

### Lane A: Product Strategy and Docs

Owner:

- Codex lead

Safe files:

- `docs/*.md`
- `README.md`

Tasks:

- Roadmap
- Decision log
- Worklog
- Brand/design docs
- Manual checklists

Can run without confirmation:

- Yes

### Lane B: Garden Living UX

Owner:

- Parallel agent or Codex lead

Safe files when assigned:

- `index.html`
- `css/outdoor-kitchen.css`
- `js/outdoor-kitchen.js`

Tasks:

- Top-page reorder
- Garden simulator entrance
- Before/After section
- Mobile UX cleanup

Requires coordination:

- Yes. These files are shared with existing simulator code.

### Lane C: EXた組 Simulator

Owner:

- Parallel agent after Garden Living UI files are reserved

Potential files:

- `extakumi-simulator.html`
- `js/extakumi-simulator.js`
- `css/extakumi-simulator.css`
- `json/extakumi/*`

Tasks:

- Extract Nesca F v0.1 flow
- Front/parking scene simulator
- Construction price display

Requires confirmation:

- Before deciding final URL or production route

### Lane D: Data and AI Specs

Owner:

- Parallel agent or Codex lead

Safe files:

- `json/**/*.json`
- `docs/*ai*.md`

Tasks:

- Garden Living AI specs
- EX AI specs
- Option masters
- Price matrix drafts
- Reference checks

Can run without confirmation:

- Drafts and null/temporary prices only

Requires confirmation:

- Final prices and final product specs

### Lane E: QA and Build

Owner:

- Parallel agent

Safe files:

- `docs/manual-*.md`
- test scripts if added

Tasks:

- Build checks
- JSON parse checks
- Reference checks
- Mobile checklist
- Regression checklist

Can run without confirmation:

- Yes

## File Locking Rule

Before assigning a parallel agent, declare:

```text
Agent X owns: path/to/fileA, path/to/fileB
Agent Y owns: path/to/fileC
```

No two agents should edit:

- `index.html`
- `js/outdoor-kitchen.js`
- `css/outdoor-kitchen.css`
- same JSON file

at the same time.

## Recommended Parallel Split for Next Phase

If using multiple agents:

Agent A:

- Draft Garden Living v0.2 top-page wireframe in docs only
- Files: `docs/garden-living-v0.2-wireframe.md`

Agent B:

- Draft EXた組 simulator extraction plan
- Files: `docs/extakumi-simulator-extraction-plan.md`

Agent C:

- Draft Garden Living AI product spec candidates
- Files: `docs/garden-living-ai-spec-draft.md`

Codex lead:

- Integrate docs
- Decide implementation order
- Run build/tests after implementation

## Escalation Rules

Parallel agents may propose implementation, but Codex lead controls:

- Merge decisions
- Shared file edits
- Build validation
- Final report

Human owner controls:

- Push
- Deploy
- Final price
- Final brand wording
- Final product scope

