import { HttpException } from '@nestjs/common';
import { DEFAULT_EXCEPTION, FAILURE_RESPONSE } from '../constants/response';
import { exceptionMessageList, Exception } from '../types/response';

export function exceptionHandler(exception: Exception | string) {
  if (typeof exception === 'string')
    exception = { ...DEFAULT_EXCEPTION, message: exception } as any;
  const { message, status } = exception as Exception;
  console.log(`[${new Date()}] - ${message}`);
  throw new HttpException(
    exceptionMessageList.includes(message)
      ? {
          ...FAILURE_RESPONSE,
          message: exception,
        }
      : FAILURE_RESPONSE,
    status,
  );
}
