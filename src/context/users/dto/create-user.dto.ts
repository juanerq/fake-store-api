import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    minLength: 3,
    required: true,
    example: 'Test Fake Store',
  })
  @IsString()
  @MinLength(3)
  fullName: string;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'test123@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    minLength: 6,
    maxLength: 50,
    example: 'Test123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    type: () => [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  roles: number[];
}
