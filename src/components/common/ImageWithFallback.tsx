import React, { useState } from 'react';
import { Film } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  aspectRatioClass?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'AIWAY Poster',
  fallbackTitle,
  aspectRatioClass = 'aspect-[9/16]',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={`w-full ${aspectRatioClass} bg-gradient-to-br from-ayu-surface via-ayu-card to-ayu-bg border border-ayu-border/40 rounded-xl flex flex-col items-center justify-center p-4 text-center select-none ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-ayu-coral/10 border border-ayu-coral/20 flex items-center justify-center text-ayu-coral mb-2">
          <Film className="w-5 h-5" />
        </div>
        <span className="text-xs font-semibold text-ayu-text line-clamp-2">
          {fallbackTitle || alt || 'AIWAY'}
        </span>
        <span className="text-[10px] text-ayu-coral font-bold mt-1 tracking-wider uppercase">
          AIWAY • Ayu In Wayang
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-ayu-card/80 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-ayu-coral/30 border-t-ayu-coral rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...props}
      />
    </div>
  );
};
