import { DefaultFooter } from '@/common/components/layout/footer';
import { DefaultHeader } from '@/common/components/layout/header';

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
