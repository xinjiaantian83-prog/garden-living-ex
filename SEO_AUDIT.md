# Garden Living SEO診断（2026-08-22）

## 実装前の主な状態

- title / description: トップ・法務ページには設定済み。内容も商品と全国販売を説明できていた。
- canonical: 既存3ページに設定済み。
- robots.txt: 全体をクロール許可し、sitemap.xmlを指定済み。
- sitemap.xml: トップ、特商法、返品の3URLのみだった。
- OGP: トップ・法務ページに設定済み。
- 構造化データ: トップにOrganization、ItemList、Product、FAQPageがあった。
- 内部リンク: トップ1ページ内の情報は豊富だが、商品・用途別の固有URLがなかった。
- 見出し構造: トップはh1が1つで、主要セクションはh2。大きな問題なし。
- URL設計: クエリ付き見積URLは共有向け。検索入口としての静的URLが不足していた。
- 商品ページ数: 商品別0ページ。用途別0ページ。
- EXた組からの送客: トップに1リンクのみ。DIY・資材ページからの文脈リンクが不足していた。

## 今回の改善

- 商品一覧、商品別7ページ、用途一覧、用途別7ページ、DIY購入、全国配送の計18ページを追加。
- 全ページに固有title、description、canonical、OGP、パンくず、内部リンクを設定。
- 商品別ページにProduct構造化データ、一覧にItemList、用途ページにArticle、全ページにOrganizationを設定。
- トップに商品・用途・DIY・全国配送への短い入口を追加。
- EXた組のトップ、DIY応援、資材販売からGarden Livingへの自然な送客リンクを追加。
- sitemap.xmlへ全URLを追加。
