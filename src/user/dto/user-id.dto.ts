import { IsUUID } from 'class-validator';

export class UserIdDto {
  @IsUUID()
  readonly userId: string;
}
