# 作業報告: ボトムナビ色反転 + 6色パレット統合

**日時**: 2026-03-06
**ブランチ**: `task/20260306-bottom-nav-color-swap`

## 実施内容

### 1. Primary Color 変更
- `--primary-color` を `#1a2e44` → `#253980` に変更

### 2. 6色パレット体制確立
| 変数 | 値 | 役割 |
|------|-----|------|
| `--primary-color` | `#253980` | ナビ背景、ヘッダー、ボタン、バッジ |
| `--sub-color` | `#c8a96e` | アクセント罫線、地域タグ |
| `--bg-color` | `#f5f0e8` | ページ背景 |
| `--text-color` | `#333333` | テキスト全般 |
| `--accent-color` | `#3a6b8c` | リンク、距離表示 |
| `--muted-color` | `#9ca3af` | ボーダー、非アクティブ |

### 3. 全ハードコード色のCSS変数化
- 約100箇所のハードコード色を6変数に統合
- タグ背景は `color-mix(in srgb, var(--xxx) 15%, white)` で派生
- フォールバック値 `var(--xxx, #yyy)` を全廃

### 4. ボトムナビ色反転
- 背景: `var(--primary-color)` (濃紺)
- アクティブタブ: `#fff`
- 非アクティブ: `rgba(255, 255, 255, 0.55)`

### 5. スタイル切替ボタン → トグルスイッチ化
- テキストボタン → ON/OFFスイッチ (36x20px)
- MapLibreコントロール要素を基準に動的配置

## 変更ファイル (17ファイル)
- `src/app.css` — 6色パレット定義
- `src/app.html` — theme-color更新
- `src/lib/components/Tabbar.svelte` — 背景・色反転
- `src/lib/components/Map.svelte` — トグルスイッチ化、CSS変数化
- `src/lib/components/Shop.svelte` — タグ・テキスト・ボーダー変数化
- `src/lib/components/ShopListItem.svelte` — 同上
- `src/lib/components/EventsPage.svelte` — 同上
- `src/lib/components/AboutPage.svelte` — 同上
- `src/lib/components/FilterBar.svelte` — 同上
- `src/lib/components/InstallBanner.svelte` — フォールバック削除
- `src/lib/components/ListPage.svelte` — 同上
- `src/lib/components/About.svelte` — text-shadow変数化
- `src/lib/setCluster.ts` — CSS変数参照
- `src/routes/+layout.svelte` — ボーダー・背景変数化
- `src/routes/about/+page.svelte` — 同上
- `src/routes/list/+page.svelte` — 同上
- `PROGRESS.yaml` — 進捗更新

## 検証結果
- **ビルド**: `bun run build` 成功（エラーなし、既存a11y警告のみ）
- **ブラウザ目視**: ユーザー確認OK
- **ハードコード残存**: 特例のみ（白/黒/SNSブランド色/ステータス緑・赤）

## 特例ハードコード色（許可済み）
- `#fff` / `#000` — 中立色
- `#e1306c` / `#1877f2` — SNSブランド色（Instagram, Facebook）
- `#16a34a` / `#dcfce7` — ステータス緑（開催中）
- `#dc2626` — ステータス赤（定休日）
