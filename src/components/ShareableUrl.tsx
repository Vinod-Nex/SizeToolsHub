import React, { useState } from 'react';
import { showToast } from '../lib/toast';

interface Props {
  params?: Record<string, string | number | undefined | null>;
  label?: string;
  className?: string;
}

export default function ShareableUrl({
  params,
  label = 'Share Calculation',
  className = '',
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    // Build URL with current params if provided
    let url = window.location.href;
    if (params) {
      const parsed = new URL(window.location.href);
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          parsed.searchParams.set(k, String(v));
        }
      });
      url = parsed.toString();
      window.history.replaceState({}, '', url);
    }

    // Attempt Native Share on mobile devices
    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: document.title,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard on dismissal or error
      }
    }

    // Fallback: Copy to Clipboard
    try {
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

      setCopied(true);
      showToast('Shareable link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      title="Copy bookmarkable calculation link with current values"
      aria-label={copied ? 'Link Copied!' : label}
      aria-live="polite"
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-canvas-soft border border-hairline-soft text-ink hover:bg-canvas hover:border-hairline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs hover:shadow-xs select-none ${className}`}
    >
      {copied ? (
        <svg
          className="w-3.5 h-3.5 text-accent animate-in zoom-in duration-150"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg
          className="w-3.5 h-3.5 text-text-muted transition-colors group-hover:text-ink"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      )}
      <span className={copied ? 'text-accent font-bold' : ''}>
        {copied ? 'Link Copied!' : label}
      </span>
    </button>
  );
}
