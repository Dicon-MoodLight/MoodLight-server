import { IsOptional, IsUUID } from 'class-validator';

export class OptionalUserIdDto {
  @IsUUID()
  @IsOptional()
  readonly userId: string;
}
