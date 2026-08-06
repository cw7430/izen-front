import { ErpTeb } from '@/common/components/ui/teb';

export default function EmployeeAttendance() {
  return (
    <>
      <h1 className="text-center">근태</h1>
      <ErpTeb domain="hr" />
    </>
  );
}
