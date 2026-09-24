import React, { useEffect, useState } from 'react';

interface Props {
  size?: 'sm' | 'md';
  className?: string;
}

export default function DarkModeToggle({ size = 'md', className = '' }: Props) {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const dark =
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark';
    setIsDark(dark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }

    try {
      localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  };

  const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`theme-toggle-btn ${sizeClasses} rounded-full bg-canvas-soft border border-hairline-soft flex items-center justify-center text-ink hover:bg-hairline hover:border-hairline transition-all duration-200 cursor-pointer select-none shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      {mounted && isDark ? (
        <svg
          className={`${iconSize} text-accent transition-transform duration-300 transform rotate-0 hover:rotate-45`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className={`${iconSize} text-ink transition-transform duration-300 transform -rotate-12 hover:rotate-0`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
