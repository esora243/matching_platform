import { requireAuth } from '@/lib/auth';
import { ROLE_LABEL, ROLE_EMOJI } from '@/lib/roles';
import ProfileEditor from './ProfileEditor';

export default async function MyProfilePage() {
  const profile = await requireAuth();
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="section-title"><span>🪪</span> マイプロフィール</h1>
        <p className="section-subtitle">あなたの情報を更新して、コミュニティから見つけてもらおう ✨</p>
      </div>
      <div className="card-pop">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-3xl bg-gradient-hero flex items-center justify-center text-white font-bold text-3xl shadow-soft">{profile.full_name.charAt(0)}</div>
          <div>
            <div className="text-lg font-bold text-slate-900">{profile.full_name}</div>
            <div className="text-xs text-slate-500">{profile.email}</div>
            <span className="badge-brand mt-2">{ROLE_EMOJI[profile.role]} {ROLE_LABEL[profile.role]}</span>
          </div>
        </div>
        <ProfileEditor profile={profile} />
      </div>
    </div>
  );
}
