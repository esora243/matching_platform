'use client';
import { useState } from 'react';

export default function RequestActions({ requestId: _requestId }: { requestId: string }) {
  const [loading, setLoading] = useState(false);
  const [decided, setDecided] = useState<null | 'accepted' | 'rejected'>(null);
  const respond = async (status: 'accepted' | 'rejected') => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false); setDecided(status);
  };
  if (decided === 'accepted') return <span className="badge-mint">✅ 承諾しました</span>;
  if (decided === 'rejected') return <span className="badge-slate">❌ お断りしました</span>;
  return (
    <div className="flex gap-2 shrink-0">
      <button className="btn-secondary text-xs" disabled={loading} onClick={() => respond('rejected')}>❌ お断り</button>
      <button className="btn-mint text-xs" disabled={loading} onClick={() => respond('accepted')}>{loading ? '...' : '💚 承諾する'}</button>
    </div>
  );
}
