import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserNicknameDto {
  @Length(3, 13)
  @IsString()
  @IsNotEmpty()
  readonly nickname: string;
}
