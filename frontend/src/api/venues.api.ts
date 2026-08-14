import { apiClient, unwrap } from './client';
import { Venue } from '../types';

export interface VenuePayload {
  regionId: number;
  name: string;
  description?: string;
  address: string;
  neighborhood?: string;
  city: string;
  logoUrl?: string;
  bannerUrl?: string;
  mpLink?: string;
}

export const venuesApi = {
  list(regionId?: number) {
    return unwrap<Venue[]>(
      apiClient.get('/venues', { params: regionId ? { regionId } : {} }),
    );
  },
  getMine() {
    return unwrap<Venue[]>(apiClient.get('/venues/mine'));
  },
  getById(id: number) {
    return unwrap<Venue>(apiClient.get(`/venues/${id}`));
  },
  getBySlug(slug: string) {
    return unwrap<Venue>(apiClient.get(`/venues/slug/${slug}`));
  },
  create(payload: VenuePayload) {
    return unwrap<Venue>(apiClient.post('/venues', payload));
  },
  update(id: number, payload: Partial<VenuePayload>) {
    return unwrap<Venue>(apiClient.patch(`/venues/${id}`, payload));
  },
  remove(id: number) {
    return apiClient.delete(`/venues/${id}`);
  },
};
