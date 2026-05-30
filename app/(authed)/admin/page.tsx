import { requireRole, ROLE_LABEL } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import AdminActions from './AdminActions';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await requireRole(['admin']);
  const supabase = createClient();

  const { data: pending } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'ob_og')
    .eq('approval_status', 'pending')
    .order('created_at', { ascending: false });

  const { data: allUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-2">OB・OG 承認待ち（{pending?.length ?? 0}）</h1>
        <div className="space-y-2">
          {(pending ?? []).map((u: any) => (
            <div key={u.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{u.full_name}</div>
                <div className="text-xs text-slate-500">{u.email}</div>
              </div>
              <AdminActions userId={u.id} />
            </div>
          ))}
          {(!pending || pending.length === 0) && (
            <p className="text-sm text-slate-500">承認待ちはありません</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">全ユーザー（最新50件）</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2">氏名</th><th>メール</th><th>権限</th><th>状態</th>
              </tr>
            </thead>
            <tbody>
              {(allUsers ?? []).map((u: any) => (
                <tr key={u.id} className="border-t">
                  <td className="py-2">{u.full_name}</td>
                  <td className="text-slate-600">{u.email}</td>
                  <td>
                    <span className="badge bg-slate-100 text-slate-700">
                      {ROLE_LABEL[u.role as keyof typeof ROLE_LABEL]}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      u.approval_status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                      u.approval_status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {u.approval_status}
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
