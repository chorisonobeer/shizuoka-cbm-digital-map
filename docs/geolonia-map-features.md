# Geolonia Maps 機能・レイヤー ON/OFF リファレンス

本プロジェクト（shizuoka-cbm-digital-map）で使用している Geolonia Maps の全機能と、各レイヤーの表示状態を一覧化したドキュメント。

---

## 1. Embed API コントロール（UIボタン類）

地図コンテナの `data-*` 属性で ON/OFF を切り替えられる。

| 機能 | 属性名 | デフォルト | 本プロジェクトでの設定 | 説明 |
|---|---|---|---|---|
| ズームボタン（+/-） | `data-navigation-control` | `on` | **on**（未指定=デフォルト） | 地図右上のズームイン/アウトボタン |
| 現在地ボタン | `data-geolocate-control` | `off` | **on** | GPS で現在地を表示するボタン |
| フルスクリーンボタン | `data-fullscreen-control` | `off` | **off**（未指定=デフォルト） | 地図を全画面表示にするボタン |
| スケールバー | `data-scale-control` | `off` | **off**（未指定=デフォルト） | 地図下部の距離目盛り |
| デフォルトマーカー | `data-marker` | `on` | **off** | 中心座標に赤ピンを表示 |
| ジェスチャー制御 | `data-gesture-handling` | `on` | **off** | alt/2本指操作の強制（モバイルUX） |
| URL連動ハッシュ | `data-hash` | `off` | **off**（未指定=デフォルト） | ズーム/緯度経度をURLに反映 |
| ローディングアニメ | `data-loader` | `on` | **on**（未指定=デフォルト） | タイル読込中のスピナー |
| 遅延ロード | `data-lazy-loading` | `on` | ※JS初期化のため未使用 | ビューポート外の地図を遅延読込 |
| ロゴ位置 | `data-geolonia-control` | `bottom-left` | **bottom-left**（デフォルト） | Geolonia ロゴの配置位置 |

### コントロール配置位置の指定

`on` の代わりに位置を指定可能: `top-right`, `bottom-right`, `bottom-left`, `top-left`

```html
<div class="geolonia" data-scale-control="bottom-right"></div>
```

---

## 2. 地図スタイル設定

| 設定 | 属性/オプション | 本プロジェクト | 説明 |
|---|---|---|---|
| 地図スタイル | `data-style` | カスタムJSON (`/map-style.json`) | Warmベージュカスタムスタイル |
| 言語 | `data-lang` | `auto`（未指定=デフォルト） | ラベル言語 |
| CJKフォント代替 | `localIdeographFontFamily` | `'sans-serif'` | CORS回避のためシステムフォント使用 |
| ポップアップ初期表示 | `data-open-popup` | `off`（未指定=デフォルト） | 初期状態でポップアップを開くか |
| クラスタリング | `data-cluster` | ※JS で独自実装 | GeoJSON ソースで直接設定 |

### 利用可能なプリセットスタイル

| スタイル名 | 説明 |
|---|---|
| `geolonia/basic` | 標準（本プロジェクトのBASICモード） |
| `geolonia/gsi` | 国土地理院風 |
| `geolonia/midnight` | ダークモード |
| `geolonia/red-planet` | 赤系 |
| `geolonia/notebook` | 手書き風 |

---

## 3. 地図レイヤー一覧と表示状態

### 凡例

- **表示**: スタイルJSONで `visibility: "visible"`（またはデフォルトで表示）
- **非表示**: スタイルJSONで `visibility: "none"`
- **JS非表示**: Map.svelte の `hidePoiLayers()` でランタイム非表示化

---

### 3.1. 背景・地形

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 0 | `background` | background | 表示 | 地面の基本色 (`#e8dfc8`) |
| 11 | `hillshading` | hillshade | 表示 | 陰影起伏（標高による立体感） |

### 3.2. 土地被覆・土地利用

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 1 | `landcover-grass` | fill | 表示 | 草地 |
| 2 | `landcover-wood-blur` | line | 表示 | 森林（ぼかし線） |
| 3 | `landcover-wood` | fill | 表示 | 森林 |
| 4 | `landcover-grass-park` | fill | 表示 | 公園草地 |
| 25 | `farmland` | fill | 表示 | 農地 |
| 26 | `landuse-commercial` | fill | 表示 | 商業地 |
| 27 | `landuse-industrial` | fill | 表示 | 工業地 |
| 28 | `park` | fill | 表示 | 公園 |
| 29 | `landuse-cemetery` | fill | 表示 | 墓地 |
| 30 | `landuse-hospital` | fill | 表示 | 病院 |
| 31 | `landuse-school` | fill | 表示 | 学校 |
| 32 | `landuse-railway` | fill | 表示 | 鉄道用地 |

