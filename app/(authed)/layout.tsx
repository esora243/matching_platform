import { requireAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAuth();

  // OB/OG 承認待ち画面
  if (profile.role === 'ob_og' && profile.approval_status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">アカウント承認待ち</h2>
          <p className="text-sm text-slate-600">
            OB・OGとしての登録は、管理者の承認をお待ちください。<br />
            通常 1〜3 営業日以内に確認します。
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar profile={profile} />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </>
  );
}
