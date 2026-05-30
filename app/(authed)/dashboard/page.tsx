import { requireAuth, ROLE_LABEL } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function Dashboard() {
  const profile = await requireAuth();
  const supabase = createClient();

  const [{ count: topicCount }, { count: eventCount }, { count: programCount }] = await Promise.all([
    supabase.from('topics').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('programs').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">こんにちは、{profile.full_name} さん</h1>
        <p className="text-sm text-slate-500">権限: {ROLE_LABEL[profile.role]}</p>
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        <StatCard label="掲示板トピック" value={topicCount ?? 0} href="/board" />
        <StatCard label="イベント" value={eventCount ?? 0} href="/events" />
        <StatCard label="支援プログラム" value={programCount ?? 0} href="/programs" />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        {profile.role === 'student' && (
          <ActionCard
            title="先輩に相談する"
            desc="起業の悩みを掲示板に投稿、または OB・OG に個別チャットを申請"
            href="/board/new"
            label="相談を投稿"
          />
        )}
        {(profile.role === 'ob_og' || profile.role === 'faculty') && (
          <ActionCard
            title="後輩に回答する"
            desc="投稿された相談に回答を投稿しましょう"
            href="/board"
            label="掲示板を見る"
          />
        )}
        {profile.role === 'ob_og' && (
          <ActionCard
            title="個別チャット申請"
            desc="学生からの相談申請を確認・承諾できます"
            href="/chat"
            label="申請を確認"
          />
        )}
        {profile.role === 'faculty' && (
          <ActionCard
            title="支援プログラム登録"
            desc="補助金やアクセラレータ情報を公開"
            href="/programs/new"
            label="プログラム登録"
          />
        )}
        {profile.role === 'admin' && (
          <ActionCard
            title="OB/OG 承認"
            desc="承認待ちの OB・OG アカウントを確認"
            href="/admin"
            label="管理画面"
          />
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="card hover:shadow-md transition">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-3xl font-bold text-brand-700 mt-1">{value}</div>
    </Link>
  );
}

function ActionCard({ title, desc, href, label }: { title: string; desc: string; href: string; label: string }) {
  return (
    <div className="card">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-slate-600 mt-1 mb-3">{desc}</p>
      <Link href={href} className="btn-primary">{label}</Link>
    </div>
  );
}
