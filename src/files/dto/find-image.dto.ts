import { IsEnum, IsString } from 'class-validator';
import { DestinationDirectories } from '../enums/destination-dirs.enum';

export class FindImageDto {
  @IsEnum(DestinationDirectories)
  destination: DestinationDirectories;

  @IsString()
  imageName: string;
}
