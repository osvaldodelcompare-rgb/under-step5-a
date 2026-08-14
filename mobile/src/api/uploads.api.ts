import { apiClient, unwrap } from './client';

export interface UploadResult {
  key: string;
  url: string;
}

export interface PickedImage {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
}

export const uploadsApi = {
  uploadImage(image: PickedImage) {
    const formData = new FormData();
    const name = image.fileName || `upload-${Date.now()}.jpg`;
    const type = image.mimeType || 'image/jpeg';

    // React Native's FormData accepts this { uri, name, type } shape in
    // place of a Blob — axios/XHR handles the multipart encoding for us.
    formData.append('file', {
      uri: image.uri,
      name,
      type,
    } as unknown as Blob);

    return unwrap<UploadResult>(
      apiClient.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    );
  },
};
