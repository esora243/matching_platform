import { requireAuth } from '@/lib/auth';
import { ROLE_LABEL, ROLE_EMOJI } from '@/lib/roles';
import Link from 'next/link';
import { format } from 'date-fns';
import RegisterButton from './RegisterButton';
import { dummyEvents } from '@/lib/dummyData';

export default async function EventsPage() {
  const me = await requireAuth();
  const canOrganize = (me.role === 'ob_og' || me.role === 'faculty') && me.approval_status === 'approved';
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title"><span>📅</span> イベント</h1>
          <p className="section-subtitle">ピッチナイトやセミナーで、仲間とつながろう ✨</p>
        </div>
        {canOrganize && (<Link href="/events/new" className="btn-mint">📅 新しいイベントを企画する</Link>)}
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {dummyEvents.map((ev) => (
          <div key={ev.id} className="card-hover">
            <h2 className="font-bold text-lg text-slate-900">{ev.title}</h2>
            <div className="flex flex-wrap gap-2 items-center text-xs text-slate-500 mt-2">
              <span className="badge-brand">🗓️ {format(new Date(ev.starts_at), 'yyyy/MM/dd HH:mm')}</span>
              {ev.location && <span className="badge-slate">📍 {ev.location}</span>}
            </div>
            {ev.description && (<p className="text-sm text-slate-700 mt-3 line-clamp-3 leading-relaxed">{ev.description}</p>)}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                <div className="font-semibold text-slate-700 inline-flex items-center gap-1">{ROLE_EMOJI[ev.organizer.role]} {ev.organizer.full_name}</div>
                <div className="mt-0.5">👥 {ev.registrationsCount}{ev.capacity ? ` / ${ev.capacity}` : ''} 名</div>
              </div>
              <RegisterButton eventId={ev.id} registered={ev.registered} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
