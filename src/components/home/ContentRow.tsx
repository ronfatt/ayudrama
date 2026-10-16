import React, { useRef } from 'react';
import type { Drama, WatchProgress } from '../../types/drama';
import { DramaCard } from './DramaCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentRowProps {
  title: string;
  subtitle?: string;
  dramas: Drama[];
  progressMap?: Record<string, WatchProgress>;
  aspect?: '9/16' | '16/9';
  onViewAll?: () => void;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  subtitle,
  dramas,
  progressMap,
  aspect = '9/16',
  onViewAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!dramas || dramas.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const cardWidthClass =
    aspect === '9/16'
      ? 'w-[140px] xs:w-[160px] sm:w-[190px] md:w-[210px] shrink-0'
      : 'w-[240px] xs:w-[270px] sm:w-[320px] md:w-[360px] shrink-0';

  return (
    <section className="relative py-4 sm:py-6">
      {/* Row Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h2>
          {subtitle && (
            <p className="text-xs text-ayu-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-semibold text-ayu-coral hover:text-ayu-coral-hover transition-colors mr-2"
            >
              Lihat Semua
            </button>
          )}
          {/* Desktop Arrow Controls */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              aria-label="Tatal ke kiri"
              className="p-1.5 rounded-full bg-ayu-card/80 hover:bg-ayu-surface border border-ayu-border text-ayu-text-muted hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Tatal ke kanan"
              className="p-1.5 rounded-full bg-ayu-card/80 hover:bg-ayu-surface border border-ayu-border text-ayu-text-muted hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-2"
      >
        {dramas.map((drama) => (
          <div key={drama.id} className={cardWidthClass}>
            <DramaCard
              drama={drama}
              progress={progressMap ? progressMap[drama.id] : undefined}
              aspect={aspect}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
