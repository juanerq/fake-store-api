import { IsString, MinLength } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @MinLength(3)
  name: string;
}
