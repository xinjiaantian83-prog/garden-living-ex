# Garden Living

Garden Living is a public product catalog and AI garden simulator for EXた組.

The core goal is not to sell aggressively. The goal is to help customers compare,
imagine, understand reference pricing, and consult only after they feel ready.

## Current Focus

Version 0.1 of the carport AI simulator is limited to one product and one main
flow:

- Product: LIXIL ネスカF ワイド
- Test variant: `NESCA-F-WIDE-2CAR-54-50-H22-SG-STANDARD-NO-LIGHT`
- Flow: product selection -> reference price -> AI generation payload -> LINE consultation text

Do not expand to フーゴF or カーポートSC until Version 0.1 has been tested by the
owner in the browser and Version 0.2 priorities are decided.

## Local Commands

```bash
npm run build
npm run start
```

Local preview:

```text
http://localhost:3008/
```

## Key Data Files

- `json/exterior-products.json`
  Product master. Holds customer-facing product identity and references to AI specs,
  option groups, and price matrix.
- `json/ai-product-specs.json`
  AI prompt specification by product. Holds product-specific visual rules and real
  case learnings.
- `json/product-option-master.json`
  Option master. Separates customer labels from internal codes.
- `json/product-price-matrix.json`
  Price matrix. Holds standard price and administrator override price. Display price
  is calculated at runtime and is not stored.

## Pricing Rule

For construction products, the customer-facing price is:

```text
standard product price + standard installation fee
```

If `override_price.enabled` is true, the override values take priority.

Do not save `display_price` or `gross_profit` in JSON. Calculate them when needed.

## Deployment Rule

Do not push or publish without explicit confirmation.