### 3.3. 水系

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 5 | `water-blur` | line | 表示 | 水辺ぼかし線 |
| 6 | `water-river-lake-ja-blur` | line | 表示 | 河川・湖ぼかし（日本） |
| 7 | `water` | fill | 表示 | 水域 |
| 8 | `water-river-lake-ja` | fill | 表示 | 河川・湖（日本） |
| 9 | `oc-ocean200` | fill | 表示 | 海洋 |
| 10 | `oc-glacier` | fill | 表示 | 氷河 |
| 12 | `oc-waterway-river-ja` | line | 表示 | 河川線（日本） |
| 13 | `oc-waterway-river` | line | 表示 | 河川線 |
| 16 | `oc-lake-ja` | fill | 表示 | 湖（日本） |
| 17 | `oc-lake-blur` | line | 表示 | 湖ぼかし |
| 18 | `oc-lake` | fill | 表示 | 湖 |
| 33 | `waterway_tunnel` | line | 表示 | 水路トンネル |
| 34 | `waterway-other` | line | 表示 | その他水路 |
| 35 | `waterway-stream-canal` | line | 表示 | 小川・運河 |
| 36 | `waterway-river` | line | 表示 | 河川 |

### 3.4. 水系ラベル

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 14 | `oc-waterway-name-ja` | symbol | 表示 | 河川名（日本） |
| 15 | `oc-waterway-name` | symbol | 表示 | 河川名 |
| 20 | `oc-water-name-ocean` | symbol | 表示 | 海洋名 |
| 21 | `oc-water-name-other` | symbol | 表示 | その他水域名 |
| 22 | `nt-water-name-ocean` | symbol | 表示 | 海洋名（NT） |
| 23 | `nt-water-name-river` | symbol | 表示 | 河川名（NT） |
| 37 | `water-name-ocean` | symbol | 表示 | 海洋名 |
| 38 | `water-name-other` | symbol | 表示 | その他水域名 |
| 80 | `waterway-name` | symbol | 表示 | 水路名 |
| 81 | `water-name-lakeline` | symbol | 表示 | 湖名 |

### 3.5. 境界線

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 19 | `boundary-land-level-0` | line | 表示 | 国境 |
| 99 | `boundary-land-level-4` | line | 表示 | 都道府県境 |

### 3.6. 道路

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 64 | `highway-area` | fill | 表示 | 道路面（広場等） |
| 65 | `highway-motorway-link-casing` | line | 表示 | 高速ランプ縁取り |
| 66 | `highway-link-casing` | line | 表示 | ランプ縁取り |
| 67 | `highway-minor-casing` | line | 表示 | 細街路縁取り |
| 68 | `highway-secondary-tertiary-casing` | line | 表示 | 県道・一般道縁取り |
| 69 | `highway-primary-casing` | line | 表示 | 主要道縁取り |
| 70 | `highway-trunk-casing` | line | 表示 | 国道縁取り |
| 71 | `highway-motorway-casing` | line | 表示 | 高速道路縁取り |
| 72 | `highway-path` | line | 表示 | 歩道・小径 |
| 73 | `highway-motorway-link` | line | 表示 | 高速ランプ |
| 74 | `highway-link` | line | 表示 | ランプ |
| 75 | `highway-minor` | line | 表示 | 細街路 |
| 76 | `highway-secondary-tertiary` | line | 表示 | 県道・一般道 |
| 77 | `highway-primary` | line | 表示 | 主要道 |
| 78 | `highway-trunk` | line | 表示 | 国道 |
| 79 | `highway-motorway` | line | 表示 | 高速道路 |

### 3.7. 道路番号シールド

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 116 | `road_shield_prefectural` | symbol | 表示 | 県道番号 |
| 117 | `road_shield_national` | symbol | 表示 | 国道番号 |
| 118 | `road_shield_highway` | symbol | 表示 | 高速道路番号 |

### 3.8. 鉄道

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 82 | `railway` | line | 表示 | 鉄道線 |
| 83 | `railway-hatching` | line | 表示 | 鉄道ハッチング |
| 84 | `railway-subway` | line | 表示 | 地下鉄 |
| 100 | `railway-name` | symbol | 表示 | 鉄道路線名 |
| 101 | `railway-subway-name` | symbol | 表示 | 地下鉄路線名 |

### 3.9. 建物

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 62 | `building` | fill | 表示 | 建物（2D） |
| 63 | `building-3d` | fill-extrusion | **非表示** | 建物（3D押出し）※意図的 |

### 3.10. トンネル

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 47 | `tunnel-railway` | line | 表示 | 鉄道トンネル |
| 48-57 | `tunnel-*` | line | 表示 | 各種道路トンネル（8レイヤー） |

### 3.11. 橋梁

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 41-46 | `bridge-*-blur` | line | 表示 | 橋のぼかし線（6レイヤー） |
| 85-96 | `bridge-*` | line | 表示 | 橋の道路線（12レイヤー） |

