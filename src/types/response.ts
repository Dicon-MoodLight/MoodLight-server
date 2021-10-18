export type StatusResponse = {
  success: boolean;
  message?: string;
};

export type ExistResponse = {
  exist: boolean;
};

export const exceptionMessageList = [
  'Unauthorized.',
  'Verification does not exists.',
  'User does not exist.',
  'User does not admin.',
  'Question is not activated.',
  'Answer is private.',
  'error',
  'Email already exists.',
  'Nickname already exists.',
] as const;

export type ExceptionMessage = typeof exceptionMessageList[number];

export type Exception = {
  message: ExceptionMessage;
  status: number;
};
