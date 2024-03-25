import { IsEnum } from 'class-validator';
import { DestinationDirectories } from '../enums/destination-dirs.enum';

export class FilesUploadDto {
  @IsEnum(DestinationDirectories)
  destination: DestinationDirectories;
}
