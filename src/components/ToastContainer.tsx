import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import type { Toast as ToastType } from '@/hooks/useToast';

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

const toneClasses = {
  success:
    'border-teal-600/40 bg-teal-50 text-teal-900 dark:border-teal-600/50 dark:bg-teal-950 dark:text-teal-100',
  error:
    'border-red-600/40 bg-red-50 text-red-900 dark:border-red-600/50 dark:bg-red-950 dark:text-red-100',
  info: 'border-slate-300 bg-white text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100',
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-20 right-4 z-[60] flex max-w-[calc(100vw-2rem)] flex-col gap-2 sm:bottom-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl animate-slide-in-right ${toneClasses[toast.type]}`}
        >
          {toast.type === 'success' && (
            <CheckCircle2 size={18} className="shrink-0 text-teal-700 dark:text-teal-400" />
          )}
          {toast.type === 'error' && (
            <XCircle size={18} className="shrink-0 text-red-700 dark:text-red-400" />
          )}
          {toast.type === 'info' && (
            <Info size={18} className="shrink-0 text-slate-500 dark:text-slate-400" />
          )}
          <span className="text-sm">{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="ml-2 shrink-0 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            aria-label="Dispensar aviso"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
