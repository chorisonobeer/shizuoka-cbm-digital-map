# 報告書: React → SvelteKit + Bun マイグレーション

**日時**: 2026-03-05
**ブランチ**: `task/20260305-svelte-bun-migration`

## 実施内容

React (CRA) + npm 構成を SvelteKit + Bun + Tailwind CSS + Netlify に全面リファクタリング。

### スタック変更

| 項目 | Before | After |
|------|--------|-------|
| Framework | React 17 (CRA) | SvelteKit (Svelte 5) |
| Runtime | Node + npm | Bun 1.3.10 |
| Routing | react-router-dom (HashRouter) | SvelteKit ファイルベースルーティング |
| Styling | SCSS (13ファイル) | Tailwind CSS v4 + scoped CSS |
| Icons | react-icons | lucide-svelte |
| Deploy | GitHub Pages (gh-pages) | Netlify (adapter-netlify) |
| 地図/CSV/距離 | Geolonia/PapaParse/@turf | 同じ（維持） |

### 実施ステップ

1. **Step 0**: Bun インストール、SvelteKit スキャフォールド、Tailwind + adapter-netlify 設定
2. **Step 1**: `config.yml` → `yaml` パッケージでパースする `$lib/config.ts` に移行
3. **Step 2**: 型定義を英語カラム名の `ShopData` interface に更新
4. **Step 3**: ユーティリティ関数（toGeoJson, setCluster, distance-label, geolocation）を `$lib/` に移植
5. **Step 4**: SvelteKit ファイルベースルーティング構造を構築
6. **Step 5**: 全13 React コンポーネントを Svelte 5 ($props, $derived, $state, $effect) に移植
7. **Step 6**: Geolonia Maps SDK を `app.html` CDN + `onMount` パターンで統合
8. **Step 7**: SCSS → Tailwind CSS + scoped CSS
9. **Step 8**: PWA アセットを `static/` に移動
10. **Step 9**: `netlify.toml` + `adapter-netlify` でデプロイ設定
11. **Step 10**: `.gitignore` 更新、不要ファイル整理

## 変更ファイル

### 新規作成
- `svelte.config.js`, `vite.config.ts`, `netlify.toml`
- `src/app.html`, `src/app.css`
- `src/lib/config.ts`, `src/lib/types.ts`
- `src/lib/toGeoJson.ts`, `src/lib/setCluster.ts`, `src/lib/distance-label.ts`, `src/lib/geolocation.ts`
- `src/lib/components/` (6 Svelte コンポーネント)
- `src/routes/` (7 ルートファイル)
- `static/` (PWA アセット)

### 削除
- `src/` 配下の全 React コンポーネント (.tsx, .scss)
- `public/` ディレクトリ
- `bin/config.js`
- `package-lock.json`

## 検証結果

| 検証項目 | 期待値 | 実測値 |
|----------|--------|--------|
| `bun run build` | エラーなし | ✅ 成功（a11y警告のみ） |
| `netlify build --offline` | ビルド成功 | ✅ `Netlify Build Complete` (1m 58.6s) |
| `bun run dev` 地図表示 | 48店舗のピン表示 | ✅ 表示確認済み |
| CSVデータフェッチ | 52行パース、48行有効 | ✅ 48件表示 |

### netlify build --offline 出力（抜粋）
```
Netlify Build Complete
(Netlify Build completed in 1m 58.6s)
Packaging Functions from .netlify/functions-internal directory:
 - sveltekit-render.mjs
```

## 発見・修正した問題

1. **`global is not defined`**: `@mapbox/geojson-extent` が Node.js の `global` を参照 → `vite.config.ts` で `global: 'globalThis'` にマッピング
2. **config.yml の data_url**: マイグレーションブランチの変更が master に未マージ → 手動で静岡CBM用URLに更新
3. **日本語→英語カラム名不整合**: 全コンポーネントの `'緯度'`→`latitude`, `'スポット名'`→`name` 等を一括修正

## Next Step（次セッション）

- [ ] `_old/` ディレクトリ削除
- [ ] CLAUDE.md のアーキテクチャセクション更新
- [ ] a11y 警告の修正（img/h2 の interactive event handling）
- [ ] PWA Service Worker 設定 (`@vite-pwa/sveltekit`)
- [ ] Netlify 本番デプロイ
- [ ] AboutUs ページの静岡CBM向けコンテンツ書き換え
