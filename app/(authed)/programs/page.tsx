import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import Link from 'next/link';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function ProgramsPage() {
  const me = await requireAuth();
  const supabase = createClient();
  const { data: programs } = await supabase
    .from('programs')
    .select('*, author:profiles!programs_author_id_fkey(full_name)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">起業家支援プログラム・補助金</h1>
        {me.role === 'faculty' && (
          <Link href="/programs/new" className="btn-primary">＋ プログラム登録</Link>
        )}
      </div>
      <div className="space-y-3">
        {(programs ?? []).map((p: any) => (
          <div key={p.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold">{p.title}</h2>
                {p.category && <span className="badge bg-brand-50 text-brand-700 mt-1">{p.category}</span>}
                <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{p.description}</p>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-brand-600 hover:underline mt-2 inline-block">
                    詳細を見る →
                  </a>
                )}
              </div>
              <div className="text-xs text-slate-500 text-right shrink-0 ml-4">
                {p.deadline && <div>締切: {format(new Date(p.deadline), 'yyyy/MM/dd')}</div>}
                <div>登録: {p.author?.full_name}</div>
              </div>
            </div>
          </div>
        ))}
        {(!programs || programs.length === 0) && (
          <p className="text-center text-slate-500 py-8">登録されたプログラムはありません</p>
        )}
      </div>
    </div>
  );
}
