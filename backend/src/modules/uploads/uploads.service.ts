import { BadRequestException, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { MinioService } from './minio.service';

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

@Injectable()
export class UploadsService {
  constructor(private readonly minioService: MinioService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }

    const ext =
      EXTENSION_BY_MIME[file.mimetype] ||
      extname(file.originalname) ||
      '.jpg';
    const key = `${randomUUID()}${ext}`;

    await this.minioService.putObject(key, file.buffer, file.mimetype);
    return key;
  }
}
