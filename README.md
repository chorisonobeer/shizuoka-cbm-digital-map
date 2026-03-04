# 静岡クラフトビールマップ

静岡県のクラフトビールスポットを地図上で探せる PWA マップアプリです。

## 技術スタック

- **フレームワーク**: SvelteKit (Svelte 5)
- **パッケージマネージャ**: Bun
- **スタイリング**: Tailwind CSS v4 + scoped CSS
- **地図**: Geolonia Maps SDK
- **アイコン**: lucide-svelte
- **ホスティング**: Netlify (adapter-netlify)
- **データソース**: Google Sheets (CSV 経由)

## セットアップ

```shell
git clone git@github.com:<your-org>/shizuoka-cbm-digital-map.git
cd shizuoka-cbm-digital-map
bun install
```

## 開発コマンド

```shell
# 開発サーバー起動
bun run dev

# プロダクションビルド
bun run build

# ビルドプレビュー
bun run preview

# 型チェック
bun run check
```

## サイト設定

`src/lib/config.yml` でサイト全体の設定を変更できます。

| キー | 説明 |
|------|------|
| `title` | サイトのタイトル |
| `description` | サイトの概要文 |
| `data_url` | CSV データの URL（SSL 必須） |
| `form_url` | データ追加/更新用フォームの URL |
| `logo_image_url` | PC 表示時のロゴ画像 URL |
| `background_image_url` | PC 表示時の背景画像 URL |
| `primary_color` | テーマカラー（例: `#d2691e`） |
| `orderby` | 一覧の並び順（`distance`: 距離順 / `time`: 新着順） |

## スポットデータ

CSV に以下の必須カラムを含めてください: `緯度`, `経度`, `スポット名`, `カテゴリ`

Google Sheets を使う場合:
1. [テンプレート](https://docs.google.com/spreadsheets/d/1_m8s4P5tdSeam3nzC5ruSfuvtSejQKEX1FiBeOWJN3E/edit?usp=sharing) をコピー
2. 「ウェブに公開」→「スポットデータ」シート → CSV 形式で公開
3. 公開 URL を `config.yml` の `data_url` に設定

## プロジェクト構造

```
src/
├── lib/
│   ├── components/   # Svelte コンポーネント
│   ├── config.yml    # サイト設定
│   ├── config.ts     # 設定読み込みロジック
│   ├── types.ts      # 型定義
│   └── utils.ts      # ユーティリティ関数
├── routes/           # SvelteKit ファイルベースルーティング
│   ├── +layout.svelte
│   ├── +page.svelte  # ホーム（地図）
│   ├── list/         # 一覧ページ
│   ├── category/     # カテゴリページ
│   ├── images/       # 写真ページ
│   └── about/        # 情報ページ
└── app.css           # グローバルスタイル（Tailwind）
```

## デプロイ

Netlify にデプロイされます。`netlify.toml` で設定済み:

```toml
[build]
  command = "bun run build"
  publish = "build"
```

## ベース

[Geolonia PWA マップ](https://github.com/geoloniamaps/pwamap) をベースにしています。
