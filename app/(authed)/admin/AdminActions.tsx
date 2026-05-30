'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminActions({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const decide = async (status: 'approved' | 'rejected') => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ approval_status: status })
      .eq('id', userId);
    setLoading(false);
    if (error) return alert(error.message);
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      <button className="btn-primary text-xs" disabled={loading} onClick={() => decide('approved')}>承認</button>
      <button className="btn-danger text-xs" disabled={loading} onClick={() => decide('rejected')}>拒否</button>
    </div>
  );
}
