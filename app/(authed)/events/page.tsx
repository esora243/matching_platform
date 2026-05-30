import { createClient } from '@/lib/supabase/server';
import { requireAuth, ROLE_LABEL } from '@/lib/auth';
import Link from 'next/link';
import { format } from 'date-fns';
import RegisterButton from './RegisterButton';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const me = await requireAuth();
  const supabase = createClient();

  const { data: events } = await supabase
    .from('events')
    .select('*, organizer:profiles!events_organizer_id_fkey(full_name, role), event_registrations(user_id)')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true });

  const canOrganize = (me.role === 'ob_og' || me.role === 'faculty') && me.approval_status === 'approved';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">イベント</h1>
        {canOrganize && <Link href="/events/new" className="btn-primary">＋ イベント登録</Link>}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {(events ?? []).map((ev: any) => {
          const registered = ev.event_registrations.some((r: any) => r.user_id === me.id);
          return (
            <div key={ev.id} className="card">
              <h2 className="font-semibold text-lg">{ev.title}</h2>
              <div className="text-xs text-slate-500 mt-1">
                {format(new Date(ev.starts_at), 'yyyy/MM/dd HH:mm')}
                {ev.location && ` · ${ev.location}`}
              </div>
              {ev.description && (
                <p className="text-sm text-slate-700 mt-2 line-clamp-3">{ev.description}</p>
              )}
              <div className="text-xs text-slate-500 mt-2">
                主催: {ev.organizer?.full_name}（{ROLE_LABEL[ev.organizer?.role as keyof typeof ROLE_LABEL]}）·
                参加: {ev.event_registrations.length}{ev.capacity ? ` / ${ev.capacity}` : ''}
              </div>
              <div className="mt-3">
                <RegisterButton eventId={ev.id} registered={registered} />
              </div>
            </div>
          );
        })}
        {(!events || events.length === 0) && (
          <p className="text-center text-slate-500 col-span-2 py-8">予定されているイベントはありません</p>
        )}
      </div>
    </div>
  );
}
