import { ReactNode, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  detents?: 'tall' | 'medium';
}

export function Sheet({ open, onClose, title, children, detents = 'tall' }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] animate-fade-in"
      />
      <div
        className={`absolute left-0 right-0 bottom-0 glass-strong rounded-t-ios-xl animate-sheet-in ${
          detents === 'tall' ? 'max-h-[92vh]' : 'max-h-[66vh]'
        }`}
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
      >
        <div className="pt-2 flex justify-center">
          <span className="w-10 h-1.5 rounded-full bg-ink/15 dark:bg-white/15" />
        </div>
        {title && (
          <div className="px-5 pt-3 pb-2 flex items-center justify-between">
            <h2 className="text-[22px] font-bold tracking-[-0.02em]">{title}</h2>
            <button
              onClick={onClose}
              className="press w-8 h-8 rounded-full bg-ink/5 dark:bg-white/10 grid place-items-center text-ink-2"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        <div className="overflow-y-auto no-scrollbar px-5 pt-2 pb-6" style={{ maxHeight: detents === 'tall' ? 'calc(92vh - 80px)' : 'calc(66vh - 80px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
