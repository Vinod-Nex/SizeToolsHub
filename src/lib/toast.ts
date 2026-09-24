/**
 * SizeToolsHub Universal Toast Notification System
 * Ultra-lightweight, zero-dependency browser toast engine.
 * Compatible with React Islands, Astro components, and vanilla JS.
 */

let toastTimeout: ReturnType<typeof setTimeout> | null = null;

export function showToast(message: string, duration: number = 2500): void {
  if (typeof document === 'undefined') return;

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className =
      'fixed bottom-6 right-6 z-50 pointer-events-none flex flex-col items-end gap-2 px-4 select-none';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  // Remove existing toast if present
  const existing = container.querySelector('.sizetoolshub-toast');
  if (existing) {
    existing.remove();
  }
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className =
    'sizetoolshub-toast pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-ink text-canvas border border-hairline-soft shadow-lg transition-all duration-300 transform translate-y-3 opacity-0';
  toast.innerHTML = `
    <span class="flex items-center justify-center w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold">✓</span>
    <span class="text-xs font-semibold tracking-tight">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  // Schedule auto-dismiss
  toastTimeout = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-3', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return m;
    }
  });
}
