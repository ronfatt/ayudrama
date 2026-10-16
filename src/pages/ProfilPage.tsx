import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DRAMAS_DATA } from '../data/dramas';
import { DramaCard } from '../components/home/DramaCard';
import {
  Coins,
  History,
  Bookmark,
  Unlock,
  Receipt,
  PlusCircle,
  Gift,
  Trash2,
  Sparkles,
  ChevronRight,
  Info,
  Play,
} from 'lucide-react';
import { AyuBadge } from '../components/common/AyuBadge';
import { AdBanner } from '../components/common/AdBanner';

export const ProfilPage: React.FC = () => {
  const {
    userProfile,
    coinsBalance,
    openTopUp,
    claimDailyBonus,
    savedDramas,
    historyDramas,
    clearHistory,
    unlockedEpisodes,
    transactions,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sejarah' | 'simpanan' | 'dibuka' | 'transaksi'>('sejarah');

  // Parse unlocked episodes list to resolve drama & episode objects
  const resolvedUnlockedEpisodes = unlockedEpisodes
    .map((key) => {
      const [dramaId, episodeId] = key.split(':');
      const drama = DRAMAS_DATA.find((d) => d.id === dramaId);
      const episode = drama?.episodes.find((e) => e.id === episodeId);
      if (!drama || !episode) return null;
      return { drama, episode };
    })
    .filter((item): item is { drama: typeof DRAMAS_DATA[0]; episode: typeof DRAMAS_DATA[0]['episodes'][0] } => item !== null);

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* ==================== USER PROFILE HEADER ==================== */}
      <div className="bg-gradient-to-r from-ayu-card via-ayu-surface/80 to-ayu-card border border-ayu-border/70 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-6">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-ayu-coral/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-32 w-60 h-60 bg-ayu-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* User Info */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-ayu-coral/50 shadow-xl bg-ayu-surface">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-ayu-coral text-white p-1 rounded-lg shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {userProfile.name}
                </h1>
                <AyuBadge variant="gold" size="sm">
                  {userProfile.memberTier}
                </AyuBadge>
              </div>

              <p className="text-xs text-ayu-text-muted mt-1">
                ID Pengguna: <span className="font-mono text-white/90">{userProfile.id}</span>
              </p>
              <p className="text-[11px] text-ayu-text-subtle mt-0.5">
                Ahli sejak: {userProfile.joinDate} • Pelan Penstriman Bebas
              </p>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="bg-ayu-card/90 border border-ayu-gold/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 min-w-[280px]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-ayu-text-subtle block">
                Baki Ayu Syiling
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="w-6 h-6 text-ayu-gold-light fill-current" />
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {coinsBalance}
                </span>
                <span className="text-xs text-ayu-gold-light font-medium self-end mb-1">
                  Syiling
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={openTopUp}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-ayu-coral hover:bg-ayu-coral-hover text-white text-xs font-bold shadow-lg shadow-ayu-coral/25 transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Nilai</span>
              </button>

              <button
                onClick={claimDailyBonus}
                title="Tuntut ganjaran harian 100 Syiling percuma"
                className="p-2.5 rounded-xl bg-ayu-surface hover:bg-white/10 border border-ayu-border text-ayu-gold transition-colors active:scale-95"
              >
                <Gift className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 30% Policy Explainer Bar */}
        <div className="mt-6 pt-4 border-t border-ayu-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-ayu-text-muted">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-ayu-coral shrink-0" />
            <span>
              <strong className="text-white">Dasar Percuma 30%: </strong>
              Setiap siri memberikan 30% episod pertama secara percuma. Episod seterusnya ditebus menggunakan 50 Syiling setiap episod.
            </span>
          </div>
          <button
            onClick={openTopUp}
            className="text-ayu-coral hover:underline font-semibold flex items-center gap-1 self-start sm:self-auto shrink-0"
          >
            <span>Ketahui Pakej Jimat</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* D'Ayu Pictures 5s Rewarded Ad Zone */}
      <AdBanner variant="compact" className="mb-6" />

      {/* ==================== STATS ROW ==================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-ayu-card border border-ayu-border/60 rounded-2xl p-4">
          <span className="text-xs text-ayu-text-subtle block">Sejarah Ditonton</span>
          <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">
            {historyDramas.length} Tajuk
          </span>
        </div>

        <div className="bg-ayu-card border border-ayu-border/60 rounded-2xl p-4">
          <span className="text-xs text-ayu-text-subtle block">Tersimpan</span>
          <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">
            {savedDramas.length} Siri
          </span>
        </div>

        <div className="bg-ayu-card border border-ayu-border/60 rounded-2xl p-4">
          <span className="text-xs text-ayu-text-subtle block">Episod Dibuka</span>
          <span className="text-xl sm:text-2xl font-bold text-ayu-coral mt-1 block">
            {unlockedEpisodes.length} Episod
          </span>
        </div>

        <div className="bg-ayu-card border border-ayu-border/60 rounded-2xl p-4">
          <span className="text-xs text-ayu-text-subtle block">Jumlah Transaksi</span>
          <span className="text-xl sm:text-2xl font-bold text-ayu-gold-light mt-1 block">
            {transactions.length} Rekod
          </span>
        </div>
      </div>

      {/* ==================== TABS BAR ==================== */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-ayu-border/60 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('sejarah')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'sejarah'
              ? 'bg-ayu-coral text-white shadow-md shadow-ayu-coral/20'
              : 'bg-ayu-card/80 text-ayu-text-muted hover:text-white border border-ayu-border/40'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Sejarah Tontonan ({historyDramas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('simpanan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'simpanan'
              ? 'bg-ayu-coral text-white shadow-md shadow-ayu-coral/20'
              : 'bg-ayu-card/80 text-ayu-text-muted hover:text-white border border-ayu-border/40'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Simpanan Saya ({savedDramas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dibuka')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'dibuka'
              ? 'bg-ayu-coral text-white shadow-md shadow-ayu-coral/20'
              : 'bg-ayu-card/80 text-ayu-text-muted hover:text-white border border-ayu-border/40'
          }`}
        >
          <Unlock className="w-4 h-4" />
          <span>Episod Dibuka ({unlockedEpisodes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transaksi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'transaksi'
              ? 'bg-ayu-coral text-white shadow-md shadow-ayu-coral/20'
              : 'bg-ayu-card/80 text-ayu-text-muted hover:text-white border border-ayu-border/40'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Rekod Syiling ({transactions.length})</span>
        </button>
      </div>

      {/* ==================== TAB 1: SEJARAH TONTONAN ==================== */}
      {activeTab === 'sejarah' && (
        <div>
          {historyDramas.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-ayu-text-muted">
                  Menunjukkan semua drama yang pernah anda tonton berserta peratusan episod.
                </span>
                <button
                  onClick={() => {
                    if (window.confirm('Adakah anda pasti mahu mengosongkan semua sejarah tontonan?')) {
                      clearHistory();
                    }
                  }}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan</span>
                </button>
              </div>

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
            </div>
          ) : (
            <div className="py-16 text-center max-w-sm mx-auto">
              <History className="w-12 h-12 text-ayu-text-subtle mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Tiada Sejarah Tontonan</h3>
              <p className="text-xs text-ayu-text-muted mb-4">
                Mulakan tontonan drama pendek kegemaran anda hari ini.
              </p>
              <button
                onClick={() => navigate('/drama-pendek')}
                className="px-5 py-2.5 bg-ayu-coral text-white text-xs font-bold rounded-xl shadow-lg"
              >
                Mula Menonton
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: SIMPANAN SAYA ==================== */}
      {activeTab === 'simpanan' && (
        <div>
          {savedDramas.length > 0 ? (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {savedDramas.map((drama) => (
                <DramaCard key={drama.id} drama={drama} aspect="9/16" />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center max-w-sm mx-auto">
              <Bookmark className="w-12 h-12 text-ayu-text-subtle mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Tiada Drama Disimpan</h3>
              <p className="text-xs text-ayu-text-muted mb-4">
                Tekan ikon penanda pada mana-mana drama untuk menyimpannya ke senarai ini.
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2.5 bg-ayu-coral text-white text-xs font-bold rounded-xl shadow-lg"
              >
                Terokai Katalog
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 3: EPISOD DIBUKA ==================== */}
      {activeTab === 'dibuka' && (
        <div>
          {resolvedUnlockedEpisodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resolvedUnlockedEpisodes.map(({ drama, episode }) => (
                <div
                  key={`${drama.id}:${episode.id}`}
                  onClick={() => navigate(`/tonton/${drama.slug}/${episode.id}`)}
                  className="bg-ayu-card hover:bg-ayu-surface border border-ayu-border/60 hover:border-ayu-coral/40 p-4 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-ayu-surface shrink-0">
                      <img
                        src={episode.thumbnail || drama.poster}
                        alt={episode.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">
                          {drama.title}
                        </span>
                        <AyuBadge variant="coral" size="sm">
                          Ep {episode.episodeNumber}
                        </AyuBadge>
                      </div>
                      <p className="text-[11px] text-ayu-text-muted truncate mt-0.5">
                        {episode.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" />
                      Dibuka
                    </span>
                    <button
                      aria-label="Tonton sekarang"
                      className="p-2 rounded-xl bg-ayu-coral text-white hover:bg-ayu-coral-hover"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center max-w-sm mx-auto">
              <Unlock className="w-12 h-12 text-ayu-text-subtle mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Belum Ada Episod Dibuka</h3>
              <p className="text-xs text-ayu-text-muted mb-4">
                Episod premium yang anda tebus menggunakan Syiling akan dipaparkan di sini.
              </p>
              <button
                onClick={() => navigate('/drama-pendek')}
                className="px-5 py-2.5 bg-ayu-coral text-white text-xs font-bold rounded-xl shadow-lg"
              >
                Pilih Drama Untuk Ditonton
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 4: REKOD TRANSAKSI ==================== */}
      {activeTab === 'transaksi' && (
        <div className="bg-ayu-card border border-ayu-border/60 rounded-3xl p-5 overflow-hidden">
          {transactions.length > 0 ? (
            <div className="divide-y divide-ayu-border/40">
              {transactions.map((tx) => {
                const isPositive = tx.amount > 0;
                const formattedDate = new Date(tx.timestamp).toLocaleString('ms-MY', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={tx.id}
                    className="py-3.5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{tx.title}</span>
                        {tx.paymentMethod && (
                          <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-ayu-text-subtle">
                            {tx.paymentMethod}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ayu-text-muted mt-0.5">
                        {tx.description}
                      </p>
                      <span className="text-[10px] text-ayu-text-subtle font-mono mt-1 block">
                        {formattedDate}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-sm font-extrabold font-mono flex items-center gap-1 ${
                          isPositive ? 'text-emerald-400' : 'text-ayu-coral'
                        }`}
                      >
                        {isPositive ? `+${tx.amount}` : tx.amount} Syiling
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-ayu-text-muted">
              Tiada rekod transaksi ditemui.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
