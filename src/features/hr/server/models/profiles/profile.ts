import 'server-only';

import { ServerRequest } from '@/common/api/server';
import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';
import {
  profileDetailResponseSchema,
  profileListResponseSchema,
  type ProfileListRequestDto,
  type ProfileDetailResponseDto,
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
    console.error('Parse Data: ', JSON.stringify(res, null, 2));
    throw new ApiError(
      ResponseCode.INTERNAL_SERVER_ERROR.code,
      ResponseCode.INTERNAL_SERVER_ERROR.message,
    );
  }

  return validation.data;
};

export const getProfile = async (id: bigint) => {
  const res = await apiGet<ProfileDetailResponseDto>(`/hr/profiles/${String(id)}`, {
    authType: 'access',
  });

  const validation = profileDetailResponseSchema.safeParse(res);

  if (!validation.success) {
    console.error('Parse Error: ', validation.error.message);
    throw new ApiError(
      ResponseCode.INTERNAL_SERVER_ERROR.code,
      ResponseCode.INTERNAL_SERVER_ERROR.message,
    );
  }

  return validation.data;
};
