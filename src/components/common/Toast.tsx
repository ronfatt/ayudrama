import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-ayu-gold shrink-0" />,
    info: <Info className="w-4 h-4 text-ayu-coral shrink-0" />,
  };

  return (
    <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-slide-up px-4 max-w-sm w-full">
      <div className="bg-ayu-card/95 backdrop-blur-xl border border-ayu-border/80 text-ayu-text px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium">
        {iconMap[toast.type || 'info']}
        <span className="flex-1">{toast.message}</span>
      </div>
    </div>
  );
};
