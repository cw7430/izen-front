import 'server-only';

import { ServerRequest } from '@/common/api/server';
import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';
import {
  profileResponseSchema,
  profileListResponseSchema,
  type ProfileListRequestDto,
  type ProfileResponseDto,
  type ProfileListResponseDto,
} from '@/features/hr/schemas';

const { apiGet } = ServerRequest;

export const getProfileList = async (param: ProfileListRequestDto) => {
  const res = await apiGet<ProfileListResponseDto>(
    '/hr/profiles',
    { authType: 'access' },
    param,
  );

  const validation = profileListResponseSchema.safeParse(res);

  if (!validation.success) {
    console.error('Parse Error: ', validation.error.message);
    throw new ApiError(
      ResponseCode.INTERNAL_SERVER_ERROR.code,
      ResponseCode.INTERNAL_SERVER_ERROR.message,
    );
  }

  return validation.data;
};

export const getProfile = async (id: bigint) => {
  const res = await apiGet<ProfileResponseDto>(`/hr/profiles/${String(id)}`, {
    authType: 'access',
  });

  const validation = profileResponseSchema.safeParse(res);

  if (!validation.success) {
    console.error('Parse Error: ', validation.error.message);
    throw new ApiError(
      ResponseCode.INTERNAL_SERVER_ERROR.code,
      ResponseCode.INTERNAL_SERVER_ERROR.message,
    );
  }

  return validation.data;
};
