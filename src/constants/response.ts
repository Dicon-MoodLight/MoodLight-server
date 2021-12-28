import {
  ExceptionMessage,
  StatusResponse,
} from '../types/response';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export const SUCCESS_RESPONSE: StatusResponse = {
  success: true,
};

export const FAILURE_RESPONSE: StatusResponse = {
  success: false,
  message: 'error',
};

export class StatusResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  @IsOptional()
  message: ExceptionMessage;
}
