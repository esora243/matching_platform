# 🚀 はままつ医大 スタートアップ・ハブ (プロトタイプ版)

学生・OB/OG・教職員・管理者の 4 ロールが連携する、医療スタートアップのためのコミュニティ・プロトタイプ。

## ✨ プロトタイプ版の特徴

- **データベース不要**：すべてのデータは `lib/dummyData.ts` のダミーで動作
- **仮ログイン**：`/login` でロールを選ぶだけ → Cookie 保存 → `/dashboard` へ
- **ポップで洗練されたデザインシステム**：鮮やかなブルー × ミントグリーン × コーラルピンク
- **マイクロインタラクション**：ホバーで浮き上がり、クリックでスケール、絵文字ふわふわ

## 🛠 セットアップ

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開き、

1. トップページの **「🎉 はじめる（仮ログイン）」** をクリック
2. 4 つのロール（学生・OB/OG・教職員・管理者）から好きなものを選択
3. それぞれのロールで見える画面が変わるので、切り替えて試してみてください

> ロールを切り替えるには、画面右上の「ログアウト」 → 再度 `/login` で選択し直してください。

## 📂 主要ディレクトリ

```
app/
├── (authed)/           # 認証必須エリア
│   ├── dashboard/      # 🏠 ホーム
│   ├── board/          # 💬 起業よろず相談
│   ├── events/         # 📅 イベント
│   ├── programs/       # 💰 支援制度・補助金
│   ├── profile/        # 👥 メンバー / マイプロフィール
│   ├── chat/           # ✉️ 1on1 チャット
│   └── admin/          # 🛡️ 管理者画面
├── login/              # 🎉 ロール選択式 仮ログイン
└── page.tsx            # ランディングページ

lib/
├── roles.ts            # ロール関連の定数（Client/Server/Edge 共通）
├── auth.ts             # Cookie 読取＆ダミープロフィール（Server 専用）
└── dummyData.ts        # 全ダミーデータ
```

## 🎨 デザインシステム

| 用途 | カラー |
|---|---|
| メイン | `brand-*` (鮮やかブルー) |
| 成功・成長 | `mint-*` (ミントグリーン) |
| アクセント・楽しさ | `coral-*` (コーラルピンク) |
| 注目 | `sunny-*` (サニーイエロー) |

主要なユーティリティクラスは `app/globals.css` の `@layer components` を参照：

- `btn-primary` / `btn-mint` / `btn-coral` / `btn-secondary` / `btn-ghost`
- `card` / `card-hover` / `card-pop`
- `badge-brand` / `badge-mint` / `badge-coral` / `badge-sunny`
- `chip` / `input` / `label`
- `role-card` (ログインページ専用)

## 🔄 本番リリース時の置き換えポイント

1. `lib/auth.ts` → 実際の認証プロバイダ (Supabase / NextAuth など) に差し替え
2. `lib/dummyData.ts` → 各ページの DB クエリに差し替え
3. `app/login/page.tsx` → メール/パスワードフォームに差し替え
4. `app/signup/page.tsx` → 実際の新規登録フォームに差し替え
