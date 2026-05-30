import { createClient } from '@/lib/supabase/server';
import { requireAuth, ROLE_LABEL } from '@/lib/auth';
import { notFound } from 'next/navigation';
import ChatRequestButton from './ChatRequestButton';

export const dynamic = 'force-dynamic';

export default async function ProfileDetail({ params }: { params: { id: string } }) {
  const me = await requireAuth();
  const supabase = createClient();
  const { data: p } = await supabase.from('profiles').select('*').eq('id', params.id).single();
  if (!p) notFound();

  // 学生→OB/OG への申請可否
  const canRequestChat =
    me.role === 'student' && p.role === 'ob_og' && p.accepts_chat_requests;

  // 既存リクエスト確認
  let existingRequest = null;
  if (canRequestChat) {
    const { data } = await supabase
      .from('chat_requests')
      .select('*')
      .eq('student_id', me.id)
      .eq('ob_og_id', p.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    existingRequest = data;
  }

  return (
    <div className="max-w-2xl mx-auto card">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{p.full_name}</h1>
          <span className="badge bg-brand-50 text-brand-700 mt-1">
            {ROLE_LABEL[p.role as keyof typeof ROLE_LABEL]}
          </span>
        </div>
        {canRequestChat && (
          <ChatRequestButton obOgId={p.id} existing={existingRequest} />
        )}
      </div>
      {p.role === 'ob_og' && p.graduation_year && (
        <p className="text-sm text-slate-500 mt-2">{p.graduation_year} 年卒</p>
      )}
      {p.role === 'faculty' && p.department && (
        <p className="text-sm text-slate-500 mt-2">{p.department}</p>
      )}
      {p.bio && (
        <section className="mt-4">
          <h3 className="font-semibold text-sm text-slate-600">自己紹介</h3>
          <p className="mt-1 whitespace-pre-wrap">{p.bio}</p>
        </section>
      )}
      {p.founding_experience && (
        <section className="mt-4">
          <h3 className="font-semibold text-sm text-slate-600">創業経験</h3>
          <p className="mt-1 whitespace-pre-wrap">{p.founding_experience}</p>
        </section>
      )}
      {p.expertise && p.expertise.length > 0 && (
        <section className="mt-4">
          <h3 className="font-semibold text-sm text-slate-600">得意領域</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {p.expertise.map((tag: string) => (
              <span key={tag} className="badge bg-slate-100 text-slate-700">{tag}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
