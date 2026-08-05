'use server';

import { cookies } from 'next/headers';

import { type LogoutRequestDto } from '@/features/auth/schemas';
import { ServerRequest } from '@/common/api/server';

const { apiPost } = ServerRequest;

export const logoutAction = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const req: LogoutRequestDto = {
    refreshToken,
  };

  try {
    await apiPost<void>('/auth/logout', {}, req);
  } catch (e) {
  } finally {
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
  }
};
