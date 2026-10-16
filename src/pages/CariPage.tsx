import React, { useState, useMemo } from 'react';
import { DRAMAS_DATA, POPULAR_SEARCH_TERMS } from '../data/dramas';
import { useApp } from '../context/AppContext';
import { DramaCard } from '../components/home/DramaCard';
import { Search, X, Flame, SearchX } from 'lucide-react';

export const CariPage: React.FC = () => {
  const { watchHistory } = useApp();
  const [query, setQuery] = useState<string>('');

  const trimmedQuery = query.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!trimmedQuery) return [];
    return DRAMAS_DATA.filter((drama) => {
      const matchTitle = drama.title.toLowerCase().includes(trimmedQuery);
      const matchSynopsis = drama.synopsis.toLowerCase().includes(trimmedQuery);
      const matchTagline = drama.tagline.toLowerCase().includes(trimmedQuery);
      const matchGenres = drama.genres.some((g) => g.toLowerCase().includes(trimmedQuery));
      const matchCategory = drama.category.toLowerCase().includes(trimmedQuery);
      const matchCast = drama.cast.some((c) => c.toLowerCase().includes(trimmedQuery));
      return matchTitle || matchSynopsis || matchTagline || matchGenres || matchCategory || matchCast;
    });
  }, [trimmedQuery]);

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Search Bar Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-2">
          Cari Drama & Filem
        </h1>
        <p className="text-xs sm:text-sm text-ayu-text-muted text-center mb-6">
          Masukkan tajuk drama, nama pelakon, atau genre kegemaran anda
        </p>

        {/* Input box */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-ayu-coral absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari contoh: Sheriff, Daddyku Gangster, Harum Malam, Janji..."
            autoFocus
            aria-label="Kotak carian drama dan filem"
            className="w-full bg-ayu-card border border-ayu-border focus:border-ayu-coral text-white placeholder-ayu-text-subtle text-sm sm:text-base rounded-2xl pl-12 pr-12 py-3.5 outline-none transition-colors shadow-xl"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Padam teks carian"
              className="absolute right-4 p-1 text-ayu-text-muted hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Popular Trending Suggestions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-ayu-text-subtle flex items-center gap-1 font-medium">
            <Flame className="w-3.5 h-3.5 text-ayu-gold" />
            Carian Hangat:
          </span>
          {POPULAR_SEARCH_TERMS.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="text-xs bg-ayu-card/80 hover:bg-ayu-surface text-ayu-text-muted hover:text-white border border-ayu-border/40 px-3 py-1 rounded-full transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {trimmedQuery ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">
              Hasil Carian ({searchResults.length})
            </h2>
            <span className="text-xs text-ayu-text-subtle">
              Carian: "{query}"
            </span>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {searchResults.map((drama) => (
                <DramaCard
                  key={drama.id}
                  drama={drama}
                  progress={watchHistory[drama.id]}
                  aspect={drama.aspectRatio}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-ayu-card border border-ayu-border/60 flex items-center justify-center text-ayu-text-subtle mx-auto mb-4">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Tiada Naskhah Ditemui
              </h3>
              <p className="text-xs text-ayu-text-muted mb-4 leading-relaxed">
                Kami tidak menemui apa-apa padanan untuk "{query}". Sila cuba kata kunci lain atau pilih daripada cadangan carian hangat di atas.
              </p>
              <button
                onClick={() => setQuery('')}
                className="px-5 py-2 rounded-xl bg-ayu-surface hover:bg-ayu-card border border-ayu-border text-xs font-semibold text-white transition-colors"
              >
                Kosongkan Carian
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty Query Showcase: Show Trending */
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ayu-text-subtle mb-4">
            Cadangan Drama Untuk Anda
          </h2>
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {DRAMAS_DATA.slice(0, 6).map((drama) => (
              <DramaCard
                key={drama.id}
                drama={drama}
                progress={watchHistory[drama.id]}
                aspect="9/16"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
