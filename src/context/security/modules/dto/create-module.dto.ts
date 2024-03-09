import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  detail: string;
}
