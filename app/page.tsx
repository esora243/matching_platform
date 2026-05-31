import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-mint-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-coral-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-soft mb-6 text-xs font-semibold text-brand-600 border border-brand-100">
            <span className="animate-pulse">●</span> 浜松医科大学・公式コミュニティ
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            医学から、世界を変える。<br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">そのはじめの一歩を 🚀</span>
          </h1>
          <p className="text-base md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            起業を志す学生と、経験豊富な先輩・教職員がつながる<br className="hidden md:block" />
            医療スタートアップ・コミュニティへようこそ ✨
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn-primary text-base px-8 py-3.5">🎉 はじめる（仮ログイン）</Link>
            <Link href="/signup" className="btn-secondary text-base px-8 py-3.5">📝 新規登録について</Link>
          </div>
        </div>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-20 animate-fade-in">
          {[
            { emoji: '🎓', title: '学生', desc: '起業の悩みを気軽に投稿。先輩や先生に相談しよう。', color: 'from-brand-50 to-white' },
            { emoji: '🚀', title: 'OB・OG', desc: '創業経験を共有し、次世代の挑戦者を応援。', color: 'from-coral-50 to-white' },
            { emoji: '👨‍🏫', title: '教職員', desc: '研究シーズや補助金情報を学生に届ける。', color: 'from-mint-50 to-white' },
            { emoji: '🛡️', title: '管理者', desc: '健全なコミュニティ運営をサポート。', color: 'from-sunny-50 to-white' },
          ].map((x) => (
            <div key={x.title} className={`card-hover bg-gradient-to-br ${x.color} text-center`}>
              <div className="text-4xl mb-3 animate-float">{x.emoji}</div>
              <h3 className="font-bold text-lg text-slate-900">{x.title}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{x.desc}</p>
            </div>
          ))}
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-12">
          {[
            { emoji: '💬', title: '気軽に相談', desc: '匿名感のある掲示板で、悩みを投稿しよう' },
            { emoji: '🤝', title: '1on1チャット', desc: '先輩起業家と個別にじっくり相談' },
            { emoji: '📅', title: 'イベント＆補助金', desc: 'ピッチナイトや助成金情報をキャッチ' },
          ].map((x) => (
            <div key={x.title} className="card-hover">
              <div className="text-3xl mb-2">{x.emoji}</div>
              <h3 className="font-bold text-slate-900">{x.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{x.desc}</p>
            </div>
          ))}
        </section>

        <div className="text-center mt-20 p-8 rounded-3xl bg-gradient-hero text-white shadow-soft-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">さあ、はじめてみよう 🎉</h2>
          <p className="text-white/90 mb-6">ロールを選んで、コミュニティへ飛び込もう</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold px-8 py-3.5 rounded-full shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg active:scale-95">
            ✨ ログインへ進む
          </Link>
        </div>
      </div>
    </main>
  );
}
