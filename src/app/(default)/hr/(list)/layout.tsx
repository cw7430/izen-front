import { ErpListLayout } from '@/common/components/layout/erp-list';

export default function HrLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ErpListLayout title="인사관리">{children}</ErpListLayout>;
}
