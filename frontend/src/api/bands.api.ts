import { apiClient, unwrap } from './client';
import { Band } from '../types';

export const bandsApi = {
  list(genre?: string) {
    return unwrap<Band[]>(
      apiClient.get('/bands', { params: genre ? { genre } : {} }),
    );
  },
  getById(id: number) {
    return unwrap<Band>(apiClient.get(`/bands/${id}`));
  },
};
