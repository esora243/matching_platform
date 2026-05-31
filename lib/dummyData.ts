import type { Profile, Topic, Comment, Event, Program, ChatRoom, ChatRequest, ChatMessage } from '@/types/database';

const now = Date.now();
const hours = (h: number) => new Date(now - h * 3600 * 1000).toISOString();
const days  = (d: number) => new Date(now - d * 86400 * 1000).toISOString();
const future= (d: number) => new Date(now + d * 86400 * 1000).toISOString();

export const dummyMembers: Profile[] = [
  { id: 'mem-1', email: 'taro@example.jp', full_name: '起業 たろう', role: 'ob_og',
    approval_status: 'approved', avatar_url: null,
    bio: '医療AI領域でシリーズBまで経験。学生のヘルステック起業を応援しています 🚀',
    graduation_year: 2015, founding_experience: '2018年に医療AI企業を共同創業、シリーズBまでCEO',
    expertise: ['医療機器', '資金調達', '薬事申請'], department: null, enrollment_year: null,
    accepts_chat_requests: true, created_at: days(120), updated_at: days(3) },
  { id: 'mem-2', email: 'yuki@example.jp', full_name: '創業 ゆき', role: 'ob_og',
    approval_status: 'approved', avatar_url: null,
    bio: '2019年卒。在宅医療プラットフォームを創業し、現在も代表を務めています ✨',
    graduation_year: 2019, founding_experience: '在宅医療プラットフォームを共同創業、現在も代表',
    expertise: ['在宅医療', 'プロダクト開発', 'BizDev'], department: null, enrollment_year: null,
    accepts_chat_requests: true, created_at: days(90), updated_at: days(1) },
  { id: 'mem-3', email: 'kenichi@example.jp', full_name: '浜松 けんいち 先生', role: 'faculty',
    approval_status: 'approved', avatar_url: null,
    bio: '産学連携推進室。研究シーズの社会実装をお手伝いします 📚',
    graduation_year: null, founding_experience: null,
    expertise: ['産学連携', '知財', '研究シーズ'], department: '産学連携推進室',
    enrollment_year: null, accepts_chat_requests: false, created_at: days(200), updated_at: days(7) },
  { id: 'mem-4', email: 'mika@example.jp', full_name: '医療 みか 先生', role: 'faculty',
    approval_status: 'approved', avatar_url: null,
    bio: '医学部 公衆衛生学。データを使った社会課題解決をサポート 🩺',
    graduation_year: null, founding_experience: null,
    expertise: ['公衆衛生', 'ヘルスデータ', '統計'], department: '公衆衛生学講座',
    enrollment_year: null, accepts_chat_requests: false, created_at: days(180), updated_at: days(5) },
  { id: 'mem-5', email: 'pending@example.jp', full_name: '承認 まちこ', role: 'ob_og',
    approval_status: 'pending', avatar_url: null,
    bio: '昨日登録したばかりです。承認待ち中。',
    graduation_year: 2010, founding_experience: null,
    expertise: [], department: null, enrollment_year: null,
    accepts_chat_requests: true, created_at: hours(20), updated_at: hours(20) },
];

export const dummyStudents: Profile[] = [
  { id: 'std-1', email: 'hanako@example.jp', full_name: '医大 はなこ', role: 'student',
    approval_status: 'approved', avatar_url: null,
    bio: '医学部4年。ヘルステックで起業したい！',
    graduation_year: null, founding_experience: null,
    expertise: ['ヘルステック'], department: null, enrollment_year: 2022,
    accepts_chat_requests: true, created_at: days(60), updated_at: days(2) },
];

export const dummyTopics: (Topic & { author: Profile; commentCount: number })[] = [
  { id: 'topic-1', author_id: 'std-1',
    title: '医療機器の薬事承認についての相談',
    body: '新しいデバイスの開発を進めていますが、PMDAへの相談タイミングで迷っています。プロトタイプができてからが良いのか、構想段階で行くべきか、経験者の方教えてください 🙏',
    tags: ['医療機器', '薬事', 'PMDA'], is_closed: false,
    created_at: hours(3), updated_at: hours(3),
    author: dummyStudents[0], commentCount: 2 },
  { id: 'topic-2', author_id: 'std-1',
    title: 'シード期の資金調達について',
    body: 'VCからの調達か、補助金を活用するかで悩んでいます。医療系スタートアップだと公的補助金の選択肢が結構あると聞きました。',
    tags: ['資金調達', 'VC', '補助金'], is_closed: false,
    created_at: days(1), updated_at: days(1),
    author: dummyStudents[0], commentCount: 5 },
  { id: 'topic-3', author_id: 'std-1',
    title: 'チーム組成 — 共同創業者の見つけ方',
    body: '同じビジョンを持つ共同創業者をどうやって見つけましたか？医学部の中だけだとビジネス・技術側の人材が薄いと感じます。',
    tags: ['チーム', '共同創業'], is_closed: false,
    created_at: days(3), updated_at: days(3),
    author: dummyStudents[0], commentCount: 3 },
];

export const dummyComments: Record<string, (Comment & { author: Profile })[]> = {
  'topic-1': [
    { id: 'cmt-1', topic_id: 'topic-1', author_id: 'mem-1',
      body: 'プロトタイプができる前の構想段階でも、PMDAの「対面助言」は活用できます。早めに方向性をすり合わせておくと後工程が楽です ✨',
      created_at: hours(2), author: dummyMembers[0] },
    { id: 'cmt-2', topic_id: 'topic-1', author_id: 'mem-3',
      body: '産学連携推進室で薬事関連の相談窓口を紹介できます。気軽に連絡ください。',
      created_at: hours(1), author: dummyMembers[2] },
  ],
  'topic-2': [], 'topic-3': [],
};

