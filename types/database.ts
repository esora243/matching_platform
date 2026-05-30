export type UserRole = 'student' | 'ob_og' | 'faculty' | 'admin';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ChatRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  approval_status: ApprovalStatus;
  avatar_url: string | null;
  bio: string | null;
  graduation_year: number | null;
  founding_experience: string | null;
  expertise: string[] | null;
  department: string | null;
  enrollment_year: number | null;
  accepts_chat_requests: boolean;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  author_id: string;
  title: string;
  body: string;
  tags: string[];
  is_closed: boolean;
  created_at: string;
  updated_at: string;
  author?: Profile;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  topic_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author?: Profile;
}

export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  capacity: number | null;
  created_at: string;
  organizer?: Profile;
  registrations_count?: number;
}

export interface Program {
  id: string;
  author_id: string;
  title: string;
  description: string;
  category: string | null;
  deadline: string | null;
  url: string | null;
  created_at: string;
  author?: Profile;
}

export interface ChatRequest {
  id: string;
  student_id: string;
  ob_og_id: string;
  message: string | null;
  status: ChatRequestStatus;
  created_at: string;
  responded_at: string | null;
  student?: Profile;
  ob_og?: Profile;
}

export interface ChatRoom {
  id: string;
  request_id: string;
  student_id: string;
  ob_og_id: string;
  created_at: string;
  student?: Profile;
  ob_og?: Profile;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  sender?: Profile;
}
