'use client';
import { useState } from 'react';
import type { Profile } from '@/types/database';

export default function ProfileEditor({ profile }: { profile: Profile }) {
  const [bio, setBio] = useState(profile.bio ?? '');
  const [foundingExp, setFoundingExp] = useState(profile.founding_experience ?? '');
  const [expertise, setExpertise] = useState((profile.expertise ?? []).join(', '));
  const [graduationYear, setGraduationYear] = useState(profile.graduation_year ?? '');
  const [department, setDepartment] = useState(profile.department ?? '');
  const [acceptsChat, setAcceptsChat] = useState(profile.accepts_chat_requests);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMsg(null);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setMsg('🎉 保存しました！（プロトタイプではダミー動作です）');
  };
  return (
    <form onSubmit={save} className="space-y-5">
      <div><label className="label">💬 自己紹介</label><textarea className="input min-h-[100px]" placeholder="あなたの興味・関心や、今取り組んでいることなど…" value={bio} onChange={(e) => setBio(e.target.value)} /></div>
      {profile.role === 'ob_og' && (<>
        <div><label className="label">🎓 卒業年</label><input className="input" type="number" placeholder="例: 2018" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} /></div>
        <div><label className="label">🚀 創業経験</label><textarea className="input min-h-[100px]" value={foundingExp} onChange={(e) => setFoundingExp(e.target.value)} placeholder="例: 2018年に医療AI企業を共同創業、シリーズBまでCEO" /></div>
        <div><label className="label">✨ 得意領域（カンマ区切り）</label><input className="input" value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="医療機器, 資金調達, 薬事申請" /></div>
        <label className="flex items-start gap-3 p-4 rounded-2xl bg-coral-50 border border-coral-100 cursor-pointer hover:bg-coral-100/50 transition-colors">
          <input type="checkbox" checked={acceptsChat} onChange={(e) => setAcceptsChat(e.target.checked)} className="mt-0.5 w-5 h-5 accent-coral-500" />
          <span className="text-sm">
            <span className="font-semibold text-coral-700">🤝 学生からの1on1チャットを受け付ける</span>
            <span className="block text-xs text-slate-600 mt-0.5">オフにすると、新しい申請を受け付けなくなります</span>
          </span>
        </label>
      </>)}
      {profile.role === 'faculty' && (<div><label className="label">🏛️ 所属（学部・部署）</label><input className="input" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="例: 産学連携推進室" /></div>)}
      {msg && <p className="text-sm text-mint-600 inline-flex items-center gap-1 animate-fade-in">{msg}</p>}
      <div className="flex justify-end"><button className="btn-primary" disabled={loading}>{loading ? '保存中…' : '💾 変更を保存'}</button></div>
    </form>
  );
}
