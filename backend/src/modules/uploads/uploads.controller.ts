import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Request } from 'express';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { UploadsService } from './uploads.service';
import { imageFileFilter, MAX_IMAGE_SIZE_BYTES } from './image-file.filter';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
      fileFilter: imageFileFilter,
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const key = await this.uploadsService.uploadImage(file);

    // Build the URL from the same host the client used to reach us, so it
    // works whether we're accessed via localhost, a Codespaces forwarded
    // URL, or anything else — no extra config needed per environment.
    const url = `${req.protocol}://${req.get('host')}/api/v1/media/${key}`;

    return { key, url };
  }
}
