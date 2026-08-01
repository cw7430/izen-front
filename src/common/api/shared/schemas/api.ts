import { z } from 'zod';
import { ResponseCodeValues } from '@/common/api/shared/constants';

export const apiFailSchema = z.object({
  code: z.enum(ResponseCodeValues).exclude(['VE']),
  message: z.string(),
});

const validationFieldsSchema = z.object({
  field: z.string(),
  message: z.string(),
});

export const validationErrorSchema = apiFailSchema.extend({
  code: z.literal('VE'),
  message: z.string(),
  errors: z.array(validationFieldsSchema).optional(),
});

export type ApiFail =
  z.infer<typeof apiFailSchema> | z.infer<typeof validationErrorSchema>;
export type ValidationFields = z.infer<typeof validationFieldsSchema>;
