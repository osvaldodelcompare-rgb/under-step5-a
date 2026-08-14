import { apiClient, unwrap } from './client';
import { PaginatedResult, Post, PostType } from '../types';

export interface CreatePostPayload {
  venueId: number;
  bandId?: number;
  postType: PostType;
  title: string;
  content: string;
  mediaUrls?: string[];
  youtubeUrl?: string;
  ticketLink?: string;
  price?: string;
  eventDate?: string;
}

export const postsApi = {
  list(params: {
    page?: number;
    limit?: number;
    venueId?: number;
    bandId?: number;
    postType?: PostType;
  }) {
    return unwrap<PaginatedResult<Post>>(apiClient.get('/posts', { params }));
  },
  getById(id: number) {
    return unwrap<Post>(apiClient.get(`/posts/${id}`));
  },
  create(payload: CreatePostPayload) {
    return unwrap<Post>(apiClient.post('/posts', payload));
  },
};
