'use server';

import { clientResponse } from '@/common/api/shared/fetch';
import {
  type CreateProfileRequestDto,
  type UpdateProfileRequestDto,
  type EmployeeCodeResponseDto,
  employeeCodeResponseSchema,
} from '@/features/hr/profiles/schemas/profile';
import { ServerRequest } from '@/common/api/server';
import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';

const { apiPost, apiPatch } = ServerRequest;

const BASE_URL = '/hr/profiles';

export const createProfile = async (req: CreateProfileRequestDto) =>
  clientResponse<void>(async () =>
    apiPost<void>(BASE_URL, { authType: 'access' }, req),
  );

export const updateProfile = async (req: UpdateProfileRequestDto) =>
  clientResponse<void>(async () =>
    apiPatch<void>(BASE_URL, { authType: 'access' }, req),
  );

export const getEmployeeCode = async () =>
  clientResponse<EmployeeCodeResponseDto>(async () => {
    const res = await apiPost<EmployeeCodeResponseDto>(
      `${BASE_URL}/employee-code`,
      {
        authType: 'access',
      },
    );

    const validation = employeeCodeResponseSchema.safeParse(res);

    if (!validation.success) {
      console.error('Parse Error: ', validation.error.message);
      throw new ApiError(
        ResponseCode.INTERNAL_SERVER_ERROR.code,
        ResponseCode.INTERNAL_SERVER_ERROR.message,
      );
    }

    return validation.data;
  });
