import { IStatusResponse } from '../types/response';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const SUCCESS_RESPONSE: IStatusResponse = {
  success: true,
};

export const FAILURE_RESPONSE: IStatusResponse = {
  success: false,
  message: 'error',
};

export class StatusResponseDto {
  @ApiProperty({ description: '성공 여부' })
  @IsBoolean()
  success: boolean;

  @ApiProperty({ description: '에러 메세지 (실패할 경우)' })
  @IsString()
  @IsOptional()
  message: string;
}
