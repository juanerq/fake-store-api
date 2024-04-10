import { IsEnum, IsString } from 'class-validator';
import { DestinationDirectories } from '../enums/destination-dirs.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FindImageDto {
  @ApiProperty({
    description: 'Folder names where to store files',
    enum: DestinationDirectories,
    required: true,
    example: DestinationDirectories.UPLOADS,
  })
  @IsEnum(DestinationDirectories)
  destination: DestinationDirectories;

  @ApiProperty({
    example: 'a136cfbd-d89b-4fa2-bb4f-0a32f033c735.jpeg',
    required: true,
  })
  @IsString()
  imageName: string;
}
