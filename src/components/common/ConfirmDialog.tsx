'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isDestructive ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900 leading-snug">{title}</h3>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-2xs transition disabled:opacity-50 ${
              isDestructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {isLoading && (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
