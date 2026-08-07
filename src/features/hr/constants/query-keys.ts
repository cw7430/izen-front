const ALL_KEY = 'hr';

export const HR_KEYS = {
  all: [ALL_KEY],
  createProfile: [ALL_KEY, 'create-profile'],
  generateEmployeeCode: [ALL_KEY, 'generate-employee-code'],
} as const;
