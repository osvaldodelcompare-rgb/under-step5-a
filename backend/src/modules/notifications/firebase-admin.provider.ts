import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export const FIREBASE_ADMIN = 'FIREBASE_ADMIN';

export const firebaseAdminProvider: FactoryProvider = {
  provide: FIREBASE_ADMIN,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const projectId = configService.get<string>('fcm.projectId');
    const clientEmail = configService.get<string>('fcm.clientEmail');
    const privateKey = configService.get<string>('fcm.privateKey');

    if (admin.apps.length > 0) {
      return admin.app();
    }

    if (!projectId || !clientEmail || !privateKey) {
      // Development fallback: initialize without credentials so the module
      // still boots locally when FCM secrets have not been configured yet.
      return admin.initializeApp({ projectId: projectId || 'underground-dev' });
    }

    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  },
};
