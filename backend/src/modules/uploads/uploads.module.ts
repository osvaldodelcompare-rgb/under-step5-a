import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { MediaController } from './media.controller';

@Module({
  controllers: [UploadsController, MediaController],
  providers: [MinioService, UploadsService],
  exports: [MinioService, UploadsService],
})
export class UploadsModule {}
