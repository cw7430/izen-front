'use server';

import { cookies } from 'next/headers';

import {
  loginAndRefreshResponseSchemaForServer,
  type LoginAndRefreshResponseDtoForServer,
} from '@/features/auth/schemas';
import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';

export const loginAndRefresh = async (
  res: LoginAndRefreshResponseDtoForServer,
) => {
  const cookieStore = await cookies();

  const validation = loginAndRefreshResponseSchemaForServer.safeParse(res);

  if (!validation.success) {
    console.error('Parse Error: ', validation.error.message);
    throw new ApiError(
      ResponseCode.INTERNAL_SERVER_ERROR.code,
      ResponseCode.INTERNAL_SERVER_ERROR.message,
    );
  }

  const result = validation.data;

  const refreshMaxAge = result.isAuto
    ? Math.max(
        0,
        Math.floor((result.refreshTokenExpiresAtMs - Date.now()) / 1000),
      )
    : undefined;

  const isSecure = process.env.NEXT_PUBLIC_APP_ENV !== 'local';

  cookieStore.set({
    name: 'accessToken',
    value: result.accessToken,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isSecure,
  });

  cookieStore.set({
    name: 'refreshToken',
    value: result.refreshToken,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isSecure,
    ...(refreshMaxAge !== undefined && { maxAge: refreshMaxAge }),
  });

  const {
    refreshToken: _refreshToken,
    refreshTokenExpiresAtMs: _refreshTokenExpiresAtMs,
    isAuto: _isAuto,
    accessToken: _accessToken,
    ...clientData
  } = result;

  return clientData;
};
