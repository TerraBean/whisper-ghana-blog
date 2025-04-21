import { cache } from 'react';

type PrefetchTarget = {
  path: string;  // Path to prefetch
  data?: Record<string, any>;  // Optional data to cache
};

// Cache of prefetched paths and their data
const prefetchCache = new Map<string, any>();

/**
 * Utility to prefetch routes and data when user hovers over links
 * This improves perceived performance by loading content before the user clicks
 */
export const prefetchPostActions = {
  // Prefetch a route and optionally cache data
  prefetch: cache(async (target: PrefetchTarget) => {
    try {
      // Don't prefetch if already in cache
      if (prefetchCache.has(target.path)) {
        return true;
      }

      // If in the browser, use next/router prefetching
      if (typeof window !== 'undefined') {
        // Prefetch the path without waiting
        void fetch(target.path)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to prefetch ${target.path}`);
            return res;
          })
          .catch(err => {
            console.warn(`Prefetch error (non-critical): ${err.message}`);
          });

        // Store optional data in cache
        if (target.data) {
          prefetchCache.set(target.path, target.data);
        } else {
          prefetchCache.set(target.path, true); // Just mark as prefetched
        }
      }
      
      return true;
    } catch (error) {
      // Non-critical errors in prefetching should be silently handled
      console.warn(`Prefetch error (non-critical): ${error}`);
      return false;
    }
  }),

  // Get prefetched data if available
  getPrefetchedData: <T = any>(path: string): T | null => {
    const data = prefetchCache.get(path);
    if (!data || data === true) return null;
    return data as T;
  },

  // Check if a path has been prefetched
  isPrefetched: (path: string): boolean => {
    return prefetchCache.has(path);
  },
  
  // Clear prefetch cache (useful for testing or memory management)
  clearCache: () => {
    prefetchCache.clear();
  }
};