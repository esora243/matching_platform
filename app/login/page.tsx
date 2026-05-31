import Link from 'next/link';
import { loginAsRole } from './actions';
import type { UserRole } from '@/types/database';

interface RoleOption {
  role: UserRole; emoji: string; title: string;
  catchphrase: string; description: string;
  cardClass: string; emojiClass: string;
}

const roleOptions: RoleOption[] = [
  { role: 'student', emoji: '🎓', title: '学生',
    catchphrase: '挑戦したい在校生のあなたへ',
    description: '気軽に相談を投稿して、先輩や先生と繋がろう ✨',
    cardClass: 'hover:border-brand-300 hover:bg-brand-50/40',
    emojiClass: 'drop-shadow-[0_8px_16px_rgba(59,130,246,0.4)]' },
  { role: 'ob_og', emoji: '🚀', title: 'OB・OG',
    catchphrase: '先輩起業家として後輩を応援',
    description: '経験を共有して、次世代を支援しよう 💪',
    cardClass: 'hover:border-coral-300 hover:bg-coral-50/40',
    emojiClass: 'drop-shadow-[0_8px_16px_rgba(244,63,94,0.4)]' },
  { role: 'faculty', emoji: '👨‍🏫', title: '教職員',
    catchphrase: '研究と起業をつなぐ',
    description: '支援プログラムや補助金情報を発信 📚',
    cardClass: 'hover:border-mint-300 hover:bg-mint-50/40',
    emojiClass: 'drop-shadow-[0_8px_16px_rgba(16,185,129,0.4)]' },
  { role: 'admin', emoji: '🛡️', title: '管理者',
    catchphrase: 'コミュニティを健やかに',
    description: 'メンバー承認やプラットフォーム運営 🎯',
    cardClass: 'hover:border-sunny-300 hover:bg-sunny-50/40',
    emojiClass: 'drop-shadow-[0_8px_16px_rgba(245,158,11,0.4)]' },
];

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-coral-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mint-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-soft mb-4 text-xs font-semibold text-brand-600 border border-brand-100">
            <span className="animate-pulse">●</span> プロトタイプ版・仮ログイン
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-hero bg-clip-text text-transparent">
            ようこそ！ 🎉
          </h1>
          <p className="text-base md:text-lg text-slate-600">
            まずは あなたのロールを選んで、ホームへ進みましょう ✨
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-slide-up">
          {roleOptions.map((opt) => (
            <form key={opt.role} action={loginAsRole.bind(null, opt.role)}>
              <button type="submit" className={`group role-card w-full text-center ${opt.cardClass}`}>
                <div className={`role-card-emoji ${opt.emojiClass}`}>{opt.emoji}</div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-slate-900">{opt.title} として入る</div>
                  <div className="text-xs font-medium text-slate-500">{opt.catchphrase}</div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{opt.description}</p>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  ログイン →
                </div>
              </button>
            </form>
          ))}
        </div>

        <div className="mt-10 text-center space-y-2 animate-fade-in">
          <p className="text-xs text-slate-500">🔒 これはダミー認証です。本番環境では実際のアカウントが必要になります。</p>
          <p className="text-xs text-slate-400">
            <Link href="/" className="hover:text-brand-600 transition-colors">← トップページに戻る</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
