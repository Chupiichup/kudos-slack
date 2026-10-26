'use client';

import React from 'react';
import { useKudos } from '../context/KudosContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, dismissToast } = useKudos();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border text-sm transition-all duration-300 animate-slide-in ${
              isSuccess
                ? 'bg-[#1E2633] text-white border-brand-accent/40'
                : isError
                ? 'bg-red-900 text-white border-red-700'
                : 'bg-brand-card text-brand-text border-brand-border'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : isError ? (
                <AlertCircle className="w-5 h-5 text-red-300" />
              ) : (
                <Info className="w-5 h-5 text-brand-secondary" />
              )}
            </div>
            <div className="flex-1 font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
