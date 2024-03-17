import { IsString } from 'class-validator';

export class ValidateEmailDto {
  @IsString()
  token: string;
}
