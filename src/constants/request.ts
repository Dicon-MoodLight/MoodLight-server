import { IsString } from 'class-validator';

export class HeaderIncludesAuthorizationTokenDto {
  @IsString()
  readonly Authorization: string;
}
