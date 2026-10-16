import React from 'react';
import type { Drama, WatchProgress } from '../../types/drama';
import { useApp } from '../../context/AppContext';
import { Play, Sparkles, Plus, Check } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { AyuBadge } from '../common/AyuBadge';

interface DramaCardProps {
  drama: Drama;
  progress?: WatchProgress;
  aspect?: '9/16' | '16/9';
  showCategoryTag?: boolean;
}

export const DramaCard: React.FC<DramaCardProps> = ({
  drama,
  progress,
  aspect = drama.aspectRatio || '9/16',
  showCategoryTag = false,
}) => {
  const { navigate, isSaved, toggleSave } = useApp();
  const saved = isSaved(drama.id);

  const targetEpisodeId = progress ? progress.episodeId : drama.episodes[0]?.id || '';
  const playRoute =
    drama.format === 'movie'
      ? `/tonton-filem/${drama.slug}`
      : `/tonton/${drama.slug}/${targetEpisodeId}`;

  const percentWatched = progress && progress.totalSeconds > 0
    ? Math.min(100, Math.round((progress.progressSeconds / progress.totalSeconds) * 100))
    : 0;

  const isVertical = aspect === '9/16';

  return (
    <div className="group relative flex flex-col cursor-pointer select-none">
      {/* Card Poster Container */}
      <div
        onClick={() => navigate(playRoute)}
        className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-ayu-card border border-ayu-border/40 group-hover:border-ayu-coral/50 group-hover:shadow-xl group-hover:shadow-ayu-coral/10 transition-all duration-300 transform group-hover:-translate-y-1 ${
          isVertical ? 'aspect-[9/16]' : 'aspect-[16/9]'
        }`}
      >
        <ImageWithFallback
          src={isVertical ? drama.poster : drama.banner || drama.poster}
          alt={drama.title}
          fallbackTitle={drama.title}
          aspectRatioClass={isVertical ? 'aspect-[9/16]' : 'aspect-[16/9]'}
          className="w-full h-full object-cover transform duration-500 group-hover:scale-105"
        />

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {drama.isAyuOriginal ? (
            <AyuBadge variant="coral" size="sm">
              <Sparkles className="w-2.5 h-2.5" />
              ORIGINAL
            </AyuBadge>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-white/90 border border-white/10">
              {drama.rating}
            </span>
          </div>
        </div>

        {/* Center Hover Play Button (Desktop) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-ayu-coral text-white flex items-center justify-center shadow-lg shadow-ayu-coral/50 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Quick Save Button (Top Right on hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSave(drama.id);
          }}
          aria-label={saved ? 'Keluarkan dari Senarai' : 'Simpan drama'}
          className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            saved
              ? 'bg-ayu-coral text-white shadow-md'
              : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80'
          } ${saved ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 sm:opacity-0 max-sm:opacity-80'}`}
        >
          {saved ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4" />}
        </button>

        {/* Progress Bar (if watched) */}
        {progress && percentWatched > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-ayu-coral"
              style={{ width: `${percentWatched}%` }}
            />
          </div>
        )}

        {/* Bottom Episode / Duration Overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/80 pointer-events-none">
          <span className="font-medium bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
            {drama.format === 'movie' ? 'Filem' : `${drama.totalEpisodes} Episod`}
          </span>
          {progress && (
            <span className="text-[10px] text-ayu-gold-light font-semibold bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
              Ep {progress.episodeNumber}
            </span>
          )}
        </div>
      </div>

      {/* Card Info Below Poster */}
      <div className="mt-2.5 px-0.5">
        <div className="flex items-start justify-between gap-1">
          <h3
            onClick={() => navigate(`/butiran/${drama.slug}`)}
            className="text-sm font-bold text-white group-hover:text-ayu-coral transition-colors line-clamp-1"
          >
            {drama.title}
          </h3>
        </div>

        <p className="text-[11px] text-ayu-text-muted line-clamp-1 mt-0.5">
          {showCategoryTag ? drama.category : drama.tagline}
        </p>

        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[10px] text-ayu-text-subtle">{drama.year}</span>
          <span className="text-[10px] text-ayu-text-subtle">•</span>
          <span className="text-[10px] text-ayu-text-subtle line-clamp-1">
            {drama.genres.slice(0, 2).join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
};
