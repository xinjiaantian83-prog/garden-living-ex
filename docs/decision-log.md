# Decision Log

Last updated: 2026-07-12

## Format

Each decision records:

- Date
- Decision
- Reason
- Impact
- Status

## Decisions

### 2026-07-12: Brands are split by residential scene, not product

Decision:

Garden Living and EXた組 are separated by where the customer wants to create a
space.

- Garden Living: backyard/garden
- EXた組: front/side/parking/entrance

Reason:

Users think in places and scenes, not product taxonomy. This also keeps AI
prompts, sample images, and page messaging clearer.

Impact:

- Carports should not be forced into Garden Living
- Nesca F v0.1 becomes an EXた組 simulator asset
- Garden Living top should focus on garden AI

Status:

Accepted

### 2026-07-12: Emotion/function is not the brand split

Decision:

Do not separate Garden Living and EXた組 by emotional value vs functional value.

Reason:

Both brands contain both emotional and functional value.

Impact:

- 카ーポートSC lighting can be emotional but still EXた組
- Garden Living products can be functional but still Garden Living

Status:

Accepted

### 2026-07-12: Version 1.0 is not the immediate target

Decision:

Prioritize a customer-usable beta over Version 1.0 completeness.

Reason:

Real customer value and feedback are more important than full catalog coverage.

Impact:

- Fewer products at first
- Faster beta
- More emphasis on mobile UX and clear value proposition

Status:

Accepted

### 2026-07-12: Manage by deliverables, not features

Decision:

Use deliverable IDs based on customer-touchable value instead of feature-only or
internal-document planning.

Reason:

The project should move toward real customer value, not just more internal
documents or technical components.

Impact:

- Roadmap is reorganized
- Backlog is deliverable-oriented
- Parallel work can be divided more safely
- README, specs, worklogs, and roadmaps are project assets, not deliverables
- Deliverable priority is based on what users can understand, try, compare, or send

Status:

Accepted

### 2026-07-12: Internal documents are project assets, not deliverables

Decision:

README, design documents, worklogs, AI spec drafts, JSON schema drafts, and
roadmaps are managed as project assets. They are not counted as customer-value
deliverables.

Reason:

The beta should be prioritized by what customers can experience.

Impact:

- Deliverable IDs now use D-prefix for user-facing value
- Project assets use A-prefix
- Priority decisions should favor the next user-touchable value

Status:

Accepted

### 2026-07-11: Nesca F Wide vertical slice is valuable but belongs to EXた組

Decision:

Keep the existing Nesca F Wide v0.1 work, but treat it as EXた組 AI simulator
Version 0.1.

Reason:

It is a front/parking construction scenario.

Impact:

- Do not delete the work
- Do not expand it inside Garden Living
- Reuse it for EXた組 beta

Status:

Accepted

### 2026-07-12: Version 0.3 adopts product reference images for AI-ready products

Decision:

Use curated product reference images as the standard approach for AI-ready
Garden Living products.

Each AI-ready product should define:

- `main_image`
- `ai_reference_images`
- `ai_features`
- `ai_prompt`

Reason:

Product-name-only generation is not reliable enough. Version 0.3 validation
showed that curated reference images can reach the target product match range.

Final scores:

- Pizza oven: 88-90
- Gabion: about 85
- Water stand: 86

Impact:

- Do not send full product galleries to the image model.
- Send up to 3 product reference images selected by role.
- Product additions need AI-specific reference curation before becoming
  AI-ready.
- Version 1.0 should support AI-ready products only, not every catalog item.

Status:

Accepted

## Open Decisions

### EXた組 simulator repository/location

Question:

Should EXた組 simulator live temporarily inside this repository or be split into
its own repository/site structure?

Options:

- A: Keep temporarily inside this repo for speed
- B: Create separate repo/page early
- C: Keep shared engine here and expose brand-specific pages

Recommendation:

Start with C if implementation cost is low; otherwise A for beta speed.

Status:

Needs human decision before production publish

### Garden Living v0.2 first scene

Question:

Which garden scene should be the first beta-quality Garden Living flow?

Options:

- Dog run / artificial turf
- Pizza oven / outdoor cooking
- Tile deck / outdoor living

Recommendation:

Start with dog run / artificial turf if customer demand is highest; otherwise
pizza oven for emotional clarity.

Status:

Needs human direction
