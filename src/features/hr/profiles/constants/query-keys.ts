import { HR_KEYS } from '@/features/hr/constants';

const ALL_KEY = HR_KEYS.profiles;

export const PROFILE_KEYS = {
  all: [...ALL_KEY],
  createProfile: [...ALL_KEY, 'create-profile'],
  updateProfile: [...ALL_KEY, 'update-profile'],
  generateEmployeeCode: [...ALL_KEY, 'generate-employee-code'],
} as const;
