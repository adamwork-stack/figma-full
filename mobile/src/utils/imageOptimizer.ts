// Image optimization utilities

export const getOptimizedImageUrl = (
  originalUrl: string,
  width?: number,
  height?: number,
): string => {
  // In production, use image CDN service (e.g., Cloudinary, Imgix)
  // For now, return original URL
  if (width || height) {
    // Add query parameters for image resizing
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    return `${originalUrl}?${params.toString()}`;
  }
  return originalUrl;
};

export const getThumbnailUrl = (originalUrl: string): string => {
  return getOptimizedImageUrl(originalUrl, 300, 300);
};
