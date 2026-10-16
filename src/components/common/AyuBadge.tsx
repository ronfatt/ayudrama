import React from 'react';

interface AyuBadgeProps {
  children: React.ReactNode;
  variant?: 'coral' | 'gold' | 'dark' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
  className?: string;
}

export const AyuBadge: React.FC<AyuBadgeProps> = ({
  children,
  variant = 'dark',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    coral: 'bg-ayu-coral text-white font-bold shadow-sm shadow-ayu-coral/20',
    gold: 'bg-ayu-gold/20 text-ayu-gold border border-ayu-gold/40 font-semibold',
    dark: 'bg-ayu-card/90 backdrop-blur-md text-ayu-text border border-white/10 font-medium',
    outline: 'bg-transparent text-ayu-text-muted border border-ayu-border font-medium',
    subtle: 'bg-white/5 text-ayu-text-muted font-medium',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md',
    md: 'text-xs px-2.5 py-1 rounded-lg',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 leading-none select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
