import { apiClient, unwrap } from './client';
import { Band } from '../types';

export interface CreateBandPayload {
  name: string;
  genre: string;
  bio?: string;
  logoUrl?: string;
  bannerUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  managerEmail?: string;
  managerPhone?: string;
  youtubeEmbedUrls?: string[];
}

export const bandsApi = {
  list(genre?: string) {
    return unwrap<Band[]>(
      apiClient.get('/bands', { params: genre ? { genre } : {} }),
    );
  },

  getById(id: number) {
    return unwrap<Band>(apiClient.get(`/bands/${id}`));
  },

  getBySlug(slug: string) {
    return unwrap<Band>(apiClient.get(`/bands/slug/${slug}`));
  },

  create(payload: CreateBandPayload) {
    return unwrap<Band>(apiClient.post('/bands', payload));
  },

  update(id: number, payload: Partial<CreateBandPayload>) {
    return unwrap<Band>(apiClient.patch(`/bands/${id}`, payload));
  },

  remove(id: number) {
    return apiClient.delete(`/bands/${id}`);
  },
};
