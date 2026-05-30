import { requireAuth } from '@/lib/auth';
import ProfileEditor from './ProfileEditor';

export default async function MyProfilePage() {
  const profile = await requireAuth();
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">マイプロフィール</h1>
      <ProfileEditor profile={profile} />
    </div>
  );
}
