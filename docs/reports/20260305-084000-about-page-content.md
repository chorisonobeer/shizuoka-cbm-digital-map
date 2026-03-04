# 報告書: Aboutページを静岡CBMコンテンツに書き換え

**日時**: 2026-03-05
**ブランチ**: `task/20260305-about-page-content`

## 実施内容

Aboutページ (`/about`) をGeolonia PWAマップのテンプレート文から、PDF原本（静岡クラフトビアマップ 県Ver.）の表紙・紹介ページの内容に全面書き換え。

### 変更ファイル

| ファイル | 変更内容 |
|----------|----------|
| `src/routes/about/+page.svelte` | テンプレート→静岡CBM固有コンテンツに全面書き換え |

### 反映したPDFコンテンツ

**P02-03（紹介見開き）より:**
- 「ようこそ！ビール王国静岡へ！」/ "Welcome to the Beer Kingdom of Shizuoka!" タイトル・紹介文
- 静岡のクラフトビール史（90年代〜ベアード〜AOI BREWING〜19醸造所）
- マップの使い方 3ポイント（パブクロール / イベント探索 / ハッシュタグ投稿）
- 公式ハッシュタグ4種: `#静岡cbm` `#shizuokacbm` `#帰りたくない` `#静岡ビール子`

**P30-31（裏表紙）より:**
- サポーター募集セクション + 連絡先メールアドレス
- クレジット: 静岡市 商業活性化グループ事業補助金採択事業
- コピーライト: © Shizuoka Craft Beer Map

### 除去した内容
- Geolonia PWAマップの説明文・リンク
- Geoloniaお問い合わせフォームリンク
- データ更新用の「+」ボタン（form_url機能）
- `lucide-svelte` の `Plus` import

## 検証結果

```
$ netlify build --offline
...
Netlify Build Complete
(Netlify Build completed in 1m 54.8s)
```

- 期待値: `netlify build --offline` が成功する
- 実測値: 成功（1m 54.8s）、a11y警告は既存のもので今回の変更とは無関係
