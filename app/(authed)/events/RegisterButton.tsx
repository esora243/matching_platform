'use client';
import { useState } from 'react';

export default function RegisterButton({ eventId: _eventId, registered: initialRegistered }: { eventId: string; registered: boolean }) {
  const [registered, setRegistered] = useState(initialRegistered);
  const [loading, setLoading] = useState(false);
  const toggle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setRegistered(!registered);
    setLoading(false);
  };
  if (registered) return (<button onClick={toggle} disabled={loading} className="btn-secondary text-xs" title="参加をキャンセル">{loading ? '...' : '✅ 参加中'}</button>);
  return (<button onClick={toggle} disabled={loading} className="btn-mint text-xs">{loading ? '...' : '🙋 参加する'}</button>);
}
