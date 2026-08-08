# Development Roadmap

Last updated: 2026-07-12

## North Star

Build a customer-usable beta where users can calmly compare, imagine, understand
reference pricing, and consult only when they feel ready.

The beta does not need to be complete. It needs to deliver real value to real
customers.

## Product Direction

Garden Living:

- Scene: residential backyard and garden
- Theme: 暮らしを楽しむ庭
- Simulator: garden/backyard/wood deck/dog run photos

EXた組:

- Scene: residential front and side
- Theme: 住まいを作る外構
- Simulator: parking/front entrance/side yard photos

## Roadmap by Customer-Value Stage

Internal docs, specs, and roadmaps are project assets. They are not deliverables
unless they directly enable a user-facing beta experience.

### Stage 0: Foundation

Goal:

Create the management structure and preserve existing assets safely.

Project assets:

- A001 ブランドシーン設計
- A002 ネスカF v0.1実験資産
- A003 プロジェクト管理基盤

Done when:

- Brand split is documented
- Work can continue without constant human confirmation
- Existing Nesca F work is classified as EX asset

### Stage 1: Garden Living Value Clarity

Goal:

Make the Garden Living top page communicate within 3 seconds:

```text
自宅の庭写真で、庭の完成イメージを確認できる
```

Customer-value deliverables:

- D001 Garden Livingトップ価値訴求
- D002 Garden Living庭AI体験入口
- D003 Garden Living Before/After体験

Supporting assets:

- A004 Garden Living庭AI仕様書

Done when:

- Top page no longer looks primarily like a product catalog
- AI value appears before category browsing
- Garden Living no longer pushes carport/front-exterior context

### Stage 2: Garden Living Beta

Goal:

Let users try a garden/backyard AI flow and send a LINE consultation.

Customer-value deliverables:

- D004 Garden Living庭AI β
- D005 Garden Living商品選択体験
- D009 LINE相談体験
- D010 スマホβ体験

Supporting assets:

- A004 AI商品仕様書
- A005 商品DB/価格DB構造

Done when:

- User can upload/select sample garden
- User can choose garden items
- User can generate an image
- User can see reference pricing
- User can send/copy a consultation
- Mobile flow is understandable

### Stage 3: EXた組 Beta

Goal:

Separate the Nesca F / carport work into EXた組 context and make it usable for
front-exterior consultation.

Customer-value deliverables:

- D006 EXた組ネスカF AI β
- D007 EXた組住宅前面AI入口
- D008 EXた組カーポート価格表示体験
- D009 LINE相談体験

Supporting assets:

- A002 ネスカF v0.1実験資産
- A005 商品DB/価格DB構造
- A006 価格ルール/override設計

Done when:

- Parking/front photo simulator is separated from Garden Living
- Nesca F flow works as EXた組 flow
- Price label and consultation text fit construction products

### Stage 4: Quality and Beta Release

Goal:

Reduce confusion, improve generated-image usefulness, and prepare beta publish.

Customer-value deliverables:

- D010 スマホβ体験
- D011 β公開版

Supporting assets:

- AI生成品質評価フロー
- QA checklist

Done when:

- Owner approves beta release
- No major mobile blockers
- No misleading price or image wording
- Production publish is explicitly approved

## Priorities

P0:

- Make the value understandable
- Keep brands scene-separated
- Keep mobile flow simple
- Preserve user trust

P1:

- Improve AI image quality
- Expand product/price DB
- Separate EXた組 and Garden Living code paths

P2:

- Admin interfaces
- Advanced analytics
- Multi-tenant third-party productization

## What Not To Do Yet

Do not prioritize:

- Adding many more products before the top UX is clear
- Perfecting all AI outputs before beta
- Building a complex admin UI before JSON workflow is stable
- Publishing without human approval
- Mixing carports back into Garden Living main flow

## Next Recommended Sequence

1. Deliver D001: make Garden Living top value clear in 3 seconds
2. Deliver D002/D003: expose garden AI entrance and Before/After
3. Preserve A002: keep Nesca F v0.1 as EXた組 asset
4. Deliver D004: Garden Living garden AI beta
5. Deliver D006/D007: EXた組 front/parking AI beta
6. Deliver D010: mobile beta experience
7. Deliver D011: approved beta publish
