'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
  sender?: { full_name: string };
}

export default function ChatRoom({
  roomId,
  meId,
  otherName,
  initialMessages,
}: {
  roomId: string;
  meId: string;
  otherName: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${roomId}` },
        async (payload) => {
          const m = payload.new as Message;
          // 既に楽観追加済なら無視
          setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    const { error } = await supabase
      .from('chat_messages')
      .insert({ room_id: roomId, sender_id: meId, body });
    setSending(false);
    if (error) return alert(error.message);
    setBody('');
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="card mb-3">
        <h1 className="font-semibold">{otherName} さんとのチャット</h1>
      </div>
      <div className="flex-1 overflow-y-auto card space-y-3">
        {messages.map((m) => {
          const mine = m.sender_id === meId;
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                mine ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-800'
              }`}>
                <p className="whitespace-pre-wrap text-sm">{m.body}</p>
                <div className={`text-[10px] mt-1 ${mine ? 'text-brand-100' : 'text-slate-500'}`}>
                  {format(new Date(m.created_at), 'HH:mm')}
                </div>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-8">最初のメッセージを送りましょう</p>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input
          className="input flex-1"
          placeholder="メッセージを入力…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button className="btn-primary" disabled={sending || !body.trim()}>送信</button>
      </form>
    </div>
  );
}
