# Worklog

## 2026-07-11

### Version 0.1 Carport Vertical Slice

Created the first minimum carport AI simulator path using the new JSON structure.

Implemented:

- Added four new JSON files:
  - `json/exterior-products.json`
  - `json/ai-product-specs.json`
  - `json/product-option-master.json`
  - `json/product-price-matrix.json`
- Added an independent carport block to the existing simulator UI.
- Loaded the four JSON files from the public page.
- Connected Nesca F Wide product data to:
  - option rendering
  - variant resolution
  - price calculation
  - AI payload
  - server-side AI spec prompt injection
  - LINE consultation text
- Verified build and JSON references.

Current test variant:

```text
NESCA-F-WIDE-2CAR-54-50-H22-SG-STANDARD-NO-LIGHT
```

Runtime calculated reference price:

```text
585,000 yen
```

### Verification

- `npm run build`: passed
- `node --check js/outdoor-kitchen.js`: passed
- `node --check server/garden-image-service.mjs`: passed
- JSON syntax check: passed
- JSON reference check: passed
- Headless Chrome DOM check:
  - public catalog loaded
  - carport block exists in DOM

### Hold Before Version 0.2

Do not add フーゴF or カーポートSC yet.

Owner will test Version 0.1 manually and review:

- 操作性
- 分かりやすさ
- 価格表示
- 相談導線
- 違和感

Version 0.2 should be planned only after that feedback.

## 2026-07-12

### Deliverable-Based Project Management

Shifted project management from feature-based planning to deliverable-based
planning.

Added:

- `docs/deliverables.md`
- `docs/development-roadmap.md`
- `docs/parallel-work-plan.md`
- `docs/decision-log.md`
- `docs/milestones.md`
- `docs/backlog.md`

Key management rules:

- Prioritize a customer-usable beta over Version 1.0 completeness.
- Manage deliverables by user-touchable value, not by internal documents.
- Treat README, docs, worklogs, specs, and roadmaps as project assets.
- Use D-prefix for customer-value deliverables and A-prefix for project assets.
- Codex can continue safe work without waiting for the owner.
- Human approval is still required for push, deploy, final pricing, final product
  specs, and sales/brand final decisions.
- Parallel agents can be used, but shared-file editing must be coordinated.

Current next deliverables:

1. D001 Garden Livingトップ価値訴求.
2. D002 Garden Living庭AI体験入口.
3. D003 Garden Living Before/After体験.

Supporting project assets:

1. A002 ネスカF v0.1実験資産.
2. A003 プロジェクト管理基盤.

### Version 0.3 Product Reference Image Validation

Completed product reproduction validation for the product reference image method.

Target products:

- Pizza oven
- Gabion
- Water stand

Final evaluation:

- Pizza oven: 88-90 points
- Gabion: about 85 points
- Water stand: 86 points

Confirmed:

- Do not send full galleries.
- Send only curated AI reference images.
- Use up to 3 product reference images.
- Choose references by role, not fixed front/angle rules.
- Store product reproduction guidance in:
  - `main_image`
  - `ai_reference_images`
  - `ai_features`
  - `ai_prompt`

Added internal report:

- `docs/v0.3-product-reference-image-validation.md`

Verification:

- `npm run build`: passed
