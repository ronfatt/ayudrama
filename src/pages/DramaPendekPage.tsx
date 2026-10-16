import React, { useState } from 'react';
import { DRAMAS_DATA } from '../data/dramas';
import { useApp } from '../context/AppContext';
import { DramaCard } from '../components/home/DramaCard';
import { Sparkles, PlaySquare } from 'lucide-react';

export const DramaPendekPage: React.FC = () => {
  const { watchHistory } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const shortDramas = DRAMAS_DATA.filter((d) => d.format === 'short_drama');

  const categories = [
    'Semua',
    'Ayu Originals',
    'Cinta & Romantik',
    'Kekeluargaan',
    'Misteri & Seram',
    'Aksi & Silat',
  ];

  const filteredDramas = shortDramas.filter((drama) => {
    if (activeCategory === 'Semua') return true;
    if (activeCategory === 'Ayu Originals') return drama.isAyuOriginal;
    if (activeCategory === 'Cinta & Romantik')
      return drama.genres.includes('Cinta') || drama.genres.includes('Romantik');
    if (activeCategory === 'Kekeluargaan')
      return drama.genres.includes('Keluarga') || drama.genres.includes('Kekeluargaan');
    if (activeCategory === 'Misteri & Seram')
      return drama.genres.includes('Misteri') || drama.genres.includes('Seram');
    if (activeCategory === 'Aksi & Silat')
      return drama.genres.includes('Aksi') || drama.genres.includes('Silat');
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <PlaySquare className="w-5 h-5 text-ayu-coral" />
          <span className="text-xs font-bold text-ayu-coral uppercase tracking-wider">
            Format 9:16 Pantas
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Drama Pendek
        </h1>
        <p className="text-xs sm:text-sm text-ayu-text-muted mt-1 max-w-xl">
          Siri drama pendek tempatan dengan ketegangan cerita setiap minit. Tonton secara menegak dan leret terus ke episod seterusnya.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-ayu-coral text-white shadow-md shadow-ayu-coral/20'
                  : 'bg-ayu-card/80 hover:bg-ayu-surface text-ayu-text-muted hover:text-white border border-ayu-border/60'
              }`}
            >
              {cat === 'Ayu Originals' && (
                <Sparkles className="w-3 h-3 inline mr-1 text-ayu-gold-light" />
              )}
              {cat}
            </button>
          );
        })}
      </div>

      {/* Drama Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {filteredDramas.map((drama) => (
          <DramaCard
            key={drama.id}
            drama={drama}
            progress={watchHistory[drama.id]}
            aspect="9/16"
          />
        ))}
      </div>
    </div>
  );
};
