'use server';

import { clientResponse } from '@/common/api/shared/fetch';
import {
  employeeCodeResponseSchema,
  type EmployeeCodeResponseDto,
} from '@/features/hr/schemas/profile';
import { ServerRequest } from '@/common/api/server';
import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';

const { apiPost } = ServerRequest;

export const getEmployeeCode = async () =>
  clientResponse<EmployeeCodeResponseDto>(async () => {
    const res = await apiPost<EmployeeCodeResponseDto>('/hr/employee-code', {
      authType: 'access',
    });

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
