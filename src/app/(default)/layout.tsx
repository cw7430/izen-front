import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { DefaultFooter } from '@/common/components/layout/footer';
import { DefaultHeader } from '@/common/components/layout/header';

export default async function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const hasRefreshToken = !!cookieStore.get('refreshToken')?.value;
  const hasAccessToken = !!cookieStore.get('accessToken')?.value;

  if (!hasRefreshToken) {
    redirect('/login', 'replace');
  }

  return (
    <>
      <div className="bg-light text-dark">
        <DefaultHeader />
        {children}
        <DefaultFooter />
      </div>
    </>
  );
}
