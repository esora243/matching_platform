'use client';
import { useState } from 'react';

export default function AdminActions({ userId: _userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [decided, setDecided] = useState<null | 'approved' | 'rejected'>(null);
  const decide = async (status: 'approved' | 'rejected') => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false); setDecided(status);
  };
  if (decided === 'approved') return <span className="badge-mint">✅ 承認しました</span>;
  if (decided === 'rejected') return <span className="badge-coral">❌ 拒否しました</span>;
  return (
    <div className="flex gap-2 shrink-0">
      <button className="btn-secondary text-xs" disabled={loading} onClick={() => decide('rejected')}>❌ 拒否</button>
      <button className="btn-mint text-xs" disabled={loading} onClick={() => decide('approved')}>{loading ? '...' : '✅ 承認する'}</button>
    </div>
  );
}
