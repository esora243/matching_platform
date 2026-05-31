import { requireAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAuth();
  if (profile.role === 'ob_og' && profile.approval_status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card-pop max-w-md text-center">
          <div className="text-5xl mb-4 animate-float">⏳</div>
          <h2 className="text-xl font-bold mb-2">承認をお待ちください</h2>
          <p className="text-sm text-slate-600 leading-relaxed">OB・OGとしての登録は、管理者の承認後にご利用いただけます。<br />通常 1〜3 営業日以内に確認します ✨</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <Navbar profile={profile} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 animate-fade-in">{children}</main>
      <footer className="max-w-7xl mx-auto px-6 py-8 text-center text-xs text-slate-400">🚀 はままつ医大スタートアップ・ハブ (プロトタイプ版)</footer>
    </div>
  );
}
