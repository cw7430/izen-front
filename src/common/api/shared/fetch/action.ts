'use server';

import { ApiError } from '@/common/api/shared/error';
import {
  type SuccessAction,
  type ErrorAction,
  type ValidationFields,
} from '@/common/api/shared/schemas';
import {
  ResponseCode,
  type ResponseCodeType,
} from '@/common/api/shared/constants';

const success = <T>(data: T): SuccessAction<T> => ({
  success: true,
  data,
});

const error = (
  code: ResponseCodeType,
  message: string,
  errors?: ValidationFields[],
): ErrorAction => ({
  success: false,
  error: {
    code,
    message,
    errors: errors ? errors : undefined,
  },
});

export const clientResponse = async <T>(
  fn: () => Promise<T>,
): Promise<SuccessAction<T> | ErrorAction> =>
  (async () => {
    try {
      const data = await fn();
      return success(data);
    } catch (e) {
      if (e instanceof ApiError) {
        return error(e.code, e.message, e.errors);
      }
      return error(
        ResponseCode.INTERNAL_SERVER_ERROR.code,
        ResponseCode.INTERNAL_SERVER_ERROR.message,
      );
    }
  })();
