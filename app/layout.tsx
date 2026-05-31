import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '🚀 浜松医大 スタートアップ・ハブ',
  description: '学生・OB/OG・教職員・運営が繋がる、医療スタートアップのためのコミュニティ ✨',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className="font-sans">{children}</body>
    </html>
  );
}
