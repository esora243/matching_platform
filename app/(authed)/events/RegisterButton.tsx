'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function RegisterButton({ eventId, registered }: { eventId: string; registered: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (registered) {
      await supabase.from('event_registrations').delete().eq('event_id', eventId).eq('user_id', user.id);
    } else {
      await supabase.from('event_registrations').insert({ event_id: eventId, user_id: user.id });
    }
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={registered ? 'btn-secondary text-xs' : 'btn-primary text-xs'}
    >
      {loading ? '...' : registered ? 'キャンセル' : '参加申込'}
    </button>
  );
}
