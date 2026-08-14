import { Inject, Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UsersService } from '@modules/users/users.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { FIREBASE_ADMIN } from './firebase-admin.provider';

const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject(FIREBASE_ADMIN) private readonly firebaseApp: admin.app.App,
    private readonly usersService: UsersService,
  ) {}

  async send(dto: SendNotificationDto): Promise<{ messageId: string | null }> {
    const user = await this.usersService.findOne(dto.userId);

    if (!user.fcmToken) {
      this.logger.warn(`User #${user.id} has no registered push token`);
      return { messageId: null };
    }

    // The mobile app runs on Expo (managed workflow) and registers Expo
    // push tokens (format "ExponentPushToken[...]"), which Expo's own push
    // service delivers — this works out of the box in Expo Go with zero
    // Firebase setup. Raw FCM tokens (from a future bare/native build) are
    // still routed through firebase-admin.
    if (this.isExpoPushToken(user.fcmToken)) {
      return this.sendExpoPush(user.fcmToken, dto.title, dto.body, dto.data);
    }

    return this.sendFirebasePush(user.fcmToken, dto.title, dto.body, dto.data);
  }

  private isExpoPushToken(token: string): boolean {
    return token.startsWith('ExponentPushToken') || token.startsWith('ExpoPushToken');
  }

  private async sendExpoPush(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<{ messageId: string | null }> {
    try {
      const response = await fetch(EXPO_PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ to: token, title, body, data }]),
      });

      const result = await response.json();
      const ticket = Array.isArray(result?.data) ? result.data[0] : result?.data;

      if (ticket?.status === 'error') {
        this.logger.warn(`Expo push error: ${ticket.message}`);
        return { messageId: null };
      }

      return { messageId: ticket?.id ?? null };
    } catch (error) {
      this.logger.error(
        'Failed to send Expo push notification',
        (error as Error).stack,
      );
      return { messageId: null };
    }
  }

  private async sendFirebasePush(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<{ messageId: string | null }> {
    try {
      const messageId = await this.firebaseApp.messaging().send({
        token,
        notification: { title, body },
        data,
      });
      return { messageId };
    } catch (error) {
      this.logger.error(
        'Failed to send Firebase push notification',
        (error as Error).stack,
      );
      return { messageId: null };
    }
  }

  async broadcastToTokens(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<admin.messaging.BatchResponse | null> {
    const firebaseTokens = tokens.filter((t) => !this.isExpoPushToken(t));
    if (firebaseTokens.length === 0) {
      return null;
    }

    return this.firebaseApp.messaging().sendEachForMulticast({
      tokens: firebaseTokens,
      notification: { title, body },
      data,
    });
  }
}
