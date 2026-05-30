# 浜松医科大学 起業支援プラットフォーム

学生・OB/OG・教職員・管理者の4ロールが連携する起業相談コミュニティ。

## 技術スタック
- **フロントエンド**: Next.js 14 (App Router) + React 18 + TypeScript
- **スタイリング**: Tailwind CSS
- **BaaS**: Supabase（Auth / PostgreSQL / Realtime / RLS）

## なぜ Supabase か
| 観点 | Supabase | Firebase |
|------|----------|----------|
| ロールベース権限 | **RLS で行レベル制御**（4ロール+承認制と相性◎） | カスタムクレーム＋セキュリティルールが煩雑 |
| リレーション | PostgreSQL（掲示板↔回答↔ユーザーの結合に強い） | NoSQL で結合不可 |
| リアルタイムチャット | Realtime 標準装備 | Firestore で実現可能 |
| 検索・全文検索 | PostgreSQL FTS | 外部 (Algolia) 必須 |

➡ 関係データ中心 × 4ロール承認制 × チャット という今回の要件は **Supabase が最適**。

## セットアップ
```bash
# 1. 依存インストール
npm install

# 2. .env.local を作成（.env.example をコピー）
cp .env.example .env.local
# Supabase Project の URL / anon key / service role key を記入

# 3. Supabase でマイグレーション実行
# Supabase Dashboard > SQL Editor で supabase/migrations/*.sql を順に実行

# 4. 開発サーバ起動
npm run dev
```

## 主要ディレクトリ
```
app/
├─ (auth)/login, signup        # サインアップ・ログイン
├─ board/                      # 起業相談掲示板（トピック・コメント）
├─ profile/                    # OB/OG・教職員プロフィール
├─ events/                     # イベント一覧・参加申込
├─ programs/                   # 支援プログラム・補助金
├─ chat/                       # 1対1 チャット（学生↔OB/OG）
├─ admin/                      # 管理者：OB/OG審査・ユーザー管理
└─ dashboard/                  # ロール別ダッシュボード
supabase/migrations/           # DB スキーマ + RLS ポリシー
```

## ロール別機能サマリー
| 機能 | 学生 | OB/OG | 教職員 | 管理者 |
|------|:---:|:----:|:------:|:-----:|
| 起業相談を投稿 | ◯ | – | – | – |
| 相談に公開回答 | – | ◯ | ◯ | – |
| プロフィール閲覧 | ◯ | ◯ | ◯ | ◯ |
| 創業経験/得意領域を登録 | – | ◯ | – | – |
| イベント主催・告知 | – | ◯ | ◯ | – |
| イベント参加申込 | ◯ | ◯ | ◯ | – |
| 支援プログラム/補助金登録 | – | – | ◯ | – |
| 1対1チャット相談（申請） | ◯ | – | – | – |
| 1対1チャット（承諾） | – | ◯ | – | – |
| OB/OG 承認 | – | – | – | ◯ |
| 全体管理 | – | – | – | ◯ |

## Phase 2 候補（未実装）
- OB/OG 側からの個別チャット受付制御UIの詳細化（100人規模想定の負荷分散）
- 通知（メール・プッシュ）
- 全文検索 (PostgreSQL `tsvector`)
- ファイル添付（Supabase Storage）
