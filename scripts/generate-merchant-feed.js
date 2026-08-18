#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const engine = require("../fence-engine.js");

const SITE_URL = "https://gardenliving-ex.net/";
const CUSTOMER_RATE = 0.8;
const TAX_RATE = 0.1;

// 価格は fence-engine.js の商品マスタを正とし、
// 見積もり画面と同じ販売率・税込計算でフィードへ反映する。
const PRODUCTS = [
  {
    id: "ST2-OAMF09", masterGroup: "panels", masterKey: "ST2-OAMF09",
    title: "OnlyOne Club アメリカンフェンス 900×900 ST2-OAMF09",
    description: "オンリーワンクラブのアメリカンフェンス 900×900mm。完成品パネルを1枚から単品購入でき、全国配送に対応します。",
    image: "images/products/american-fence/official/american-fence-panel-900x900-product.jpg"
  },
  {
    id: "ST2-OAMF15", masterGroup: "panels", masterKey: "ST2-OAMF15",
    title: "OnlyOne Club アメリカンフェンス 1500×900 ST2-OAMF15",
    description: "オンリーワンクラブのアメリカンフェンス 1500×900mm。完成品パネルを1枚から単品購入でき、全国配送に対応します。",
    image: "images/products/american-fence/official/american-fence-panel-1500x900-product.jpg"
  },
  {
    id: "ST2-OAMP15", masterGroup: "posts", masterKey: "ST2-OAMP15",
    title: "OnlyOne Club アメリカンフェンス ポール H1500 ST2-OAMP15",
    description: "オンリーワンクラブのアメリカンフェンス用ポール H1500（φ32×1500mm）。1本から必要数だけ単品購入でき、全国配送に対応します。",
    image: "images/products/american-fence/official/american-fence-pole-h1500-h2000-product.jpg"
  },
  {
    id: "ST2-OAMP20", masterGroup: "posts", masterKey: "ST2-OAMP20",
    title: "OnlyOne Club アメリカンフェンス ポール H2000 ST2-OAMP20",
    description: "オンリーワンクラブのアメリカンフェンス用ポール H2000（φ32×2000mm）。1本から必要数だけ単品購入でき、全国配送に対応します。",
    image: "images/products/american-fence/official/american-fence-pole-h1500-h2000-product.jpg"
  },
  {
    id: "ST2-OAMJNT", masterGroup: "fittings", masterKey: "ST2-OAMJNT",
    title: "OnlyOne Club アメリカンフェンス ジョイント ST2-OAMJNT",
    description: "オンリーワンクラブのアメリカンフェンス用ジョイント（約40×133mm）。必要数だけ単品購入でき、全国配送に対応します。",
    image: "images/products/american-fence/official/american-fence-joint-product.jpg"
  },
  {
    id: "ST2-OAMHNJ", masterGroup: "fittings", masterKey: "hinge",
    title: "OnlyOne Club アメリカンフェンス 門扉用ヒンジ ST2-OAMHNJ",
    description: "オンリーワンクラブのアメリカンフェンスを門扉として使用するためのヒンジ。必要数だけ単品購入でき、全国配送に対応します。",
    image: "images/products/american-fence/official/american-fence-hinge-product.jpg"
  },
  {
    id: "ST2-OAMDRL", masterGroup: "fittings", masterKey: "latch",
    title: "OnlyOne Club アメリカンフェンス 門扉用ドアラッチ ST2-OAMDRL",
    description: "オンリーワンクラブのアメリカンフェンスを門扉として使用するためのドアラッチ。必要数だけ単品購入でき、全国配送に対応します。",
    image: "images/products/american-fence/official/american-fence-door-latch-product.jpg"
  }
];

function xml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function customerPriceTaxIn(listPrice) {
  const priceExTax = Math.round(listPrice * CUSTOMER_RATE);
  return priceExTax + Math.round(priceExTax * TAX_RATE);
}

function productItem(product) {
  const master = engine.PRODUCT_MASTER[product.masterGroup][product.masterKey];
  if (!master) throw new Error(`商品マスタが見つかりません: ${product.id}`);
  const price = customerPriceTaxIn(master.listPrice);
  const link = `${SITE_URL}#${product.id}`;
  const imageLink = new URL(product.image, SITE_URL).href;

  return [
    "    <item>",
    `      <g:id>${xml(product.id)}</g:id>`,
    `      <g:title>${xml(product.title)}</g:title>`,
    `      <g:description>${xml(product.description)}</g:description>`,
    `      <g:link>${xml(link)}</g:link>`,
    `      <g:image_link>${xml(imageLink)}</g:image_link>`,
    "      <g:availability>in_stock</g:availability>",
    `      <g:price>${price} JPY</g:price>`,
    "      <g:brand>OnlyOne Club</g:brand>",
    `      <g:mpn>${xml(product.id)}</g:mpn>`,
    "      <g:condition>new</g:condition>",
    "    </item>"
  ].join("\n");
}

const feed = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">',
  "  <channel>",
  "    <title>Garden Living OnlyOne Club アメリカンフェンス商品フィード</title>",
  `    <link>${SITE_URL}</link>`,
  "    <description>Garden Livingで販売するOnlyOne Club アメリカンフェンス関連商品</description>",
  PRODUCTS.map(productItem).join("\n"),
  "  </channel>",
  "</rss>",
  ""
].join("\n");

fs.writeFileSync(path.join(__dirname, "..", "merchant-center-feed.xml"), feed, "utf8");
console.log(`merchant-center-feed.xml を ${PRODUCTS.length}商品で生成しました。`);
