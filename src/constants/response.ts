import {
  exceptionMessageList,
  ExceptionMessage,
  StatusResponse,
  Exception,
} from '../types/response';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const SUCCESS_RESPONSE: StatusResponse = {
  success: true,
};

export const FAILURE_RESPONSE: StatusResponse = {
  success: false,
  message: 'error',
};

export const DEFAULT_EXCEPTION: Exception = {
  message: 'error',
  status: HttpStatus.CONFLICT,
};

export class StatusResponseDto {
  @ApiProperty({ description: '성공 여부' })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: `에러 메세지 (실패할 경우)\n\n [${exceptionMessageList}]`,
  })
  @IsString()
  @IsOptional()
  message: ExceptionMessage;
}
