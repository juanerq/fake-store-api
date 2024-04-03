import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    type: 'string',
    required: true,
    minLength: 3,
    example: 'Video Games',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    required: false,
    example:
      'http://api.fake-store/api/file/categories/fewkfjinkfmi03u0f94f3g4.png',
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  image?: string;
}
