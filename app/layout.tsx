import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '浜松医科大学 起業支援プラットフォーム',
  description: '学生・OB/OG・教職員が繋がる、起業相談のためのコミュニティ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
