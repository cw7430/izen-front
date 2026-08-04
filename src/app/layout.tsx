import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';

import './globals.css';
import { DialogModal } from '@/common/components/ui/modal';
import { ReactQueryProvider } from '@/common/components/layout/dev';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Izen',
  description: 'Izen 사내 관리 시스템',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <ReactQueryProvider>
          <DialogModal />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
