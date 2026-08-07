import { redirect } from 'next/navigation';

import { getProfileList } from '@/features/hr/server/models/profiles';
import { ProfilesTeb } from '@/features/hr/components/views/profiles/list';
import { ProfilesTable } from '@/features/hr/components/views/profiles/list/table';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmployeeProfileList({ searchParams }: Props) {
  const {
    page = '1',
    sortPath = 'EMPLOYEE',
    sortOrder = 'ASC',
  } = await searchParams;

  const params = {
    page: Number(page) ?? 1,
    sortPath: (['POSITION', 'DEPARTMENT'].includes(sortPath as string)
      ? sortPath
      : 'EMPLOYEE') as 'EMPLOYEE' | 'POSITION' | 'DEPARTMENT',
    sortOrder: (sortOrder === 'DESC' ? 'DESC' : 'ASC') as 'DESC' | 'ASC',
    size: 5,
    blockSize: 5,
  };

  try {
    const profiles = await getProfileList(params);

    return (
      <>
        <ProfilesTeb />
        <ProfilesTable data={profiles} params={params} />
      </>
    );
  } catch {
    redirect('/');
  }
}
