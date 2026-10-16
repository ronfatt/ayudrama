import React from 'react';
import type { Drama } from '../../types/drama';
import { useApp } from '../../context/AppContext';
import { Play, Info, Plus, Check, Flame, Sparkles } from 'lucide-react';
import { AyuBadge } from '../common/AyuBadge';

interface HeroBannerProps {
  drama: Drama;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ drama }) => {
  const { navigate, isSaved, toggleSave, getDramaProgress } = useApp();

  const saved = isSaved(drama.id);
  const progress = getDramaProgress(drama.id);

  // Resume or start
  const playRoute =
    drama.format === 'movie'
      ? `/tonton-filem/${drama.slug}`
      : `/tonton/${drama.slug}/${progress ? progress.episodeId : drama.episodes[0]?.id || ''}`;

  return (
    <div className="relative w-full min-h-[520px] sm:min-h-[580px] lg:min-h-[660px] flex items-end overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 select-none">
        <img
          src={drama.banner || drama.poster}
          alt={drama.title}
          className="w-full h-full object-cover object-center transform scale-105 duration-1000 ease-out"
        />
        {/* Cinematic Multi-layer Gradient Overlays */}
        {/* Bottom fade into page background */}
        <div className="absolute inset-0 bg-gradient-to-t from-ayu-bg via-ayu-bg/60 to-transparent" />
        {/* Left fade for desktop text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-ayu-bg via-ayu-bg/70 to-transparent hidden sm:block" />
        {/* Top subtle fade for navbar contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 pt-32 w-full">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          {/* Badges Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {drama.isAyuOriginal && (
              <AyuBadge variant="coral" size="sm">
                <Sparkles className="w-3 h-3" />
                AYU ORIGINAL
              </AyuBadge>
            )}
            {drama.isTrending && (
              <AyuBadge variant="gold" size="sm">
                <Flame className="w-3 h-3" />
                TRENDING MINGGU INI
              </AyuBadge>
            )}
            <AyuBadge variant="dark" size="sm">
              {drama.rating}
            </AyuBadge>
            <AyuBadge variant="subtle" size="sm">
              {drama.format === 'movie' ? 'Filem' : `${drama.totalEpisodes} Episod`}
            </AyuBadge>
            <span className="text-xs text-ayu-text-muted font-medium ml-1">
              {drama.year}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-md">
            {drama.title}
          </h1>

          {/* Tagline / Hook */}
          <p className="text-sm sm:text-base text-ayu-gold-light font-medium tracking-wide">
            "{drama.tagline}"
          </p>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-ayu-text-muted line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
            {drama.synopsis}
          </p>

          {/* Genres */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {drama.genres.map((g) => (
              <span
                key={g}
                className="text-[11px] text-ayu-text-muted/80 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {/* Primary Watch Button */}
            <button
              onClick={() => navigate(playRoute)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-ayu-coral hover:bg-ayu-coral-hover text-white font-bold text-sm shadow-xl shadow-ayu-coral/25 transform active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{progress ? `Sambung Ep ${progress.episodeNumber}` : 'Tonton Sekarang'}</span>
            </button>

            {/* Details Button */}
            <button
              onClick={() => navigate(`/butiran/${drama.slug}`)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-ayu-card/80 hover:bg-ayu-card border border-ayu-border hover:border-ayu-border/80 text-ayu-text font-semibold text-sm backdrop-blur-md transition-all active:scale-95"
            >
              <Info className="w-4 h-4 text-ayu-text-muted" />
              <span>Lihat Butiran</span>
            </button>

            {/* Add to List Toggle */}
            <button
              onClick={() => toggleSave(drama.id)}
              aria-label={saved ? 'Keluarkan dari Senarai' : 'Tambah ke Senarai'}
              className={`p-3 rounded-xl border backdrop-blur-md transition-all active:scale-95 ${
                saved
                  ? 'bg-ayu-coral/15 border-ayu-coral text-ayu-coral'
                  : 'bg-ayu-card/80 border-ayu-border text-ayu-text-muted hover:text-white'
              }`}
            >
              {saved ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
