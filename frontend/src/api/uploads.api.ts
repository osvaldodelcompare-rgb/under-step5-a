import { apiClient, unwrap } from './client';

export interface UploadResult {
  key: string;
  url: string;
}

export const uploadsApi = {
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return unwrap<UploadResult>(
      apiClient.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    );
  },
};
