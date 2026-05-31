'use client';
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { ROLE_EMOJI, ROLE_LABEL } from '@/lib/roles';
import type { UserRole } from '@/types/database';

interface Message { id: string; sender_id: string; body: string; created_at: string; sender?: { full_name: string }; }

export default function ChatRoom({ roomId: _roomId, meId, otherName, otherRole, initialMessages }: { roomId: string; meId: string; otherName: string; otherRole: UserRole; initialMessages: Message[]; }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 200));
    setMessages((prev) => [...prev, { id: `local-${Date.now()}`, sender_id: meId, body, created_at: new Date().toISOString() }]);
    setBody(''); setSending(false);
  };
  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
      <Link href="/chat" className="inline-flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors mb-3">← チャット一覧へ</Link>
      <div className="card mb-3 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-hero flex items-center justify-center text-white font-bold">{otherName.charAt(0)}</div>
        <div className="flex-1">
          <h1 className="font-bold text-slate-900">{otherName} さん</h1>
          <div className="text-xs text-slate-500">{ROLE_EMOJI[otherRole]} {ROLE_LABEL[otherRole]}</div>
        </div>
        <span className="badge-mint">🟢 オンライン</span>
      </div>
      <div className="flex-1 overflow-y-auto card !p-4 space-y-3">
        {messages.map((m) => {
          const mine = m.sender_id === meId;
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              {!mine && (<div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold mr-2 shrink-0">{otherName.charAt(0)}</div>)}
              <div className={`max-w-[75%] rounded-3xl px-4 py-2.5 ${mine ? 'bg-gradient-hero text-white rounded-br-md shadow-soft' : 'bg-slate-100 text-slate-800 rounded-bl-md'}`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.body}</p>
                <div className={`text-[10px] mt-1 ${mine ? 'text-white/70' : 'text-slate-500'}`}>{format(new Date(m.created_at), 'HH:mm')}</div>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (<div className="text-center py-12"><div className="text-4xl mb-2">👋</div><p className="text-sm text-slate-500">最初のメッセージを送ってみましょう</p></div>)}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input className="input flex-1" placeholder="メッセージを入力… ✍️" value={body} onChange={(e) => setBody(e.target.value)} />
        <button className="btn-primary" disabled={sending || !body.trim()}>{sending ? '...' : '🚀 送信'}</button>
      </form>
    </div>
  );
}
