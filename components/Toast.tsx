import React, { useEffect } from 'react';
import { IconCheck } from './Icons';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-fade-in-up">
      <div className="bg-dark-800 border border-brand-500/50 text-white px-6 py-4 rounded-xl shadow-2xl shadow-brand-900/20 flex items-center gap-3">
        <div className="bg-green-500/20 p-2 rounded-full">
          <IconCheck className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <p className="font-medium text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;