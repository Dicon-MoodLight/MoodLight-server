import { HttpException, HttpStatus } from '@nestjs/common';
import { IStatusResponse } from '../types/response';

export function throwHttpException(
  response: IStatusResponse,
  status: HttpStatus,
  err = 'default',
) {
  console.log(`[${new Date()}] - ${err} / ${response.message}`);
  throw new HttpException(response, status);
}
