import { apiClient } from '@/lib/api-client';
import { UploadResponse } from '@/types/api';

export class UploadService {
  /**
   * Upload an image file to the server
   * @param file - The image file to upload
   * @param token - JWT token for authentication
   * @returns Promise<UploadResponse> - Upload result with URL
   */
  static async uploadImage(file: File, token?: string): Promise<UploadResponse> {
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    return apiClient.upload<UploadResponse>('/upload/image', file, token, 'file');
  }

  /**
   * Get the full URL for an uploaded image
   * @param relativeUrl - The relative URL returned from upload
   * @returns string - Full URL to access the image
   */
  static getImageUrl(relativeUrl: string): string {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    return `${API_BASE_URL}${relativeUrl}`;
  }

  /**
   * Validate image file before upload
   * @param file - File to validate
   * @returns boolean - True if valid, throws error if invalid
   */
  static validateImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    return true;
  }
}

export default UploadService;