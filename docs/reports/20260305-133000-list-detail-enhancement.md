# 一覧タブ・詳細ページ情報拡充＋デザインリニューアル

## 実施内容

### 1. 一覧カード（ShopListItem.svelte）完全書き換え
- カード型レイアウト（白背景・角丸12px・シャドウ）にリデザイン
- 表示項目を大幅拡充:
  - 店舗名（16px/700）、地域タグ、カテゴリタグ、距離
  - 営業時間（Clockアイコン付き）、定休日（赤色強調）
  - 特徴バッジ（静岡ビール、Wi-Fi、カード可、駐車場、禁煙、英語OK等）
  - サムネイル画像（88x88px）
- hover時にelevation + translateYアニメーション

### 2. 詳細ページ（Shop.svelte）完全書き換え
- CSV全項目を構造化セクションで表示:
  - 基本情報カード: 住所、電話、営業時間、定休日、席数、タップ数
  - 特徴チップ: 全17種の0/1フラグ項目（値=1のみ表示）
  - 提供形態: 樽生、ボトル、缶
  - SNSリンク: Instagram, Twitter, Facebook, ウェブサイト
  - 紹介文: 日本語・英語
  - 醸造所名、カテゴリタグ
- 地図＋道順ボタン（ブランドカラー背景）

### 3. タイポグラフィ階層設計（理論ベース）
- ジャンプ率1.8xの階層構造:
  - Display: 22px/800（詳細の店舗名）
  - Title: 16px/700（カードの店舗名）
  - Body: 15px/400（説明文）
  - Info: 14px/400-500（住所・営業時間）
  - Section: 13px/700（セクション見出し）
  - Meta: 12px/400-600（カードのメタ情報）
  - Tag: 11px/600（バッジ・タグ）
  - Caption: 10px/500（特徴バッジ）
- line-height: 見出し1.2 / UI 1.5 / 本文1.7
- 色の階層: #171717→#404040→#737373→#a3a3a3

### 4. 型定義更新（types.ts）
- 全0/1フラグ項目（18種）＋提供形態（3種）＋line を明示的に型定義

### 5. 一覧コンテナ（list/+page.svelte）
- 背景色をグレー（#f3f4f6）に変更
- カード間gap 8pxで統一

## 変更ファイル
- `src/lib/types.ts`
- `src/lib/components/ShopListItem.svelte`
- `src/lib/components/Shop.svelte`
- `src/routes/list/+page.svelte`

## 検証結果
- 期待値: `netlify build --offline` エラーなし通過
- 実測値: **Netlify Build Complete** (2m 0.5s)

## 参考資料
- [UI Font Size Guidelines - b13](https://b13.com/blog/designing-with-type-a-guide-to-ui-font-size-guidelines)
- line-height: headlines 1.2x, body 1.5x（実装では本文1.7xに拡張）
- font-weight: 3段階以内を推奨 → 400/500-600/700-800 の3段階で実装
