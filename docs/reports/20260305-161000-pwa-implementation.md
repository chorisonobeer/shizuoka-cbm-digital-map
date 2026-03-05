# PWA実装（Service Worker + manifest + インストールバナー）

## 実施内容

### 1. manifest.json 更新
- `name`: 「静岡クラフトビールマップ」
- `short_name`: 「静岡CBM」
- `theme_color`: `#1a2e44`（ブランドカラー）
- `background_color`: `#f5f0e8`
- `start_url` / `scope`: `/`
- 存在しない `favicon.ico` エントリを削除

### 2. Service Worker 新規作成（static/sw.js）
- 最小限のSW: install → skipWaiting, activate → clients.claim
- キャッシュ戦略なし（Network-only）
- 外部依存（Google Sheets CSV, Geolonia Maps SDK）が多いためキャッシュは不安定の元と判断

### 3. app.html 更新
- SW登録スクリプト追加
- `apple-touch-icon` リンク追加
- `apple-mobile-web-app-status-bar-style` メタタグ追加

### 4. インストールバナー新規作成（InstallBanner.svelte）
- Android: `beforeinstallprompt` イベントで「インストール」ボタン付きバナー表示
- iOS: 「共有ボタンからホーム画面に追加」テキストバナー表示
- 閉じると `localStorage` にタイムスタンプ保存、24時間以内は再表示しない
- 既にスタンドアロンモード（インストール済み）なら非表示
- ブランドカラー（ダークネイビー）のシンプルな1行バナー

### 5. +layout.svelte 更新
- InstallBanner コンポーネントを組み込み

## 変更ファイル
| ファイル | 種別 |
|---------|------|
| `static/manifest.json` | 更新 |
| `static/sw.js` | 新規 |
| `src/app.html` | 更新 |
| `src/lib/components/InstallBanner.svelte` | 新規 |
| `src/routes/+layout.svelte` | 更新 |

## やらなかったこと（意図的）
- `@vite-pwa/sveltekit` パッケージ導入（過剰）
- オフラインキャッシュ（外部API依存で不安定になる）
- プッシュ通知
- カスタムインストールプロンプトUI（ブラウザ標準に任せる）

## 検証結果
- `netlify build --offline`: **成功**（Netlify Build Complete, 1m 55s）
- ビルドエラー: なし
- a11y警告: 既知のもの（images/+page.svelte の img タグ）のみ、今回のスコープ外
