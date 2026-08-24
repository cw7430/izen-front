import { getProfileList } from '@/features/hr/profiles/server/models';
import {
  ProfilesTeb,
  ProfilesTable,
} from '@/features/hr/profiles/components/views/list';
import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';
import {
  InternalServerError,
  KeyError,
  Unauthorized,
  ValidationError,
} from '@/common/components/layout/errors';
import { CreateProfileModal } from '@/features/hr/profiles/components/ui/modal';

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

  const REDIECT_TO = `/hr/profiles`;
  const MODAL_KEY = 'CreateProfile';

  try {
    const profiles = await getProfileList(params);

    return (
      <>
        <ProfilesTeb
          modalKey={MODAL_KEY}
          allowedProfileTeams={profiles.allowedProfileTeams}
        />
        <ProfilesTable data={profiles} params={params} />
        <CreateProfileModal
          modalKey={MODAL_KEY}
          allowedProfileTeams={profiles.allowedProfileTeams}
          departments={profiles.departments}
          positions={profiles.positions}
        />
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
      if (
        e.code === ResponseCode.VALIDATION_ERROR.code ||
        e.code === ResponseCode.RESOURCE_NOT_FOUND.code
      ) {
        return <ValidationError redirectTo={REDIECT_TO} />;
      }
    }
    return <InternalServerError />;
  }
}
