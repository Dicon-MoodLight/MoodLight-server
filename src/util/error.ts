import { HttpException, HttpStatus } from '@nestjs/common';
import { FAILURE_RESPONSE } from '../constants/response';
import {
  FailureResponseMessage,
  failureResponseMessageList,
} from '../types/response';

export function throwHttpException(
  response: FailureResponseMessage,
  status: HttpStatus,
) {
  console.log(`[${new Date()}] - ${response}`);
  throw new HttpException(
    failureResponseMessageList.includes(response)
      ? {
          ...FAILURE_RESPONSE,
          message: response,
        }
      : FAILURE_RESPONSE,
    status,
  );
}
