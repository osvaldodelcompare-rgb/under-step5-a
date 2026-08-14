import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/interceptors/roles.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { UserRole } from '@modules/users/user.entity';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @Roles(UserRole.VENUE_ADMIN, UserRole.BAND_ADMIN, UserRole.SUPERADMIN)
  send(@Body() dto: SendNotificationDto) {
    return this.notificationsService.send(dto);
  }
}
