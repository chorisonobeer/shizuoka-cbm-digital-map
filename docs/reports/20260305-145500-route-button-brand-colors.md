# 詳細画面ルートボタン改修・ブランドカラー全面刷新・ローディングUI改善

## 実施内容

### 1. ルートボタン改修（Shop.svelte）
- テキスト: 「道順を表示」→「ここまでのルートを見る」
- URL: Apple Maps (`maps.apple.com`) → Google Maps ルート案内
  - `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`
- `target="_blank" rel="noopener noreferrer"` を追加
- モバイルではGoogle Mapsアプリが自動起動（iOS/Android両対応）

### 2. ローディングUI改善（list/+page.svelte）
- 「読み込み中...」テキスト → CSSスピナーアニメーション
- ブランドカラー（ダークネイビー）で回転するリング表示
- `@keyframes spin` による無限回転アニメーション

### 3. ブランドカラー全面刷新（全10ファイル）

#### 新カラー体系（app.css に CSS変数定義）
| 用途 | 変数名 | HEX |
|------|--------|-----|
| メインカラー | `--primary-color` | `#1a2e44`（ダークネイビー） |
| サブカラー | `--sub-color` | `#c8a96e`（クラフトブラウン） |
| 背景色 | `--bg-color` | `#f5f0e8`（ウォームホワイト） |
| テキスト主 | `--text-primary` | `#333333` |
| テキスト副 | `--text-secondary` | `#666666` |
| アクセント | `--accent-color` | `#3a6b8c`（マップブルー） |

#### 旧→新マッピング
- `#d2691e`（チョコレートブラウン）→ `#1a2e44`（ダークネイビー）
- `#E7E7E5`（グレー背景）→ `#f5f0e8`（ウォームホワイト）
- `#1a5276`（Aboutページネイビー）→ `#1a2e44`（統一）
- `#FF0000`（地図ピン赤）→ `#1a2e44`（ダークネイビー）
- `#007bff`（リンク青）→ `#3a6b8c`（マップブルー）
- About見出し下線 → `#c8a96e`（クラフトブラウン）

## 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/app.css` | CSS変数6色定義（`:root`） |
| `src/app.html` | `theme-color` → `#1a2e44` |
| `src/routes/+layout.svelte` | リンク色→マップブルー、フッター背景→ウォームホワイト |
| `src/lib/components/Tabbar.svelte` | 背景→ウォームホワイト、アクティブ色→ネイビー |
| `src/lib/components/FilterBar.svelte` | 背景→ウォームホワイト、トグル色→ネイビー |
| `src/routes/list/+page.svelte` | 背景→ウォームホワイト、スピナーアニメーション追加 |
| `src/lib/components/Shop.svelte` | オーバーレイ背景→ウォームホワイト、ルートボタンURL変更 |
| `src/lib/components/Map.svelte` | 地図ピン色 `#FF0000` → `#1a2e44` |
| `src/lib/setCluster.ts` | クラスタ色 `#FF0000` → `#1a2e44` |
| `src/routes/about/+page.svelte` | 全色を新カラー体系に統一 |

## 検証結果

- 期待値: `netlify build --offline` 通過
- 実測値: `Netlify Build Complete`（1m 51.6s）✓
- ユーザー実機確認: OK
