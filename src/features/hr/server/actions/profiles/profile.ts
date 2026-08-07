'use server';

import { clientResponse } from '@/common/api/shared/fetch';
import type {
  CreateProfileRequestDto,
  UpdateProfileRequestDto,
} from '@/features/hr/schemas/profile';
import { ServerRequest } from '@/common/api/server';
import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';

const { apiPost, apiPatch } = ServerRequest;

export const createProfile = async (req: CreateProfileRequestDto) =>
  clientResponse<void>(async () =>
    apiPost<void>('/hr/profiles', { authType: 'access' }, req),
  );

export const updateProfile = async (req: UpdateProfileRequestDto) =>
  clientResponse<void>(async () =>
    apiPatch<void>('/hr/profiles', { authType: 'access' }, req),
  );
