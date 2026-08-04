'use server';

import {
  type LoginRequestDto,
  type LoginAndRefreshResponseDtoForServer,
} from '@/features/auth/schemas';
import { ServerRequest } from '@/common/api/server';
import { loginAndRefresh } from './shared';

const { apiPost } = ServerRequest;

export const loginAction = async (req: LoginRequestDto) => {
  const res = await apiPost<LoginAndRefreshResponseDtoForServer>(
    '/auth/login',
    {},
    req,
  );

  return loginAndRefresh(res);
};
