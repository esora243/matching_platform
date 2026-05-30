'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { UserRole } from '@/types/database';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    setLoading(false);
    if (error) return setErr(error.message);
    setDone(true);
    setTimeout(() => router.push('/login'), 2000);
  };

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="card max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">登録ありがとうございます</h2>
          <p className="text-sm text-slate-600">
            {role === 'ob_og'
              ? '管理者の承認をお待ちください。'
              : 'メールを確認後、ログインしてください。'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-brand-900">新規登録</h1>
        <div>
          <label className="label">氏名</label>
          <input className="input" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="label">メールアドレス</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">パスワード（8文字以上）</label>
          <input className="input" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="label">アカウント種別</label>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            <option value="student">学生（在籍中）</option>
            <option value="ob_og">OB・OG（卒業生・承認制）</option>
            <option value="faculty">教職員</option>
          </select>
          {role === 'ob_og' && (
            <p className="text-xs text-amber-600 mt-1">※ OB・OG 登録は管理者承認後に有効化されます。</p>
          )}
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? '登録中…' : '登録する'}
        </button>
        <p className="text-sm text-center text-slate-600">
          既に登録済？ <Link href="/login" className="text-brand-600 hover:underline">ログイン</Link>
        </p>
      </form>
    </main>
  );
}
