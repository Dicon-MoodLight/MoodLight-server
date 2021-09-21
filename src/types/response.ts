export type StatusResponse = {
  success: boolean;
  message?: string;
};

export interface ExistResponse {
  exist: boolean;
}

export const failureResponseMessageList = [
  'Unauthorized.',
  'Verification does not exists.',
  'User does not exist.',
  'User does not admin.',
  'Question is not activated.',
  'Answer is private.',
  'error',
] as const;

export type FailureResponseMessage = typeof failureResponseMessageList[number];
