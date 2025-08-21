import { useState, useEffect } from 'react';
import { imageCache } from '@/utils/cache/image-cache';

export interface UseCachedImageOptions {
  fallback?: string;
  preload?: boolean;
}

/**
 * Hook for caching and optimizing image loading
 * @param imageUrl - The original image URL
 * @param options - Configuration options
 * @returns Object with cached image URL and loading state
 */
export function useCachedImage(
  imageUrl: string | undefined | null, 
  options: UseCachedImageOptions = {}
) {
  const { fallback, preload = false } = options;
  const [cachedUrl, setCachedUrl] = useState<string | undefined>(imageUrl || fallback);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setCachedUrl(fallback);
      return;
    }

    // If preload is disabled and this is the first load, use original URL
    if (!preload && cachedUrl === imageUrl) {
      return;
    }

    setIsLoading(true);
    setError(null);

    imageCache
      .getCachedImage(imageUrl)
      .then((url) => {
        setCachedUrl(url);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setCachedUrl(fallback || imageUrl);
        setIsLoading(false);
      });

    // Cleanup: revoke object URL when component unmounts or URL changes
    return () => {
      if (cachedUrl && cachedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(cachedUrl);
      }
    };
  }, [imageUrl, fallback, preload]);

  return {
    cachedUrl,
    isLoading,
    error,
    originalUrl: imageUrl,
  };
}

/**
 * Hook for preloading multiple images
 * @param imageUrls - Array of image URLs to preload
 */
export function usePreloadImages(imageUrls: (string | undefined | null)[]) {
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);

  useEffect(() => {
    const validUrls = imageUrls.filter((url): url is string => Boolean(url));
    
    if (validUrls.length === 0) return;

    setIsPreloading(true);
    setPreloadProgress(0);

    imageCache
      .preloadImages(validUrls)
      .then(() => {
        setPreloadProgress(100);
        setIsPreloading(false);
      })
      .catch(() => {
        setIsPreloading(false);
      });
  }, [imageUrls]);

  return {
    isPreloading,
    preloadProgress,
  };
}

/**
 * Hook for managing image cache
 */
export function useImageCache() {
  const clearCache = () => {
    imageCache.clearAll();
  };

  const clearImage = (url: string) => {
    imageCache.clearImage(url);
  };

  const getStats = () => {
    return imageCache.getStats();
  };

  const preloadImages = (urls: string[]) => {
    return imageCache.preloadImages(urls);
  };

  return {
    clearCache,
    clearImage,
    getStats,
    preloadImages,
  };
}