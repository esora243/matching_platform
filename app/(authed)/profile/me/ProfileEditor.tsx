'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';
import { useRouter } from 'next/navigation';

export default function ProfileEditor({ profile }: { profile: Profile }) {
  const [bio, setBio] = useState(profile.bio ?? '');
  const [foundingExp, setFoundingExp] = useState(profile.founding_experience ?? '');
  const [expertise, setExpertise] = useState((profile.expertise ?? []).join(', '));
  const [graduationYear, setGraduationYear] = useState(profile.graduation_year ?? '');
  const [department, setDepartment] = useState(profile.department ?? '');
  const [acceptsChat, setAcceptsChat] = useState(profile.accepts_chat_requests);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const supabase = createClient();
    const updates: any = {
      bio: bio || null,
      updated_at: new Date().toISOString(),
    };
    if (profile.role === 'ob_og') {
      updates.founding_experience = foundingExp || null;
      updates.expertise = expertise.split(',').map((s) => s.trim()).filter(Boolean);
      updates.graduation_year = graduationYear ? Number(graduationYear) : null;
      updates.accepts_chat_requests = acceptsChat;
    }
    if (profile.role === 'faculty') updates.department = department || null;
    const { error } = await supabase.from('profiles').update(updates).eq('id', profile.id);
    setLoading(false);
    if (error) return setMsg('保存に失敗しました: ' + error.message);
    setMsg('保存しました');
    router.refresh();
  };

  return (
    <form onSubmit={save} className="card space-y-4">
      <div>
        <div className="label">氏名</div>
        <div className="text-slate-700">{profile.full_name}</div>
      </div>
      <div>
        <label className="label">自己紹介</label>
        <textarea className="input min-h-[80px]" value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      {profile.role === 'ob_og' && (
        <>
          <div>
            <label className="label">卒業年</label>
            <input className="input" type="number" value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)} />
          </div>
          <div>
            <label className="label">創業経験</label>
            <textarea className="input min-h-[80px]" value={foundingExp}
              onChange={(e) => setFoundingExp(e.target.value)}
              placeholder="例: 2018 年に医療AI企業を共同創業、シリーズBまでCEO" />
          </div>
          <div>
            <label className="label">得意領域（カンマ区切り）</label>
            <input className="input" value={expertise} onChange={(e) => setExpertise(e.target.value)}
              placeholder="医療機器, 資金調達, 薬事申請" />
          </div>
          <div className="flex items-center gap-2">
            <input id="accepts" type="checkbox" checked={acceptsChat}
              onChange={(e) => setAcceptsChat(e.target.checked)} />
            <label htmlFor="accepts" className="text-sm">学生からの個別チャット相談を受け付ける</label>
          </div>
        </>
      )}

      {profile.role === 'faculty' && (
        <div>
          <label className="label">所属（学部・部署）</label>
          <input className="input" value={department} onChange={(e) => setDepartment(e.target.value)} />
        </div>
      )}

      {msg && <p className="text-sm text-brand-700">{msg}</p>}
      <button className="btn-primary" disabled={loading}>{loading ? '保存中…' : '保存'}</button>
    </form>
  );
}
