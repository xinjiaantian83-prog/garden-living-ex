# Google Search Console 作業

1. Search Consoleで `https://gardenliving-ex.net/` のプロパティを開く。
2. 「サイトマップ」を開く。
3. `sitemap.xml` を送信する。
4. 「URL検査」で `https://gardenliving-ex.net/products/` を検査する。
5. 「インデックス登録をリクエスト」を押す。
6. 同様に `https://gardenliving-ex.net/uses/` を検査して登録をリクエストする。
7. 1〜2週間後、「検索結果」でページ別・クエリ別の表示回数を確認する。

## 90日判定で取得する項目

Search Consoleは「検索結果」で期間を公開日から90日目までに設定し、次をCSVまたはGoogle Sheetsへエクスポートする。

- 日別: 表示回数、クリック数、CTR、平均掲載順位
- クエリ別: 表示回数、クリック数、CTR、平均掲載順位
- ページ別: 表示回数、クリック数、CTR、平均掲載順位
- ページ + クエリ: 伸びているページに新規検索語が付いているか
- インデックス: 登録済み、クロール済み - インデックス未登録、検出 - インデックス未登録、canonical、noindex、robots、サイトマップ認識

GA4は「レポート > 集客 > トラフィック獲得」と「エンゲージメント > ランディングページ」で次を取得する。

- organic sessions
- organic users
- organic landing page数
- landing page別のorganic sessions
- 問い合わせ、LINE、電話、メールなど主要イベント

## Codexで直接取得したい場合

現在のリポジトリには `analytics.js` でGA4計測タグ `G-30TMHDBZP7` が設定済み。Search Console / GA4の実績データをCodexから直接読むには、次のいずれかの接続が必要。

- GSC Wizardをインストールし、Search ConsoleプロパティとGA4プロパティをGoogleログインで接続する
- Windsor.aiなど、GA4とSearch Consoleを読めるマーケティングデータ連携を接続する
- Search ConsoleとGA4からCSVを手動エクスポートし、このリポジトリ外の作業用フォルダへ置く

新規の有料契約やGoogle権限付与が必要な場合は、実行前に承認を取る。
