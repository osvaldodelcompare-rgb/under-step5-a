import { apiClient, unwrap } from './client';
import { Region } from '../types';

export const regionsApi = {
  list() {
    return unwrap<Region[]>(apiClient.get('/regions'));
  },
};
