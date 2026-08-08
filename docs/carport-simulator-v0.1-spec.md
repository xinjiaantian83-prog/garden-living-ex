# Carport AI Simulator Version 0.1 Spec

Last updated: 2026-07-11

## Purpose

Version 0.1 verifies that the new product DB structure can connect to the customer
experience without forcing a full catalog implementation.

This version intentionally supports only one product path:

```text
LIXIL ネスカF ワイド
-> one selectable product block
-> reference price
-> AI generation payload
-> LINE consultation text
```

## Product Scope

Supported product:

- `product_id`: `LIXIL-CARPORT-NESCA-F-WIDE`
- `ai_spec_id`: `AI-LIXIL-CARPORT-NESCA-F-WIDE`
- Main test `variant_id`: `NESCA-F-WIDE-2CAR-54-50-H22-SG-STANDARD-NO-LIGHT`

Version 0.1 does not add:

- フーゴF
- カーポートSC
- Special construction
- Beam extension
- Column relocation
- Cut-to-fit plans
- Irregular site pricing

These remain "別途見積り".

## Customer UI Fields

The carport block exposes only the minimum customer-facing choices:

| UI label | Internal code source | Version 0.1 value |
| --- | --- | --- |
| サイズ | `size` | `54-50` |
| 柱高さ | `height` | `H22` |
| 本体色 | `body_color` | `SG` |
| 屋根材 | `roof_material` | `STANDARD` |
| 水下方向 | `drainage_direction` | `FRONT_LOW` |

Customer-facing price label:

```text
参考価格（税込・標準施工費込）
```

## Price Calculation

The runtime calculation uses `product-price-matrix.json`.

Priority:

1. Use `override_price` if `override_price.enabled === true`
2. Otherwise use `standard_price`

For construction products:

```text
display price = product_price_in_tax + standard_installation_fee_in_tax
```

Version 0.1 test value:

```text
420,000 + 165,000 = 585,000 yen
```

`display_price` is not stored in JSON.

## AI Payload

When the carport block is enabled, the image generation payload includes:

```json
{
  "product_id": "LIXIL-CARPORT-NESCA-F-WIDE",
  "variant_id": "NESCA-F-WIDE-2CAR-54-50-H22-SG-STANDARD-NO-LIGHT",
  "ai_spec_id": "AI-LIXIL-CARPORT-NESCA-F-WIDE",
  "selected_options": {
    "size": "54-50",
    "height": "H22",
    "body_color": "SG",
    "roof_material": "STANDARD",
    "lighting": "NO-LIGHT",
    "drainage_direction": "FRONT_LOW"
  }
}
```

The server reads `ai_spec_id` and appends the matching product spec from:

```text
json/ai-product-specs.json
```

## LINE Consultation Text

When enabled, the consultation text should include:

- 商品名
- サイズ
- 柱高さ
- 本体色
- 屋根材
- 水下方向
- 参考価格
- Whether an AI reference image has been generated
- Notice that the image is for reference and final conditions may change

## Version 0.1 Success Criteria

- Customer can enable the Nesca F Wide block
- Reference price appears
- Payload contains product, variant, AI spec, and selected options
- Server references AI spec by `ai_spec_id`
- Consultation text includes product and price context
- Existing Garden Living product catalog still loads

