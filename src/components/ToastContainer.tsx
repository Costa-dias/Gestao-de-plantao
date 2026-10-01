import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import type { Toast as ToastType } from '@/hooks/useToast';

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-20 right-4 z-[60] flex flex-col gap-2 sm:bottom-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl animate-slide-in-right ${
            toast.type === 'success'
              ? 'border-teal-600/50 bg-teal-950/90 text-teal-100'
              : toast.type === 'error'
              ? 'border-red-600/50 bg-red-950/90 text-red-100'
              : 'border-slate-600/50 bg-slate-850/90 text-slate-100'
          }`}
          style={{
            backgroundColor:
              toast.type === 'success'
                ? 'rgba(2, 33, 32, 0.95)'
                : toast.type === 'error'
                ? 'rgba(50, 7, 7, 0.95)'
                : 'rgba(15, 23, 42, 0.95)',
          }}
        >
          {toast.type === 'success' && <CheckCircle2 size={18} className="text-teal-400" />}
          {toast.type === 'error' && <XCircle size={18} className="text-red-400" />}
          {toast.type === 'info' && <Info size={18} className="text-slate-400" />}
          <span className="text-sm">{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="ml-2 text-slate-400 hover:text-slate-200"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
