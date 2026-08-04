'use server';

import {
  type RefreshRequestDto,
  type LoginAndRefreshResponseDtoForServer,
} from '@/features/auth/schemas';
import { ServerRequest } from '@/common/api/server';
import { loginAndRefresh } from './shared';

const { apiPost } = ServerRequest;

export const refreshAction = async (req: RefreshRequestDto) => {
  const res = await apiPost<LoginAndRefreshResponseDtoForServer>(
    '/auth/refresh',
    { authType: 'refresh' },
    req,
  );

  return loginAndRefresh(res);
};
