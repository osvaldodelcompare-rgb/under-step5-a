import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/users/users.module';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { firebaseAdminProvider } from './firebase-admin.provider';

@Module({
  imports: [UsersModule],
  controllers: [NotificationsController],
  providers: [firebaseAdminProvider, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
