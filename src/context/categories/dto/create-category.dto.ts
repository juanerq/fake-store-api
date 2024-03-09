import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsUrl()
  image: string;
}
