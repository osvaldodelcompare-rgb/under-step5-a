import { apiClient, unwrap } from './client';
import { AuthResponse } from '../types';

export const authApi = {
  register(payload: { name: string; email: string; password: string }) {
    return unwrap<AuthResponse>(apiClient.post('/auth/register', payload));
  },

  login(payload: { email: string; password: string }) {
    return unwrap<AuthResponse>(apiClient.post('/auth/login', payload));
  },
};
