# 地図ウォームベージュ化(スタイルJSON) + カテゴリ別ピンマーカー + フォント変更

## 実施内容

### 1. カスタムスタイルJSON作成 (static/map-style.json)
- Geolonia basic style.json (137レイヤー) をベースに全面カラー編集
- ウォームベージュ配色: 背景`#e8dfc8`, 水系`#c5dde8`, 道路`#f5ecd0`, 建物`#ccdce8`, 公園`#dde8d8`
- トンネル・橋・ランプ等の派生レイヤーも統一的に配色
- フォント: 全レイヤーを `Noto Sans Regular` に統一
- POIレイヤー: visibility → none (12レイヤー)
- `setPaintProperty` ランタイム方式から `data-style` 静的方式に完全移行

### 2. マーカー変更 (SVGアイコン → ピン型マーカー)
- SVGカスタムアイコン (`addImage` + `symbol`レイヤー) を廃止
- `geolonia.Marker` によるピン型マーカーに変更
- カテゴリ別3色: 醸造所`#1a2e44`, 飲める`#c8a96e`, 買える`#3a6b8c`
- 南北ソートで重なり順を制御

### 3. Map.svelte 簡素化
- `applyWarmStyle` / `resetToBasic` / `svgToImage` / `registerIcons` / `CATEGORY_ICONS` を削除
- Map初期化: `style: '/map-style.json'` + `localIdeographFontFamily: 'sans-serif'`
- BASIC/CBM切替: `map.setStyle()` で実装、`style.load` イベントでソース・レイヤー・マーカー再登録
- クラスタとピンマーカーの共存 (`updateMarkerVisibility` でクラスタ内ポイントのピンを非表示)

### 4. CORS問題の解決
- `glyphs.geolonia.com` がlocalhostからのCJKフォントDLをCORSブロック
- 解決: `localIdeographFontFamily: 'sans-serif'` でCJK文字はシステムフォント描画
- フォント名: `Noto Sans CJK JP Bold/Regular` の直接指定 → `Noto Sans Regular` に統一

### 5. Skill拡充 (geolonia-map.md)
- セクション10追加: MapLibre Style Spec 高度なカスタマイズ
  - Expressions (interpolate/step/match/case/coalesce/比較演算子/色関数)
  - レイヤー高度プロパティ (paint vs layout, fill/line/symbol/circle/fill-extrusion)
  - Source高度オプション (clusterProperties, Vector tile promoteId)
  - 実践パターン (ズーム色変化, カテゴリ別サイズ, ラベル表示制御)
  - CORS・フォント注意点 (実践で判明した知見)

## 変更ファイル
- `static/map-style.json` (新規, 63KB, 137レイヤー)
- `src/lib/components/Map.svelte` (全面書き換え)
- `src/lib/toGeoJson.ts` (前セッションで変更済み, primaryCategory追加)
- `src/lib/setCluster.ts` (前セッションで変更済み, ブランドカラー適用)
- `PROGRESS.yaml`

## 検証結果
- 期待値: `netlify build --offline` 成功
- 実測値: `Netlify Build completed in 2m 41.5s` — 成功
- ブラウザ確認: ウォームベージュ配色表示OK, CORSエラー解消, ピンマーカー表示OK