### 3.12. その他交通

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 24 | `oc-airport` | symbol | 表示 | 空港名 |
| 39 | `ferry` | line | 表示 | フェリー航路 |
| 58-61 | `aeroway-*` | line | 表示 | 空港滑走路・誘導路 |
| 97 | `cablecar` | line | 表示 | ケーブルカー |
| 98 | `cablecar-dash` | line | 表示 | ケーブルカー破線 |
| 102 | `road_oneway` | symbol | 表示 | 一方通行矢印 |
| 103 | `road_oneway_opposite` | symbol | 表示 | 逆方向一方通行 |

### 3.13. POI（施設ラベル）⚠️ 問題箇所

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 104 | `poi-z16` | symbol | **非表示** | ズーム16の一般施設 |
| 105 | `poi-z16-primary` | symbol | **非表示** | ズーム16の主要施設 |
| 106 | `poi-z15` | symbol | **非表示** | ズーム15の施設 |
| 107 | `poi-z14` | symbol | **非表示** | ズーム14の施設 |
| 108 | `poi-z11` | symbol | **非表示** | ズーム11の施設（広域） |
| 109 | `poi-worship` | symbol | **非表示** | 神社・寺院 |
| 110 | `poi-worship-primary` | symbol | **非表示** | 主要神社・寺院 |
| 111 | `poi-park` | symbol | **非表示** | 公園名 |
| 112 | `poi-park-primary` | symbol | **非表示** | 主要公園名 |
| 113 | `poi-railway` | symbol | **非表示** | 駅名 |
| 114 | `poi-airport-primary` | symbol | **非表示** | 空港名 |
| 115 | `poi-mountain` | symbol | **非表示** | 山名 |

**補足**: Map.svelte の `hidePoiLayers()` でも上記レイヤー + `poi`, `poi-primary`, `poi-r0-r9`, `poi-r10-r24`, `poi-r25`, `poi-bus`, `poi-entrance` をランタイムで非表示化している（BASICスタイルへの切替時にも適用）。

### 3.14. 地名ラベル

| # | レイヤーID | タイプ | 表示状態 | 説明 |
|---|---|---|---|---|
| 119 | `nt-label-small` | symbol | 表示 | 小地域名 |
| 120 | `nt-label-large` | symbol | 表示 | 大地域名 |
| 121 | `place-village` | symbol | 表示 | 村名 |
| 122 | `place-town` | symbol | 表示 | 町名 |
| 123 | `place-island-name` | symbol | 表示 | 島名 |
| 124-132 | `place-city-rank2`〜`rank10` | symbol | 表示 | 市名（ランク別） |
| 133 | `place-city-capital` | symbol | 表示 | 首都名 |
| 134 | `place-city-pref-ja` | symbol | 表示 | 県庁所在地（日本） |
| 135 | `place-city-pref` | symbol | 表示 | 県庁所在地 |
| 136 | `place-city-country` | symbol | 表示 | 国名 |

---

## 4. 本プロジェクト独自レイヤー（JS動的追加）

`setCluster.ts` で地図ロード後に動的追加されるレイヤー。

| レイヤーID | タイプ | 説明 |
|---|---|---|
| `clusters` | circle | クラスタ円（ブランドブルー） |
| `cluster-count` | symbol | クラスタ内件数ラベル |
| `unclustered-point` | symbol | 個別店舗ピン（ティアドロップ型） |
| `shop-labels` | symbol | 店名ラベル（ズームイン時表示） |

---

## 5. マーカー・ポップアップ設定

| 設定 | 属性名 | デフォルト | 本プロジェクト |
|---|---|---|---|
| マーカー色 | `data-marker-color` | `#E4402F` | 未使用（独自Canvas描画） |
| カスタムマーカー | `data-custom-marker` | なし | 未使用（Canvas ティアドロップ） |
| マーカーオフセット | `data-custom-marker-offset` | `0, 0` | 未使用 |
| ポップアップ初期表示 | `data-open-popup` | `off` | off |

---

## 6. 地図操作設定

| 設定 | 属性/オプション | デフォルト | 本プロジェクト |
|---|---|---|---|
| 最小ズーム | `data-min-zoom` | なし | 未指定 |
| 最大ズーム | `data-max-zoom` | なし | 未指定 |
| 方角（回転） | `data-bearing` | `0` | 未指定（北向き） |
| 傾斜角 | `data-pitch` | `0` | 未指定（真上視点） |

---

## 7. 非表示レイヤーまとめ（意図的 vs 要修正）

| レイヤー | 非表示方法 | 判定 | 理由 |
|---|---|---|---|
| `building-3d` | スタイルJSON | **意図的** | 2D表示で十分。3Dはパフォーマンス負荷 |
| `poi-z11`〜`poi-z16-primary` | スタイルJSON + JS | **要修正** | 駅名・施設名がないとゴーストタウン化 |
| `poi-worship`〜`poi-mountain` | スタイルJSON + JS | **要修正** | 神社・公園・山名もないと地図として不便 |
| `poi-railway` | スタイルJSON + JS | **要修正** | 駅名非表示は致命的 |

---

## 8. 変更履歴

| 日付 | 変更内容 |
|---|---|
| 2026-03-06 | 初版作成（POI非表示問題の調査で全レイヤー棚卸し） |
