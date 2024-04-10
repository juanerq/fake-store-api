import { ConfigService } from '@nestjs/config';
import { MultipartFile } from '@fastify/multipart';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

// Types
import { DestinationDirectories } from './enums/destination-dirs.enum';
import { FileUploadOptions } from './interfaces/file-upload-options.interface';
import { FilesUploadResponseDto } from './dto/files-upload-response.dto';

@Injectable()
export class FilesService {
  private readonly validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  private readonly defaultFileDir = DestinationDirectories.UPLOADS;
  private staticDirPath: string;

  constructor(private readonly configService: ConfigService) {
    this.staticDirPath = configService.get('STATIC_DIR_PATH');
  }

  getFilePath(
    imageName: string,
    options: FileUploadOptions = {
      destination: this.defaultFileDir,
      rootDir: this.staticDirPath,
    },
  ) {
    const { destination = this.defaultFileDir, rootDir = this.staticDirPath } =
      options ?? {};

    const pathFromRoot = join(destination, imageName);
    const path = join(process.cwd(), rootDir, pathFromRoot);

    if (!fs.existsSync(path))
      throw new NotFoundException(`file with name ${imageName} not found`);

    return {
      path,
      pathFromRoot,
    };
  }

  validateFileExtensions(fileExtension: string) {
    if (!this.validExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `File with ${fileExtension} extension is not allowed. Allowed extensions ${this.validExtensions.join(', ')}`,
      );
    }
  }

  async uploadFiles(
    multiPart: AsyncIterableIterator<MultipartFile>,
    options?: FileUploadOptions,
  ): Promise<FilesUploadResponseDto> {
    const { destination = this.defaultFileDir, rootDir = this.staticDirPath } =
      options ?? {};

    const secureUrls: string[] = [];

    try {
      for await (const part of multiPart) {
        if (part.file) {
          const { mimetype } = part;
          const fileExtension = mimetype.split('/').pop();

          this.validateFileExtensions(fileExtension);

          const pathDir = join(process.cwd(), rootDir, destination);
          if (!fs.existsSync(pathDir))
            throw new NotFoundException('Directory not found');

          const fileName = `${uuid()}.${fileExtension}`;
          const path = join(pathDir, fileName);

          const writeStream = fs.createWriteStream(path);
          part.file.pipe(writeStream);

          const hostApi = this.configService.get('HOST_API');
          const slash = hostApi.split('').pop() !== '/' ? '/' : '';

          const secureUrl = `${hostApi}${slash}files/${destination}/${fileName}`;

          secureUrls.push(secureUrl);
        }
      }

      if (!secureUrls.length) {
        throw new BadRequestException(`No file received`);
      }

      return { secureUrls };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException(`Error uploading files. ${error}`);
    }
  }
}
