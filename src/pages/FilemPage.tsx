import React, { useState } from 'react';
import { DRAMAS_DATA } from '../data/dramas';
import { useApp } from '../context/AppContext';
import { DramaCard } from '../components/home/DramaCard';
import { Clapperboard } from 'lucide-react';

export const FilemPage: React.FC = () => {
  const { watchHistory } = useApp();
  const [activeGenre, setActiveGenre] = useState<string>('Semua');

  const movieDramas = DRAMAS_DATA.filter((d) => d.format === 'movie');

  const genres = ['Semua', 'Aksi', 'Romantik', 'Jenayah & Noir'];

  const filteredMovies = movieDramas.filter((movie) => {
    if (activeGenre === 'Semua') return true;
    if (activeGenre === 'Aksi') return movie.genres.includes('Aksi');
    if (activeGenre === 'Romantik') return movie.genres.includes('Romantik');
    if (activeGenre === 'Jenayah & Noir') return movie.genres.includes('Jenayah') || movie.genres.includes('Noir');
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Clapperboard className="w-5 h-5 text-ayu-coral" />
          <span className="text-xs font-bold text-ayu-coral uppercase tracking-wider">
            Format 16:9 Sinematik
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Koleksi Filem & Sinema
        </h1>
        <p className="text-xs sm:text-sm text-ayu-text-muted mt-1 max-w-xl">
          Filem tempatan penuh dengan pengalaman audio visual skrin lebar 16:9 dan sokongan sari kata Bahasa Melayu.
        </p>
      </div>

      {/* Genre Filters */}
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
    </div>
  );
};
