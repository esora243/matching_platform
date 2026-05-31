import { requireAuth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import ChatRoom from './ChatRoom';
import { getRoomById, getMessagesByRoomId } from '@/lib/dummyData';

export default async function ChatRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const me = await requireAuth();
  const room = getRoomById(roomId);
  if (!room) notFound();
  const messages = getMessagesByRoomId(roomId);
  const other = me.role === 'ob_og' ? room.student : room.ob_og;
  return (<ChatRoom roomId={roomId} meId={me.id} otherName={other?.full_name ?? '相手'} otherRole={other?.role ?? 'student'} initialMessages={messages} />);
}
