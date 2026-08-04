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

const successSingle = (): SuccessAction<void> => ({
  success: true,
  data: undefined,
});

const successWithResult = <T>(data: T): SuccessAction<T> => ({
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

export const clientResponseSingle = async (
  fn: () => Promise<void>,
): Promise<SuccessAction<void> | ErrorAction> =>
  (async () => {
    try {
      await fn();
      return successSingle();
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

export const clientResponseWithResult = async <T>(
  fn: () => Promise<T>,
): Promise<SuccessAction<T> | ErrorAction> =>
  (async () => {
    try {
      const data = await fn();
      return successWithResult(data);
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
