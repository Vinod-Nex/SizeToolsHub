import React, { useState } from 'react';
import { showToast } from '../lib/toast';

export interface CopyResultButtonProps {
  value: string | (() => string);
  label?: string;
  copiedLabel?: string;
  toastMessage?: string;
  variant?: 'pill' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md';
  className?: string;
  title?: string;
}

export default function CopyResultButton({
  value,
  label = 'Copy Result',
  copiedLabel = 'Copied!',
  toastMessage = 'Result copied to clipboard!',
  variant = 'pill',
  size = 'sm',
  className = '',
  title = 'Copy conversion result to clipboard',
}: CopyResultButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const textToCopy = typeof value === 'function' ? value() : value;
      if (!textToCopy) return;

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older contexts
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      showToast(toastMessage);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Base styling adhering to DESIGN.md (stadium pills, hairline borders, active tactile scale)
  const sizeClasses =
    size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

  let variantClasses = '';
  switch (variant) {
    case 'outline':
      variantClasses =
        'bg-canvas border border-hairline text-ink hover:bg-canvas-soft hover:border-ink/20';
      break;
    case 'ghost':
      variantClasses =
        'bg-transparent text-text-muted hover:text-ink hover:bg-canvas-soft';
      break;
    case 'icon':
      variantClasses =
        'p-2 rounded-full bg-canvas-soft border border-hairline text-text-muted hover:text-ink hover:bg-canvas';
      break;
    case 'pill':
    default:
      variantClasses =
        'bg-canvas-soft border border-hairline-soft text-ink hover:bg-canvas hover:border-hairline shadow-2xs hover:shadow-xs';
      break;
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={title}
      aria-label={copied ? copiedLabel : label}
      aria-live="polite"
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition-all duration-150 active:scale-95 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        variant !== 'icon' ? sizeClasses : ''
      } ${variantClasses} ${className}`}
    >
      {copied ? (
        <svg
          className="w-3.5 h-3.5 text-accent animate-in zoom-in-50 duration-150"
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
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}

      {variant !== 'icon' && (
        <span className={copied ? 'text-accent font-bold' : ''}>
          {copied ? copiedLabel : label}
        </span>
      )}
    </button>
  );
}
