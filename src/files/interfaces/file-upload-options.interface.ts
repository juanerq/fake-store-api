import { DestinationDirectories } from '../enums/destination-dirs.enum';

export interface FileUploadOptions {
  destination?: DestinationDirectories;
  rootDir?: string;
}
