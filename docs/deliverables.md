# Deliverables

Last updated: 2026-07-12

## Purpose

This project is managed by customer-value deliverables, not by isolated features
or internal documents.

The goal is to reach a customer-usable beta as quickly as possible while keeping
Garden Living and EXた組 clearly separated by residential scene.

## Deliverable Definition

A deliverable must be something a customer can experience or a business-facing
operator can directly use to create customer value.

Deliverables are:

- A page users can understand
- A simulator flow users can try
- A consultation flow users can send
- A product/price experience users or staff can use
- A beta release that can be tested with real customers

Project assets are not deliverables:

- README
- Design docs
- Worklogs
- Internal specifications
- Roadmaps
- Backlogs
- AI spec drafts
- JSON schema drafts

Project assets are important because they speed up delivery, but priority is
always based on user-touchable value.

## Roles

Human owner:

- 商売の方向性
- ブランド最終判断
- UX最終判断
- 価格確定
- 商品知識
- 現場判断
- Git push / 本番公開承認

Codex lead:

- 開発計画
- DB設計
- AI仕様書
- UI設計
- 実装
- テスト
- ドキュメント
- 品質管理
- 並行エージェント分割案

Parallel agents:

- File-scoped implementation or research tasks
- No shared-file concurrent edits without Codex lead coordination

## Customer-Value Deliverable List

| ID | Deliverable | Status | Owner | Priority | Depends on | Done Criteria |
| --- | --- | --- | --- | --- | --- | --- |
| D001 | Garden Livingトップ価値訴求 | Pending | Codex | P0 | A001 | Without reading detailed explanation, user understands: "自宅写真で完成イメージを作れるサイト" |
| D002 | Garden Living庭AI体験入口 | Pending | Codex | P0 | D001 | User can choose self photo/sample garden and understand next action |
| D003 | Garden Living Before/After体験 | Pending | Codex | P0 | D001 | User instantly understands photo -> AI completed image |
| D004 | Garden Living庭AI β | Pending | Codex | P0 | D001, D002, A004 | User can generate garden/backyard image and prepare LINE consult |
| D005 | Garden Living商品選択体験 | Pending | Codex | P1 | D001, A005 | User can select garden products without category overload |
| D006 | EXた組ネスカF AI β | Prototype | Codex | P0 | A002, A004 | User can select Nesca F, see reference price, generate image, consult |
| D007 | EXた組住宅前面AI入口 | Pending | Codex | P0 | A001, D006 | User understands parking/front photo simulation |
| D008 | EXた組カーポート価格表示体験 | Prototype | Codex + Human | P0 | D006, A006 | User sees construction-inclusive reference price without misunderstanding |
| D009 | LINE相談体験 | Prototype | Codex | P0 | D004 or D006 | User can copy/send selected plan context to LINE |
| D010 | スマホβ体験 | Pending | Human + Codex | P0 | D001, D004 or D006 | Main beta flow works naturally on phone |
| D011 | β公開版 | Pending | Human + Codex | P0 | D010 | Real customers can access approved beta |

## Project Asset List

Project assets support delivery but are not prioritized above customer-visible
value.

| ID | Asset | Status | Owner | Supports |
| --- | --- | --- | --- | --- |
| A001 | ブランドシーン設計 | Done | Human + Codex | D001, D007 |
| A002 | ネスカF v0.1実験資産 | In Progress | Codex | D006, D008 |
| A003 | プロジェクト管理基盤 | In Progress | Codex | All |
| A004 | AI商品仕様書 | In Progress | Codex | D004, D006 |
| A005 | 商品DB/価格DB構造 | In Progress | Codex | D005, D008 |
| A006 | 価格ルール/override設計 | In Progress | Codex + Human | D008 |
| A007 | QA/確認チェックリスト | In Progress | Codex | D010 |
| A008 | Version0.3商品画像参照方式 | Done | Codex | D004, D005 |

## Current Position

Current state:

- Brand split is decided by scene, not product.
- Garden Living is for backyard/garden scenes.
- EXた組 is for front/side/exterior function scenes.
- Nesca F Wide v0.1 exists and should be treated as EXた組 AI simulator experimental asset.
- Garden Living should not force carports into its main experience.

## Next Deliverable

Next customer-value deliverable:

```text
D001 Garden Livingトップ価値訴求
```

Supporting project assets to keep current:

```text
A002 ネスカF v0.1実験資産
A003 プロジェクト管理基盤
```

## D001 Acceptance Criteria

Goal:

```text
ページを開いた瞬間、説明を読まなくても
「自宅写真で完成イメージを作れるサイト」だと理解できる。
```

Primary success metric:

- 3秒以内に価値が伝わること

Priority order:

1. 伝わること
2. 迷わないこと
3. 試したくなること
4. きれいに見えること

Pass conditions:

- First view contains a direct visual cue of photo -> completed image
- Main headline or visual immediately communicates "自宅写真"
- Main headline or visual immediately communicates "完成イメージ"
- The first action is clearly "自宅の写真で試す" or equivalent
- Categories do not appear before the AI value is understood
- User does not need to understand product categories first

Fail conditions:

- Looks like a generic product catalog
- Category cards dominate the first impression
- User must read long explanatory text to understand the site
- The AI simulator looks secondary
- User cannot tell what will happen after uploading a photo

Design note:

Beautiful design is secondary. If a rough layout communicates the value faster,
choose the rougher but clearer layout.

## Stop Conditions

Stop and ask the human owner before:

- Git push
- Production deploy
- Final price decisions
- Final product specification decisions
- Large removal of existing production behavior
- API billing or key changes
- Brand or sales-policy final decisions

Do not stop for:

- Docs
- Tests
- Build checks
- JSON schema drafts
- Safe refactors
- Worklogs
- Non-production prototypes
