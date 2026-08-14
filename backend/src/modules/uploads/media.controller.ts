import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '@shared/decorators/public.decorator';
import { MinioService } from './minio.service';

@Controller('media')
export class MediaController {
  constructor(private readonly minioService: MinioService) {}

  @Get(':key')
  @Public()
  async getMedia(@Param('key') key: string, @Res() res: Response) {
    let stat;
    try {
      stat = await this.minioService.statObject(key);
    } catch {
      throw new NotFoundException('Archivo no encontrado');
    }

    const objectStream = await this.minioService.getObjectStream(key);
    res.setHeader(
      'Content-Type',
      stat.metaData?.['content-type'] || 'application/octet-stream',
    );
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    objectStream.pipe(res);
  }
}
