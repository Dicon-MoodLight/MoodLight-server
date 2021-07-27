import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserEmailDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 320)
  readonly email: string;
}
