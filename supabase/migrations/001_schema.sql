-- =====================================================
-- 浜松医科大学 起業支援プラットフォーム DB スキーマ
-- =====================================================

-- ロール定義
CREATE TYPE user_role AS ENUM ('student', 'ob_og', 'faculty', 'admin');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE chat_request_status AS ENUM ('pending', 'accepted', 'rejected');

-- ============ profiles ============
-- auth.users を拡張するプロフィール
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  -- OB/OG 承認制
  approval_status approval_status NOT NULL DEFAULT 'approved',
  -- 共通プロフィール
  avatar_url TEXT,
  bio TEXT,
  -- OB/OG 用
  graduation_year INT,
  founding_experience TEXT,         -- 創業経験
  expertise TEXT[],                 -- 得意領域（タグ）
  -- 教職員用
  department TEXT,
  -- 学生用
  enrollment_year INT,
  -- チャット受付（OB/OG）
  accepts_chat_requests BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_approval ON profiles(approval_status);

-- ============ topics（起業相談トピック）============
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_closed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_topics_author ON topics(author_id);
CREATE INDEX idx_topics_created ON topics(created_at DESC);

-- ============ comments（公開回答）============
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_comments_topic ON comments(topic_id);

-- ============ events（イベント）============
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  location TEXT,
  capacity INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_events_starts ON events(starts_at);

-- ============ event_registrations（参加申込）============
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

-- ============ programs（支援プログラム・補助金）============
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,                   -- 補助金 / アクセラレータ / メンタリング 等
  deadline DATE,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_programs_deadline ON programs(deadline);

-- ============ chat_requests（個別チャット相談申請）============
CREATE TABLE chat_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ob_og_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT,                    -- 申請時の挨拶
  status chat_request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ
);
CREATE INDEX idx_chat_req_obog ON chat_requests(ob_og_id, status);
CREATE INDEX idx_chat_req_student ON chat_requests(student_id, status);

-- ============ chat_rooms（承諾後に作成）============
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL UNIQUE REFERENCES chat_requests(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ob_og_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ chat_messages ============
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_chat_msg_room ON chat_messages(room_id, created_at);

-- ============ 新規ユーザ作成時に profiles を自動生成 ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, approval_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
    -- OB/OG のみ承認待ち、他は自動承認
    CASE WHEN (NEW.raw_user_meta_data->>'role') = 'ob_og' THEN 'pending'::approval_status
         ELSE 'approved'::approval_status END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ 承諾時に自動で chat_room を作成 ============
CREATE OR REPLACE FUNCTION public.handle_chat_request_accept()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    INSERT INTO chat_rooms (request_id, student_id, ob_og_id)
    VALUES (NEW.id, NEW.student_id, NEW.ob_og_id);
    NEW.responded_at := now();
  ELSIF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
    NEW.responded_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_chat_request_status_change
  BEFORE UPDATE ON chat_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_chat_request_accept();
