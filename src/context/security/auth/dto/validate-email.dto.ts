import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ValidateEmailDto {
  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInJvbGVzIjpbeyJyb2xlIjp7ImlkIjozLCJuYW1lIjoiQURNSU4ifS',
  })
  @IsString()
  token: string;
}
