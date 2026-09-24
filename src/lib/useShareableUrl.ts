import { useEffect, useRef, useCallback } from 'react';
import { showToast } from './toast';

export interface ShareableParams {
  [key: string]: string | number | undefined | null;
}

/**
 * Custom React Hook to reflect state into URL search query params
 * without triggering page reloads. Makes state bookmarkable and shareable.
 */
export function useShareableUrl(
  params: ShareableParams,
  onInitialLoad?: (initialParams: URLSearchParams) => void
) {
  const isFirstMount = useRef(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read initial params once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.toString() && onInitialLoad) {
      onInitialLoad(searchParams);
    }
  }, []);

  // Update query params when inputs change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Skip the very first run to prevent wiping query parameters on fresh page load
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const currentUrl = new URL(window.location.href);
      const searchParams = currentUrl.searchParams;

      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.set(key, String(val));
        } else {
          searchParams.delete(key);
        }
      });

      const newQuery = searchParams.toString();
      const newRelativePath =
        currentUrl.pathname + (newQuery ? `?${newQuery}` : '') + currentUrl.hash;

      window.history.replaceState({ path: newRelativePath }, '', newRelativePath);
    }, 200);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [params]);

  // Helper to copy the current full shareable URL to clipboard
  const copyShareableUrl = useCallback(async () => {
    if (typeof window === 'undefined') return;
    try {
      const url = window.location.href;
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('Shareable link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy shareable URL:', err);
    }
  }, []);

  return { copyShareableUrl };
}
