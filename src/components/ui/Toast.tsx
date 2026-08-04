'use client';

import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toast: (options: { title: string; description?: string; variant?: 'success' | 'error' | 'info' }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = 'success' }: { title: string; description?: string; variant?: 'success' | 'error' | 'info' }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 25, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
              className={clsx(
                'pointer-events-auto rounded-2xl shadow-2xl p-4 flex items-start gap-3.5 border text-white',
                t.variant === 'success' && 'bg-emerald-600 border-emerald-500 shadow-emerald-600/25',
                t.variant === 'error' && 'bg-red-600 border-red-500 shadow-red-600/25',
                t.variant === 'info' && 'bg-blue-600 border-blue-500 shadow-blue-600/25'
              )}
            >
              {t.variant === 'success' && <CheckCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />}
              {t.variant === 'error' && <AlertCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />}
              {t.variant === 'info' && <Info className="w-5 h-5 text-white shrink-0 mt-0.5" />}

              <div className="flex-1">
                <h4 className="text-sm font-bold text-white tracking-tight">{t.title}</h4>
                {t.description && <p className="text-xs text-white/90 font-medium mt-0.5 leading-relaxed">{t.description}</p>}
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-colors p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
