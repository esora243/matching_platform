import { requireRole } from '@/lib/auth';
import { ROLE_LABEL, ROLE_EMOJI } from '@/lib/roles';
import AdminActions from './AdminActions';
import { dummyMembers, dummyStudents } from '@/lib/dummyData';

export default async function AdminPage() {
  await requireRole(['admin']);
  const pending = dummyMembers.filter((m) => m.role === 'ob_og' && m.approval_status === 'pending');
  const allUsers = [...dummyMembers, ...dummyStudents].slice(0, 50);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title"><span>🛡️</span> 管理者ダッシュボード</h1>
        <p className="section-subtitle">コミュニティを健やかに保つための運営機能 ✨</p>
      </div>
      <section>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3"><span>⏳</span> OB・OG 承認待ち {pending.length > 0 && <span className="badge-coral">{pending.length} 件</span>}</h2>
        <div className="space-y-3">
          {pending.map((u) => (
            <div key={u.id} className="card-pop bg-gradient-to-br from-sunny-50 to-white border-sunny-100">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-coral flex items-center justify-center text-white font-bold">{u.full_name.charAt(0)}</div>
                  <div>
                    <div className="font-bold text-slate-900">{u.full_name}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                    {u.graduation_year && (<div className="text-xs text-slate-400 mt-0.5">🎓 {u.graduation_year} 年卒</div>)}
                  </div>
                </div>
                <AdminActions userId={u.id} />
              </div>
            </div>
          ))}
          {pending.length === 0 && (<div className="card text-center py-8"><div className="text-4xl mb-2">🎉</div><p className="text-sm text-slate-500">承認待ちはありません！</p></div>)}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3"><span>👥</span> 全ユーザー（最新50件）</h2>
        <div className="card-pop overflow-x-auto !p-0">
          <table className="w-full text-sm">
            <thead className="text-left bg-slate-50"><tr><th className="py-3 px-4 font-semibold text-slate-600">氏名</th><th className="py-3 px-4 font-semibold text-slate-600">メール</th><th className="py-3 px-4 font-semibold text-slate-600">ロール</th><th className="py-3 px-4 font-semibold text-slate-600">状態</th></tr></thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900">{u.full_name}</td>
                  <td className="py-3 px-4 text-slate-600">{u.email}</td>
                  <td className="py-3 px-4"><span className="badge-slate">{ROLE_EMOJI[u.role]} {ROLE_LABEL[u.role]}</span></td>
                  <td className="py-3 px-4">
                    <span className={u.approval_status === 'approved' ? 'badge-mint' : u.approval_status === 'pending' ? 'badge-sunny' : 'badge-coral'}>
                      {u.approval_status === 'approved' ? '✅ 承認済み' : u.approval_status === 'pending' ? '⏳ 待機中' : '❌ 拒否'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
