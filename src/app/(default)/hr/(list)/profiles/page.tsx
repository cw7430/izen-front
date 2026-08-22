import { getProfileList } from '@/features/hr/server/models/profiles';
import {
  ProfilesTeb,
  ProfilesTable,
} from '@/features/hr/components/views/profiles/list';
import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';
import {
  InternalServerError,
  KeyError,
  Unauthorized,
} from '@/common/components/layout/errors';

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
  } catch (e) {
    if (e instanceof ApiError) {
      if (
        e.code === ResponseCode.UNAUTHORIZED.code ||
        e.code === ResponseCode.EXPIRED_TOKEN.code ||
        e.code === ResponseCode.INVALID_TOKEN.code
      ) {
        return <Unauthorized />;
      }
      if (e.code === ResponseCode.KEY_ERROR.code) {
        return <KeyError />;
      }
      if (e.code === ResponseCode.RESOURCE_NOT_FOUND.code) {
        return <InternalServerError />;
      }
      return <InternalServerError />;
    }
    return <InternalServerError />;
  }
}
