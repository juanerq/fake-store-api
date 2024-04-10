import { ApiProperty } from '@nestjs/swagger';

export class FilesUploadResponseDto {
  @ApiProperty({
    description: 'List of uploaded file urls',
    example: [
      'http://localhost:10101/api/files/uploads/a136cfbd-d89b-4fa2-bb4f-0a32f033c735.jpeg',
    ],
  })
  secureUrls: string[];
}
