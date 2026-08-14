import { apiClient, unwrap } from './client';
import { User } from '../types';

export const usersApi = {
  getMe() {
    return unwrap<User>(apiClient.get('/users/me'));
  },

  updateMe(payload: Partial<Pick<User, 'name' | 'favoriteGenres'>>) {
    return unwrap<User>(apiClient.patch('/users/me', payload));
  },

  registerPushToken(fcmToken: string) {
    return unwrap<User>(apiClient.patch('/users/me/push-token', { fcmToken }));
  },
};
