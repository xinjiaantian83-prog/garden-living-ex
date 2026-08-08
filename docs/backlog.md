# Backlog

Last updated: 2026-07-12

## How to Use

Backlog items are grouped by the customer-value deliverable they support. Internal
docs and specs are treated as project assets, not deliverables.

## P0 Backlog

### BL-001: Mark Nesca F v0.1 as EXた組 asset

Supports:

- D006 EXた組ネスカF AI β
- D007 EXた組住宅前面AI入口

Owner:

- Codex

Tasks:

- Update README
- Update carport simulator spec
- Update worklog
- Avoid deleting current implementation

Done:

- Docs clearly state that Nesca F v0.1 belongs to EXた組 AI simulator

Human decision required:

- No

### BL-002: Garden Living value-first wireframe

Supports:

- D001 Garden Livingトップ価値訴求
- D002 Garden Living庭AI体験入口
- D003 Garden Living Before/After体験

Owner:

- Codex

Tasks:

- Create wireframe doc
- Hero value proposition
- Before/After layout
- Simulator entrance
- Category placement after AI value

Done:

- Wireframe can be implemented without another conceptual discussion

Human decision required:

- For final wording only

### BL-003: Garden Living top-page value reorder

Supports:

- D001 Garden Livingトップ価値訴求
- D002 Garden Living庭AI体験入口
- D003 Garden Living Before/After体験

Owner:

- Codex

Tasks:

- Move AI value before category overload
- Add or expose Before/After
- Keep current features working
- Mobile check

Done:

- Garden Living is understandable in 3 seconds

Human decision required:

- Before production publish

### BL-004: Hide or isolate carport block from Garden Living main flow

Supports:

- D001 Garden Livingトップ価値訴求
- D006 EXた組ネスカF AI β

Owner:

- Codex

Tasks:

- Decide implementation method
- Option A: development flag
- Option B: separate EX page
- Option C: separate route with shared engine

Done:

- Garden Living main flow is garden-focused
- Nesca F work remains available as EX asset

Human decision required:

- For final URL and production routing

### BL-005: Garden Living garden AI spec draft

Supports:

- D004 Garden Living庭AI β

Owner:

- Codex or parallel agent

Tasks:

- Draft AI rules for backyard/garden scenes
- Draft item-specific rules for artificial turf, pizza oven, tile deck, dog run fence
- Include "do not add unselected items"

Done:

- Draft specs exist and can drive Garden Living beta

Human decision required:

- Product priority and final customer-facing scope

## P1 Backlog

### BL-006: EXた組 simulator extraction plan

Supports:

- D006 EXた組ネスカF AI β
- D007 EXた組住宅前面AI入口

Owner:

- Codex or parallel agent

Tasks:

- Define EX simulator page structure
- Define shared engine reuse
- Define JSON location
- Define consultation text

Done:

- EX simulator can be implemented with low rework

Human decision required:

- Final URL / repository choice

### BL-007: Price matrix validation

Supports:

- D008 EXた組カーポート価格表示体験

Owner:

- Codex + Human

Tasks:

- Check temporary values
- Add source/status fields where missing
- Separate standard and override behavior

Done:

- Price display is trustworthy enough for beta

Human decision required:

- All final prices

### BL-008: AI image quality test plan

Deliverable:

- 013

Owner:

- Codex

Tasks:

- Create test cases
- Define scoring rubric
- Record failures and prompt improvements

Done:

- Each generated image can be evaluated consistently

Human decision required:

- Quality threshold for beta

### BL-009: Mobile UX checklist execution

Deliverable:

- 015

Owner:

- Human + Codex

Tasks:

- Test iPhone flow
- Record confusion points
- Fix safe UI issues

Done:

- Main beta flow is understandable on phone

Human decision required:

- UX final acceptance

## P2 Backlog

### BL-010: Admin interface planning

Deliverable:

- Future

Owner:

- Codex

Tasks:

- Define product/price/spec editing needs
- Avoid overbuilding before beta

Human decision required:

- Before implementation

### BL-011: Multi-tenant design

Deliverable:

- Future

Owner:

- Codex

Tasks:

- Tenant config
- Brand config
- Watermark config
- API usage log structure

Human decision required:

- Before productization
