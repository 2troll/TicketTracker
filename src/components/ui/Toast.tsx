import { createContext, useCallback, useContext, useRef, useState, ReactNode } from 'react';

interface Toast { id: number; text: string }
interface Ctx { show: (text: string) => void }

const ToastCtx = createContext<Ctx>({ show: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const show = useCallback((text: string) => {
    const id = ++counter.current;
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), 2600);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed top-4 left-0 right-0 z-[1100] flex flex-col items-center gap-2 pointer-events-none" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        {toasts.map(t => (
          <div key={t.id} className="glass-strong rounded-full px-4 h-10 flex items-center text-sm font-semibold animate-fade-in shadow-float">
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
