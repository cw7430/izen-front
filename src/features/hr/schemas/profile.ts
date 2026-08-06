import { z } from 'zod';

import {
  pageRequestSchema,
  pageResponseSchema,
} from '@/common/api/shared/schemas';
import { departmentListResponseSchema } from './department';
import { positionListResponseSchema } from './position';

export const profileListRequestSchema = pageRequestSchema([
  'EMPLOYEE',
  'POSITION',
  'DEPARTMENT',
] as const);

const baseProfileSchema = z.object({
  employeeId: z.string().transform((val) => BigInt(val)),
  employeeCode: z.string(),
  employeeRole: z.enum(['DEPARTMENT_CHIEF', 'TEAM_CHIEF', 'EMPLOYEE', 'LEFT']),
  employeeName: z.string(),
  positionCode: z.string(),
  positionName: z.string(),
  departmentCode: z.string(),
  departmentName: z.string(),
  teamCode: z.string(),
  teamName: z.string(),
  phone: z.string(),
  email: z.string(),
  createdBy: z.string().nullable(),
  createdEmployeeName: z.string().nullable(),
  updatedBy: z.string().nullable(),
  updatedEmployeeName: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const profileResponseSchema = baseProfileSchema.extend({
  departments: departmentListResponseSchema,
  positions: positionListResponseSchema,
});

export const profileListResponseSchema = pageResponseSchema(baseProfileSchema).extend({
  departments: departmentListResponseSchema,
  positions: positionListResponseSchema,
});

export type ProfileListRequestDto = z.infer<typeof profileListRequestSchema>;
export type ProfileResponseDto = z.infer<typeof profileResponseSchema>;
export type ProfileListResponseDto = z.infer<typeof profileListResponseSchema>;
