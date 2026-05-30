'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function RequestActions({ requestId }: { requestId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const respond = async (status: 'accepted' | 'rejected') => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('chat_requests')
      .update({ status })
      .eq('id', requestId);
    setLoading(false);
    if (error) return alert(error.message);
    router.refresh();
  };

  return (
    <div className="flex gap-2 shrink-0">
      <button className="btn-primary text-xs" disabled={loading} onClick={() => respond('accepted')}>承諾</button>
      <button className="btn-secondary text-xs" disabled={loading} onClick={() => respond('rejected')}>拒否</button>
    </div>
  );
}
