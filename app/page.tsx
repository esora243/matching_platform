import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-brand-900 mb-4">
          浜松医科大学 起業支援プラットフォーム
        </h1>
        <p className="text-lg text-slate-600 mb-10">
          医学を志す学生と、起業経験のある先輩・教職員を繋ぎ、<br />
          医療スタートアップの第一歩を支援します。
        </p>
        <div className="flex gap-4">
          <Link href="/signup" className="btn-primary">新規登録</Link>
          <Link href="/login" className="btn-secondary">ログイン</Link>
        </div>

        <section className="grid md:grid-cols-4 gap-4 mt-16">
          {[
            { t: '学生', d: '起業相談を投稿、先輩に相談' },
            { t: 'OB・OG', d: '後輩を支援、経験を共有' },
            { t: '教職員', d: '支援プログラムを発信' },
            { t: '管理者', d: '健全なコミュニティ運営' },
          ].map((x) => (
            <div key={x.t} className="card">
              <h3 className="font-semibold text-brand-700">{x.t}</h3>
              <p className="text-sm text-slate-600 mt-1">{x.d}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
