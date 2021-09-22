import { Exception } from '../types/response';
import { HttpStatus } from '@nestjs/common';

export const DEFAULT_EXCEPTION: Exception = {
  message: 'error',
  status: HttpStatus.CONFLICT,
};

export const UNAUTHORIZED_EXCEPTION: Exception = {
  message: 'Unauthorized.',
  status: HttpStatus.UNAUTHORIZED,
};

export const NOT_ADMIN_EXCEPTION: Exception = {
  message: 'User does not admin.',
  status: HttpStatus.FORBIDDEN,
};
