import { IStatusResponse } from '../types/response';

export const SUCCESS_RESPONSE: IStatusResponse = {
  success: true,
};

export const FAILURE_RESPONSE: IStatusResponse = {
  success: false,
  message: 'error',
};
