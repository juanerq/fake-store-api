import { IsEnum } from 'class-validator';
import { DestinationDirectories } from '../enums/destination-dirs.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FilesUploadDto {
  @ApiProperty({
    description: 'Folder names where to store files',
    enum: DestinationDirectories,
    required: true,
    example: DestinationDirectories.UPLOADS,
  })
  @IsEnum(DestinationDirectories)
  destination: DestinationDirectories;
}
