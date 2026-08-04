'use server';

import { clientResponseWithResult } from '@/common/api/shared/fetch';
import {
  type LoginRequestDto,
  type LoginAndRefreshResponseDtoForServer,
  type LoginAndRefreshResponseDtoForClient,
} from '@/features/auth/schemas';
import { ServerRequest } from '@/common/api/server';
import { loginAndRefresh } from './shared';

const { apiPost } = ServerRequest;

export const loginAction = async (req: LoginRequestDto) =>
  clientResponseWithResult<LoginAndRefreshResponseDtoForClient>(async () => {
    const res = await apiPost<LoginAndRefreshResponseDtoForServer>(
      '/auth/login',
      {},
      req,
    );

    return loginAndRefresh(res);
  });
