'use server';

import { type LogoutRequestDto } from '@/features/auth/schemas';
import { ServerRequest } from '@/common/api/server';

const { apiPost } = ServerRequest;

export const logoutAction = async (req: LogoutRequestDto) => {
  try {
    await apiPost<void>('/auth/logout', {}, req);
  } catch (e) {}
};
