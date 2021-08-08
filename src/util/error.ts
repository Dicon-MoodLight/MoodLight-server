import { HttpException, HttpStatus } from '@nestjs/common';
import { IStatusResponse } from '../types/response';

export function throwHttpException(
  response: IStatusResponse,
  status: HttpStatus,
) {
  console.log(`[${new Date()}] - ${response.message}`);
  throw new HttpException(response, status);
}
