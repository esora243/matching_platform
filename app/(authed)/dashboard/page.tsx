import { requireAuth } from '@/lib/auth';
import { ROLE_LABEL, ROLE_EMOJI } from '@/lib/roles';
import Link from 'next/link';
import { dummyTopics, dummyEvents, dummyPrograms, dummyChatRooms, dummyChatRequests } from '@/lib/dummyData';

export default async function Dashboard() {
  const profile = await requireAuth();
  const stats = [
    { emoji: '💬', label: '相談トピック', value: dummyTopics.length, href: '/board', color: 'bg-brand-50 text-brand-700' },
    { emoji: '📅', label: 'イベント', value: dummyEvents.length, href: '/events', color: 'bg-mint-50 text-mint-700' },
    { emoji: '💰', label: '支援制度', value: dummyPrograms.length, href: '/programs', color: 'bg-sunny-50 text-sunny-500' },
    { emoji: '✉️', label: 'チャット', value: dummyChatRooms.length, href: '/chat', color: 'bg-coral-50 text-coral-600' },
  ];
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-hero p-6 md:p-8 text-white shadow-soft-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-3 backdrop-blur-sm">{ROLE_EMOJI[profile.role]} {ROLE_LABEL[profile.role]} アカウント</div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">こんにちは、{profile.full_name} さん 👋</h1>
          <p className="text-white/90 text-sm md:text-base">今日も素敵な一日を ✨ 気になる相談やイベントをチェックしてみましょう。</p>
        </div>
      </section>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card-hover group">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-2xl ${s.color} mb-3 group-hover:animate-wiggle`}>{s.emoji}</div>
            <div className="text-xs font-semibold text-slate-500">{s.label}</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">{s.value}</div>
            <div className="text-xs text-brand-600 mt-2 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">詳しく見る →</div>
          </Link>
        ))}
      </section>
      <section>
        <h2 className="section-title mb-4"><span>🎯</span> あなたにおすすめのアクション</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {profile.role === 'student' && (<>
            <ActionCard emoji="✨" title="気軽に相談してみる" desc="掲示板に投稿すると、先輩起業家や先生から回答がもらえます" href="/board/new" label="相談を書く" accent="brand" />
            <ActionCard emoji="🤝" title="先輩と1on1チャット" desc="OB・OGメンバーを見つけて、個別チャットを申請しよう" href="/profile" label="メンバーを探す" accent="coral" />
          </>)}
          {profile.role === 'ob_og' && (<>
            <ActionCard emoji="💬" title="後輩の相談に答える" desc="新しい相談トピックが投稿されています。経験を共有しよう" href="/board" label="掲示板を見る" accent="brand" />
            <ActionCard emoji="📬" title="チャット申請を確認" desc={`学生から ${dummyChatRequests.length} 件の申請が届いています`} href="/chat" label="申請を見る" accent="coral" />
          </>)}
          {profile.role === 'faculty' && (<>
            <ActionCard emoji="💰" title="支援制度を共有する" desc="補助金やアクセラレータの情報を学生に届けよう" href="/programs/new" label="新しい制度を登録" accent="mint" />
            <ActionCard emoji="📅" title="新しいイベントを企画する" desc="ピッチナイトやセミナーを開催してコミュニティを盛り上げよう" href="/events/new" label="イベントを作る" accent="brand" />
          </>)}
          {profile.role === 'admin' && (<>
            <ActionCard emoji="🛡️" title="OB・OG 承認" desc="新規登録のOB・OGアカウントを審査・承認" href="/admin" label="承認画面へ" accent="sunny" />
            <ActionCard emoji="👥" title="メンバー一覧を確認" desc="全ユーザーの状況をひと目でチェック" href="/admin" label="一覧を見る" accent="brand" />
          </>)}
        </div>
      </section>
      <section>
        <h2 className="section-title mb-4"><span>🔥</span> 最近の動き</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {dummyTopics.slice(0, 2).map((t) => (
            <Link key={t.id} href={`/board/${t.id}`} className="card-hover">
              <div className="flex items-start gap-3">
                <div className="text-2xl shrink-0">💭</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 truncate">{t.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{t.author.full_name} · 💬 {t.commentCount} 件の回答</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

type Accent = 'brand' | 'coral' | 'mint' | 'sunny';
function ActionCard({ emoji, title, desc, href, label, accent }: { emoji: string; title: string; desc: string; href: string; label: string; accent: Accent }) {
  const accentMap: Record<Accent, { ring: string; btn: string; bg: string }> = {
    brand: { ring: 'hover:ring-brand-200', btn: 'btn-primary', bg: 'from-brand-50' },
    coral: { ring: 'hover:ring-coral-200', btn: 'btn-coral', bg: 'from-coral-50' },
    mint:  { ring: 'hover:ring-mint-200',  btn: 'btn-mint',  bg: 'from-mint-50' },
    sunny: { ring: 'hover:ring-sunny-200', btn: 'btn-primary', bg: 'from-sunny-50' },
  };
  const a = accentMap[accent];
  return (
    <div className={`card-pop bg-gradient-to-br ${a.bg} to-white hover:-translate-y-1 hover:ring-4 ${a.ring} ring-0 transition-all duration-300`}>
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="font-bold text-lg text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-1 mb-4 leading-relaxed">{desc}</p>
      <Link href={href} className={a.btn}>{label} →</Link>
    </div>
  );
}
