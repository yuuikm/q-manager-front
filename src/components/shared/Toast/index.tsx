import { type FC, useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

const Toast: FC<ToastProps> = ({ message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm sm:text-base font-medium max-w-md border border-slate-700 animate-slide-up">
      <span className="material-symbols-outlined text-emerald-400 text-[22px] shrink-0">
        check_circle
      </span>
      <span className="leading-snug">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-auto text-slate-400 hover:text-white p-1 rounded transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};

export default Toast;
