import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-mint-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="relative card-pop max-w-md w-full text-center animate-slide-up">
        <div className="text-5xl mb-4 animate-float">📝</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">新規登録について</h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          このプロトタイプ版では、新規登録は無効化されています。<br />
          まずは <strong>仮ログイン</strong> でお試しください ✨
        </p>
        <div className="space-y-3">
          <Link href="/login" className="btn-primary w-full justify-center">🎉 仮ログインへ進む</Link>
          <Link href="/" className="btn-ghost w-full justify-center text-xs">← トップページに戻る</Link>
        </div>
        <p className="text-[10px] text-slate-400 mt-6">本番リリース時には、実際のアカウント登録フローを実装予定です。</p>
      </div>
    </main>
  );
}
