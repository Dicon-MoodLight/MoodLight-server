import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserPasswordDto {
  @Length(6, 24)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
