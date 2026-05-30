import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import ChatRoom from './ChatRoom';

export const dynamic = 'force-dynamic';

export default async function ChatRoomPage({ params }: { params: { roomId: string } }) {
  const me = await requireAuth();
  const supabase = createClient();

  const { data: room } = await supabase
    .from('chat_rooms')
    .select('*, student:profiles!chat_rooms_student_id_fkey(full_name), ob_og:profiles!chat_rooms_ob_og_id_fkey(full_name)')
    .eq('id', params.roomId)
    .single();
  if (!room) notFound();
  if (room.student_id !== me.id && room.ob_og_id !== me.id) notFound();

  const { data: initialMessages } = await supabase
    .from('chat_messages')
    .select('*, sender:profiles!chat_messages_sender_id_fkey(full_name)')
    .eq('room_id', params.roomId)
    .order('created_at', { ascending: true });

  const other = room.student_id === me.id ? room.ob_og : room.student;

  return (
    <ChatRoom
      roomId={params.roomId}
      meId={me.id}
      otherName={other?.full_name ?? ''}
      initialMessages={initialMessages ?? []}
    />
  );
}
