"use client";

import React from "react";
import { Icon } from "../atoms/Icon";
import { Button } from "../atoms/Button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "error";
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "primary",
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={() => !isLoading && onCancel()} 
      />
      <div className="relative bg-surface p-8 rounded-3xl w-full max-w-md shadow-2xl border border-outline-variant/20 animate-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
            variant === "error" ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
          }`}>
            <Icon name={variant === "error" ? "warning" : "help_outline"} className="text-3xl" />
          </div>
          
          <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>
          <p className="text-on-surface-variant mb-8">
            {description}
          </p>

          <div className="flex flex-col gap-3 w-full">
            <Button 
              variant={variant === "error" ? "primary" : "primary"} // You might want a specific error variant if available
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl ${variant === "error" ? "bg-error text-white shadow-error/20" : ""}`}
            >
              {isLoading ? "Memproses..." : confirmLabel}
            </Button>
            <button 
              onClick={onCancel}
              disabled={isLoading}
              className="w-full py-4 text-on-surface-variant font-bold hover:text-primary transition-colors disabled:opacity-50"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
