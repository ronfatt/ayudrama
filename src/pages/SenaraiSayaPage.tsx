import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DramaCard } from '../components/home/DramaCard';
import { Bookmark, History, Trash2, Compass, Play } from 'lucide-react';

export const SenaraiSayaPage: React.FC = () => {
  const {
    savedDramas,
    historyDramas,
    watchHistory,
    clearHistory,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'simpanan' | 'sejarah'>('simpanan');

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Senarai Saya
          </h1>
          <p className="text-xs sm:text-sm text-ayu-text-muted mt-1">
            Uruskan drama kegemaran dan rekod tontonan peribadi anda
          </p>
        </div>

        {/* Action Button for History */}
        {activeTab === 'sejarah' && historyDramas.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Adakah anda pasti mahu mengosongkan semua sejarah tontonan?')) {
                clearHistory();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ayu-card hover:bg-rose-950/40 border border-ayu-border hover:border-rose-800 text-ayu-text-muted hover:text-rose-400 text-xs font-semibold transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Kosongkan Sejarah</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-ayu-border/60 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('simpanan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'simpanan'
              ? 'bg-ayu-coral text-white shadow-md shadow-ayu-coral/20'
              : 'bg-ayu-card/80 text-ayu-text-muted hover:text-white border border-ayu-border/40'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Simpanan Saya ({savedDramas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sejarah')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'sejarah'
              ? 'bg-ayu-coral text-white shadow-md shadow-ayu-coral/20'
              : 'bg-ayu-card/80 text-ayu-text-muted hover:text-white border border-ayu-border/40'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Sejarah Tontonan ({historyDramas.length})</span>
        </button>
      </div>

      {/* Tab 1: Simpanan Saya (Saved Watchlist) */}
      {activeTab === 'simpanan' && (
        <div>
          {savedDramas.length > 0 ? (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {savedDramas.map((drama) => (
                <DramaCard
                  key={drama.id}
                  drama={drama}
                  progress={watchHistory[drama.id]}
                  aspect="9/16"
                />
              ))}
            </div>
          ) : (
            /* Empty Saved List */
            <div className="py-20 text-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-ayu-card border border-ayu-border flex items-center justify-center text-ayu-text-subtle mx-auto mb-4">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Senarai Simpanan Kosong
              </h3>
              <p className="text-xs text-ayu-text-muted mb-6 leading-relaxed">
                Anda belum menyimpan sebarang drama atau filem. Tekan butang "+ Senarai" pada mana-mana poster untuk menyimpannya di sini.
              </p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-ayu-coral hover:bg-ayu-coral-hover text-white text-xs font-bold transition-all shadow-lg shadow-ayu-coral/25"
              >
                <Compass className="w-4 h-4" />
                <span>Terokai Drama Sekarang</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Sejarah Tontonan (Watch History) */}
      {activeTab === 'sejarah' && (
        <div>
          {historyDramas.length > 0 ? (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {historyDramas.map(({ drama, progress }) => (
                <DramaCard
                  key={drama.id}
                  drama={drama}
                  progress={progress}
                  aspect="9/16"
                />
              ))}
            </div>
          ) : (
            /* Empty History */
            <div className="py-20 text-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-ayu-card border border-ayu-border flex items-center justify-center text-ayu-text-subtle mx-auto mb-4">
                <History className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Tiada Sejarah Tontonan
              </h3>
              <p className="text-xs text-ayu-text-muted mb-6 leading-relaxed">
                Drama atau filem yang anda mainkan akan direkodkan di sini secara automatik bersama kemajuan episod.
              </p>
              <button
                onClick={() => navigate('/drama-pendek')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-ayu-coral hover:bg-ayu-coral-hover text-white text-xs font-bold transition-all shadow-lg shadow-ayu-coral/25"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Mula Menonton</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
