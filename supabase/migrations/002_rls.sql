-- =====================================================
-- Row Level Security (RLS) ポリシー
-- 役割別の権限を行レベルで強制
-- =====================================================

-- ヘルパー: 現在ユーザのロール
CREATE OR REPLACE FUNCTION public.current_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_approved()
RETURNS BOOLEAN AS $$
  SELECT approval_status = 'approved' FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =========== profiles ===========
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all" ON profiles
  FOR SELECT USING (true);  -- 一覧は全員閲覧可（承認制でフィルタはアプリ側）

CREATE POLICY "profiles_update_self" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));
  -- ロール変更は自分ではできない（管理者のみ）

CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (current_role() = 'admin');

-- =========== topics（学生のみ作成可）===========
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "topics_select_all" ON topics
  FOR SELECT USING (true);

CREATE POLICY "topics_insert_student" ON topics
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND current_role() = 'student'
  );

CREATE POLICY "topics_update_owner" ON topics
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "topics_admin_all" ON topics
  FOR ALL USING (current_role() = 'admin');

-- =========== comments（OB/OG・教職員のみ投稿可）===========
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_select_all" ON comments
  FOR SELECT USING (true);

CREATE POLICY "comments_insert_obog_faculty" ON comments
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND current_role() IN ('ob_og', 'faculty')
    AND is_approved()
  );

CREATE POLICY "comments_update_owner" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "comments_admin_all" ON comments
  FOR ALL USING (current_role() = 'admin');

-- =========== events（OB/OG・教職員が主催）===========
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select_all" ON events FOR SELECT USING (true);

CREATE POLICY "events_insert_obog_faculty" ON events
  FOR INSERT WITH CHECK (
    auth.uid() = organizer_id
    AND current_role() IN ('ob_og', 'faculty')
    AND is_approved()
  );

CREATE POLICY "events_update_owner" ON events
  FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "events_admin_all" ON events
  FOR ALL USING (current_role() = 'admin');

-- =========== event_registrations ===========
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_reg_select_self_or_organizer" ON event_registrations
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM events e WHERE e.id = event_id AND e.organizer_id = auth.uid())
    OR current_role() = 'admin'
  );

CREATE POLICY "event_reg_insert_self" ON event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "event_reg_delete_self" ON event_registrations
  FOR DELETE USING (auth.uid() = user_id);

-- =========== programs（教職員のみ登録）===========
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "programs_select_all" ON programs FOR SELECT USING (true);

CREATE POLICY "programs_insert_faculty" ON programs
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND current_role() = 'faculty'
  );

CREATE POLICY "programs_update_owner" ON programs
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "programs_admin_all" ON programs
  FOR ALL USING (current_role() = 'admin');

-- =========== chat_requests（学生→OB/OG）===========
ALTER TABLE chat_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_req_select_parties" ON chat_requests
  FOR SELECT USING (
    auth.uid() IN (student_id, ob_og_id) OR current_role() = 'admin'
  );

CREATE POLICY "chat_req_insert_student" ON chat_requests
  FOR INSERT WITH CHECK (
    auth.uid() = student_id AND current_role() = 'student'
  );

-- OB/OG のみ承諾・拒否を更新可
CREATE POLICY "chat_req_update_obog" ON chat_requests
  FOR UPDATE USING (
    auth.uid() = ob_og_id AND current_role() = 'ob_og'
  );

-- =========== chat_rooms ===========
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_room_select_parties" ON chat_rooms
  FOR SELECT USING (
    auth.uid() IN (student_id, ob_og_id) OR current_role() = 'admin'
  );

-- chat_rooms は trigger からの SECURITY DEFINER 関数で挿入されるので INSERT ポリシーは不要

-- =========== chat_messages ===========
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_msg_select_member" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_rooms r
      WHERE r.id = room_id AND auth.uid() IN (r.student_id, r.ob_og_id)
    )
    OR current_role() = 'admin'
  );

CREATE POLICY "chat_msg_insert_member" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM chat_rooms r
      WHERE r.id = room_id AND auth.uid() IN (r.student_id, r.ob_og_id)
    )
  );
