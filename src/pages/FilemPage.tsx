import React, { useState } from 'react';
import { DRAMAS_DATA } from '../data/dramas';
import { useApp } from '../context/AppContext';
import { DramaCard } from '../components/home/DramaCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { AyuBadge } from '../components/common/AyuBadge';
import {
  Clapperboard,
  Play,
  Info,
  Sparkles,
  ExternalLink,
  Film,
  Layers,
  LayoutGrid
} from 'lucide-react';

export const FilemPage: React.FC = () => {
  const { watchHistory, navigate } = useApp();
  const [activeGenre, setActiveGenre] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'poster' | 'wide'>('poster');

  const movieDramas = DRAMAS_DATA.filter((d) => d.format === 'movie');

  // Spotlight movie: Sheriff or first featured movie
  const spotlightMovie = movieDramas.find((m) => m.slug === 'sheriff-narko-integriti') || movieDramas[0];

  const genres = ['Semua', 'Aksi & Debaran', 'Seram & Mistik', 'Drama & Kekeluargaan', 'Komedi'];

  const filteredMovies = movieDramas.filter((movie) => {
    if (activeGenre === 'Semua') return true;
    if (activeGenre === 'Aksi & Debaran') {
      return movie.genres.includes('Aksi') || movie.genres.includes('Jenayah') || movie.genres.includes('Warisan');
    }
    if (activeGenre === 'Seram & Mistik') {
      return movie.genres.includes('Misteri') || movie.genres.includes('Thriller');
    }
    if (activeGenre === 'Drama & Kekeluargaan') {
      return movie.genres.includes('Drama') || movie.genres.includes('Kekeluargaan') || movie.genres.includes('Cinta');
    }
    if (activeGenre === 'Komedi') {
      return movie.genres.includes('Komedi');
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Official Partnership Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-ayu-card via-ayu-surface to-ayu-card border border-ayu-coral/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ayu-coral/10 border border-ayu-coral/30 flex items-center justify-center text-ayu-coral flex-shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ayu-coral uppercase tracking-wider">
                Koleksi Sinema Rasmi
              </span>
              <AyuBadge variant="gold" size="sm">
                D'Ayu Pictures
              </AyuBadge>
            </div>
            <p className="text-xs text-ayu-text-muted mt-0.5">
              Karya filem pawagam terbitan D'Ayu Pictures dengan kualiti definisi tinggi dan audio sinematik.
            </p>
          </div>
        </div>

        <a
          href="https://d.ayupictures.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-ayu-surface hover:bg-ayu-card text-[11px] font-semibold text-white/90 hover:text-white border border-ayu-border transition-colors self-start sm:self-auto"
        >
          <span>Laman Rasmi D'Ayu Pictures</span>
          <ExternalLink className="w-3.5 h-3.5 text-ayu-coral" />
        </a>
      </div>

      {/* Featured Spotlight Film (Sheriff: Narko Integriti) */}
      {spotlightMovie && (
        <div className="relative mb-8 rounded-2xl sm:rounded-3xl overflow-hidden border border-ayu-border/60 bg-ayu-card shadow-2xl">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[460px] w-full">
            <ImageWithFallback
              src={spotlightMovie.banner || spotlightMovie.poster}
              alt={spotlightMovie.title}
              aspectRatioClass="aspect-[21/9]"
              className="w-full h-full object-cover object-top"
            />
            {/* Gradient Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-[#0A0C10]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0C10] via-[#0A0C10]/70 to-transparent" />

            {/* Spotlight Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 flex flex-col justify-end max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <AyuBadge variant="coral" size="sm">
                  <Sparkles className="w-3 h-3" />
                  Karya Pilihan Utama
                </AyuBadge>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/60 text-white border border-white/10">
                  {spotlightMovie.rating}
                </span>
                <span className="text-xs text-white/80 font-medium">
                  {spotlightMovie.year} • {spotlightMovie.episodes[0]?.duration || '120 min'}
                </span>
                {spotlightMovie.director && (
                  <span className="text-xs text-ayu-gold-light hidden sm:inline">
                    Arahan: {spotlightMovie.director}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                {spotlightMovie.title}
              </h2>

              <p className="text-xs sm:text-sm text-ayu-text-muted mt-2 line-clamp-2 sm:line-clamp-3">
                {spotlightMovie.synopsis}
              </p>

              {/* Cast Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[11px] text-ayu-text-subtle">
                <span className="font-semibold text-white/80">Dibintangi:</span>
                {spotlightMovie.cast.join(', ')}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => navigate(`/tonton-filem/${spotlightMovie.slug}`)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ayu-coral hover:bg-ayu-coral-hover text-white text-xs sm:text-sm font-bold shadow-lg shadow-ayu-coral/25 transition-all transform hover:scale-[1.02]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Tonton Filem Penuh</span>
                </button>
                <button
                  onClick={() => navigate(`/butiran/${spotlightMovie.slug}`)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ayu-surface/90 hover:bg-ayu-card text-white text-xs sm:text-sm font-semibold border border-white/10 transition-colors"
                >
                  <Info className="w-4 h-4" />
                  <span>Maklumat Lanjut</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Header & View Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clapperboard className="w-5 h-5 text-ayu-coral" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Semua Filem ({filteredMovies.length})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-ayu-text-muted">
            Pilihan karya tayangan pawagam dan telefilem berkualiti tinggi dari D'Ayu Pictures.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-ayu-card/80 border border-ayu-border/60 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('poster')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'poster'
                ? 'bg-ayu-coral text-white shadow-sm'
                : 'text-ayu-text-muted hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Poster Pawagam</span>
          </button>
          <button
            onClick={() => setViewMode('wide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'wide'
                ? 'bg-ayu-coral text-white shadow-sm'
                : 'text-ayu-text-muted hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Skrin Lebar 16:9</span>
          </button>
        </div>
      </div>

      {/* Genre Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {genres.map((g) => {
          const isSelected = activeGenre === g;
          return (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-ayu-coral text-white shadow-md shadow-ayu-coral/20'
                  : 'bg-ayu-card/80 hover:bg-ayu-surface text-ayu-text-muted hover:text-white border border-ayu-border/60'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Movies Grid */}
      {viewMode === 'poster' ? (
        // Theatrical Portrait Posters Grid (Shows full original 1005x1454 posters without cropping)
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="flex flex-col">
              <DramaCard
                drama={movie}
                progress={watchHistory[movie.id]}
                aspect="9/16"
              />
              <div className="mt-1 text-[11px] text-ayu-text-subtle flex items-center justify-between px-0.5">
                <span>{movie.director ? `Arahan: ${movie.director}` : movie.year}</span>
                <span className="text-ayu-gold-light">{movie.episodes[0]?.duration}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Wide 16:9 Cinema Cards Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="flex flex-col">
              <DramaCard
                drama={movie}
                progress={watchHistory[movie.id]}
                aspect="16/9"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
