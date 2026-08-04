import type { ResponseCodeType } from '@/common/api/shared/constants';
import type { ValidationFields } from '@/common/api/shared/schemas/api';

export class ApiError extends Error {
  public readonly code: ResponseCodeType;
  public readonly errors?: ValidationFields[];

  constructor(
    code: ResponseCodeType,
    message: string,
    errors?: ValidationFields[],
  ) {
    super(message);
    this.code = code;
    this.errors = errors;
    this.name = 'ApiError';
  }
}
