import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  description: string;

  @Min(1)
  @IsPositive()
  price: number;

  @Min(1)
  @IsPositive()
  quantity: number;

  @IsUrl({}, { each: true })
  @IsOptional({ each: true })
  images: string[];

  @IsInt({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  categories: number[];
}
