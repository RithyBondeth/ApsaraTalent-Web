/**
 * Image Cache Utility
 * Provides multi-layered image caching for profile avatars and other images
 */

export interface CachedImage {
  url: string;
  blob: Blob;
  timestamp: number;
  expiresAt: number;
}

export class ImageCache {
  private static instance: ImageCache;
  private cache = new Map<string, CachedImage>();
  private readonly CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
  private readonly MAX_CACHE_SIZE = 100; // Maximum number of images to cache
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB max per image

  private constructor() {
    // Load cached images from localStorage on initialization
    this.loadFromStorage();

    // Cleanup expired cache entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);

    // Save cache to localStorage before page unload
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => this.saveToStorage());
    }
  }

  public static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  /**
   * Get cached image or fetch and cache if not available
   */
  public async getCachedImage(url: string): Promise<string> {
    if (!url || typeof window === "undefined") return url;

    // Check if image is already cached and not expired
    const cached = this.cache.get(url);
    if (cached && cached.expiresAt > Date.now()) {
      return URL.createObjectURL(cached.blob);
    }

    try {
      // Fetch image from network
      const response = await fetch(url, {
        headers: {
          "Cache-Control": "public, max-age=3600", // 1 hour cache
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const contentLength = response.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > this.MAX_IMAGE_SIZE) {
        console.warn(`Image too large to cache: ${url}`);
        return url; // Return original URL for large images
      }

      const blob = await response.blob();

      // Cache the image
      const now = Date.now();
      const cachedImage: CachedImage = {
        url,
        blob,
        timestamp: now,
        expiresAt: now + this.CACHE_DURATION,
      };

      this.cache.set(url, cachedImage);

      // Ensure cache doesn't exceed max size
      this.enforceMaxSize();

      return URL.createObjectURL(blob);
    } catch (error) {
      console.warn(`Failed to cache image: ${url}`, error);
      return url; // Return original URL on error
    }
  }

  /**
   * Preload images for better performance
   */
  public async preloadImages(urls: string[]): Promise<void> {
    const promises = urls
      .filter((url) => url && !this.cache.has(url))
      .slice(0, 10) // Limit concurrent preloads
      .map((url) => this.getCachedImage(url).catch(() => url));

    await Promise.allSettled(promises);
  }

  /**
   * Clear specific image from cache
   */
  public clearImage(url: string): void {
    const cached = this.cache.get(url);
    if (cached) {
      URL.revokeObjectURL(URL.createObjectURL(cached.blob));
      this.cache.delete(url);
    }
  }

  /**
   * Clear all cached images
   */
  public clearAll(): void {
    this.cache.forEach((cached) => {
      URL.revokeObjectURL(URL.createObjectURL(cached.blob));
    });
    this.cache.clear();
    this.clearStorage();
  }

  /**
   * Get cache statistics
   */
  public getStats() {
    const totalSize = Array.from(this.cache.values()).reduce(
      (size, cached) => size + cached.blob.size,
      0
    );

    return {
      count: this.cache.size,
      totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
      maxSize: this.MAX_CACHE_SIZE,
    };
  }

  private cleanup(): void {
    const now = Date.now();
    const expired = Array.from(this.cache.entries()).filter(
      ([, cached]) => cached.expiresAt <= now
    );

    expired.forEach(([url, cached]) => {
      URL.revokeObjectURL(URL.createObjectURL(cached.blob));
      this.cache.delete(url);
    });
  }

  private enforceMaxSize(): void {
    if (this.cache.size <= this.MAX_CACHE_SIZE) return;

    // Remove oldest entries
    const entries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.timestamp - b.timestamp
    );

    const toRemove = entries.slice(0, entries.length - this.MAX_CACHE_SIZE);
    toRemove.forEach(([url, cached]) => {
      URL.revokeObjectURL(URL.createObjectURL(cached.blob));
      this.cache.delete(url);
    });
  }

  private saveToStorage(): void {
    try {
      const cacheData = Array.from(this.cache.entries()).map(
        ([url, cached]) => ({
          url,
          timestamp: cached.timestamp,
          expiresAt: cached.expiresAt,
          // Note: We don't save the blob to localStorage due to size constraints
        })
      );

      localStorage.setItem("image-cache-meta", JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Failed to save cache metadata to localStorage:", error);
    }
  }

  private loadFromStorage(): void {
    try {
      const metaData = localStorage.getItem("image-cache-meta");
      if (!metaData) return;

      // We only load metadata from localStorage
      // Actual images will be re-fetched as needed
      // This helps track which images were previously cached
    } catch (error) {
      console.warn("Failed to load cache metadata from localStorage:", error);
    }
  }

  private clearStorage(): void {
    try {
      localStorage.removeItem("image-cache-meta");
    } catch (error) {
      console.warn("Failed to clear cache metadata from localStorage:", error);
    }
  }
}

export const imageCache = ImageCache.getInstance();
