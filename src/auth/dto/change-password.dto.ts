import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { UserPasswordDto } from '../../user/dto/user-password.dto';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { OptionalUserIdDto } from '../../user/dto/optional-user-id.dto';

export class ChangePasswordDto extends IntersectionType(
  OptionalUserIdDto,
  UserPasswordDto,
) {
  @ApiProperty({ description: '새 비밀번호' })
  @IsNotEmpty()
  @Length(6, 24)
  @IsString()
  readonly newPassword: string;
}
