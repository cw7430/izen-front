'use server';

import { clientResponse } from '@/common/api/shared/fetch';
import {
  type RefreshRequestDto,
  type LoginAndRefreshResponseDtoForServer,
  type LoginAndRefreshResponseDtoForClient,
} from '@/features/auth/schemas';
import { ServerRequest } from '@/common/api/server';
import { loginAndRefresh } from './shared';

const { apiPost } = ServerRequest;

export const refreshAction = async (req: RefreshRequestDto) =>
  clientResponse<LoginAndRefreshResponseDtoForClient>(async () => {
    const res = await apiPost<LoginAndRefreshResponseDtoForServer>(
      '/auth/refresh',
      {},
      req,
    );

    return loginAndRefresh(res);
  });