export const dummyEvents: (Event & { organizer: Profile; registrationsCount: number; registered: boolean })[] = [
  { id: 'evt-1', organizer_id: 'mem-1',
    title: '🚀 医療スタートアップ・ピッチナイト',
    description: '在校生と先輩起業家が一堂に会するピッチイベント！1分ピッチで気軽に発表できます。観覧だけでもOK 🎉',
    starts_at: future(7), ends_at: future(7), location: 'はままつ医大 講堂',
    capacity: 50, created_at: days(5),
    organizer: dummyMembers[0], registrationsCount: 23, registered: false },
  { id: 'evt-2', organizer_id: 'mem-3',
    title: '📚 薬事承認 入門セミナー',
    description: '医療機器開発における薬事戦略の基礎をPMDA経験者がお話しします。',
    starts_at: future(14), ends_at: future(14), location: 'オンライン (Zoom)',
    capacity: 100, created_at: days(10),
    organizer: dummyMembers[2], registrationsCount: 41, registered: true },
];

export const dummyPrograms: (Program & { author: Profile })[] = [
  { id: 'prog-1', author_id: 'mem-3',
    title: '💰 大学発スタートアップ創出支援 (2026年度)',
    description: '研究シーズを基にした起業を目指すチームへ最大500万円を支援。事業計画の磨き込みからメンタリングまで。',
    category: '補助金', deadline: future(30), url: 'https://example.com/program',
    created_at: days(8), author: dummyMembers[2] },
  { id: 'prog-2', author_id: 'mem-3',
    title: '🎯 ヘルステック・アクセラレータ Batch.5',
    description: '3ヶ月集中型のアクセラレータプログラム。VC・先輩起業家からの徹底メンタリングが受けられます。',
    category: 'アクセラレータ', deadline: future(45), url: 'https://example.com/accelerator',
    created_at: days(12), author: dummyMembers[2] },
  { id: 'prog-3', author_id: 'mem-4',
    title: '🧪 学内共同研究マッチング',
    description: '社会実装を目指す研究室と企業をつなぐマッチングプログラム。',
    category: 'メンタリング', deadline: null, url: null,
    created_at: days(20), author: dummyMembers[3] },
];

export const dummyChatRooms: (ChatRoom & { student: Profile; ob_og: Profile; lastMessage?: string })[] = [
  { id: 'room-1', request_id: 'req-1', student_id: 'std-1', ob_og_id: 'mem-1',
    created_at: days(2), student: dummyStudents[0], ob_og: dummyMembers[0],
    lastMessage: 'ありがとうございます！次回のミーティングで詳しく伺いたいです 😊' },
  { id: 'room-2', request_id: 'req-2', student_id: 'std-1', ob_og_id: 'mem-2',
    created_at: days(5), student: dummyStudents[0], ob_og: dummyMembers[1],
    lastMessage: 'プロダクトのフィードバック、すごく参考になりました ✨' },
];

export const dummyChatRequests: (ChatRequest & { student: Profile })[] = [
  { id: 'req-3', student_id: 'std-1', ob_og_id: 'mem-1',
    message: 'はじめまして！医療AIで起業を考えている学生です。15分ほどお話を伺えませんか？',
    status: 'pending', created_at: hours(8), responded_at: null,
    student: dummyStudents[0] },
];

export const dummyChatMessages: Record<string, (ChatMessage & { sender: Profile })[]> = {
  'room-1': [
    { id: 'msg-1', room_id: 'room-1', sender_id: 'std-1',
      body: 'こんにちは！本日はお時間いただきありがとうございます 🙏',
      created_at: days(2), sender: dummyStudents[0] },
    { id: 'msg-2', room_id: 'room-1', sender_id: 'mem-1',
      body: 'こちらこそ。気軽になんでも聞いてください！',
      created_at: days(2), sender: dummyMembers[0] },
    { id: 'msg-3', room_id: 'room-1', sender_id: 'std-1',
      body: 'ありがとうございます！次回のミーティングで詳しく伺いたいです 😊',
      created_at: hours(4), sender: dummyStudents[0] },
  ],
  'room-2': [
    { id: 'msg-4', room_id: 'room-2', sender_id: 'mem-2',
      body: 'プロダクトのモックアップ拝見しました！UI/UX面でいくつかフィードバックを ✨',
      created_at: days(5), sender: dummyMembers[1] },
    { id: 'msg-5', room_id: 'room-2', sender_id: 'std-1',
      body: 'プロダクトのフィードバック、すごく参考になりました ✨',
      created_at: days(4), sender: dummyStudents[0] },
  ],
};

export function getTopicById(id: string) { return dummyTopics.find((t) => t.id === id); }
export function getCommentsByTopicId(id: string) { return dummyComments[id] ?? []; }
export function getRoomById(id: string) { return dummyChatRooms.find((r) => r.id === id); }
export function getMessagesByRoomId(id: string) { return dummyChatMessages[id] ?? []; }
export function getProfileById(id: string) {
  return [...dummyMembers, ...dummyStudents].find((m) => m.id === id);
}
