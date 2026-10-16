import React from 'react';
import { DRAMAS_DATA } from '../data/dramas';
import { useApp } from '../context/AppContext';
import {
  Play,
  Bookmark,
  Check,
  Sparkles,
  ChevronLeft,
  Clock,
  CheckCircle2,
  Share2,
  Lock,
  Unlock,
} from 'lucide-react';
import { AyuBadge } from '../components/common/AyuBadge';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { DramaCard } from '../components/home/DramaCard';

interface ButiranPageProps {
  slug: string;
}

export const ButiranPage: React.FC<ButiranPageProps> = ({ slug }) => {
  const {
    navigate,
    isSaved,
    toggleSave,
    getDramaProgress,
    showToast,
    isEpisodeFree,
    isEpisodeUnlocked,
    getFreeEpisodeCount,
  } = useApp();

  const drama = DRAMAS_DATA.find((d) => d.slug === slug);

  if (!drama) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Tajuk Tidak Dijumpai</h2>
        <p className="text-sm text-ayu-text-muted mb-6">
          Maaf, drama atau filem yang anda cari tidak wujud dalam katalog kami.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-ayu-coral text-white font-bold text-sm"
        >
          Kembali ke Utama
        </button>
      </div>
    );
  }

  const saved = isSaved(drama.id);
  const progress = getDramaProgress(drama.id);

  const targetEpisodeId = progress ? progress.episodeId : drama.episodes[0]?.id || '';
  const playRoute =
    drama.format === 'movie'
      ? `/tonton-filem/${drama.slug}`
      : `/tonton/${drama.slug}/${targetEpisodeId}`;

  // Related dramas by genre
  const relatedDramas = DRAMAS_DATA.filter(
    (d) => d.id !== drama.id && d.genres.some((g) => drama.genres.includes(g))
  ).slice(0, 6);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Pautan drama telah disalin ke papan keratan', 'success');
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-16 animate-fade-in">
      {/* Top Hero Backdrop */}
      <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[540px] overflow-hidden">
        <img
          src={drama.banner || drama.poster}
          alt={drama.title}
          className="w-full h-full object-cover object-center filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ayu-bg via-ayu-bg/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ayu-bg/90 via-ayu-bg/50 to-transparent hidden sm:block" />
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-20 left-4 sm:left-8 z-20">
          <button
            onClick={() => window.history.back()}
            aria-label="Kembali"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 sm:-mt-48 relative z-20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          
          {/* Vertical Poster on Desktop */}
          <div className="w-36 xs:w-44 sm:w-56 md:w-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-ayu-card">
            <ImageWithFallback
              src={drama.poster}
              alt={drama.title}
              fallbackTitle={drama.title}
              aspectRatioClass="aspect-[9/16]"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details & Actions */}
          <div className="flex-1 space-y-4 pt-2">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {drama.isAyuOriginal && (
                <AyuBadge variant="coral" size="sm">
                  <Sparkles className="w-3 h-3" />
                  AYU ORIGINAL
                </AyuBadge>
              )}
              <AyuBadge variant="dark" size="sm">
                {drama.rating}
              </AyuBadge>
              <AyuBadge variant="subtle" size="sm">
                {drama.year}
              </AyuBadge>
              <AyuBadge variant="outline" size="sm">
                {drama.format === 'movie' ? 'Filem Penuh' : `${drama.totalEpisodes} Episod`}
              </AyuBadge>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {drama.title}
            </h1>

            {/* Tagline */}
            <p className="text-xs sm:text-sm text-ayu-gold-light italic">
              "{drama.tagline}"
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate(playRoute)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-ayu-coral hover:bg-ayu-coral-hover text-white font-bold text-sm shadow-xl shadow-ayu-coral/25 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {progress
                    ? `Sambung Ep ${progress.episodeNumber}`
                    : 'Tonton Sekarang'}
                </span>
              </button>

              <button
                onClick={() => toggleSave(drama.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm backdrop-blur-md active:scale-95 transition-all ${
                  saved
                    ? 'bg-ayu-coral/15 border-ayu-coral text-ayu-coral'
                    : 'bg-ayu-card/80 border-ayu-border text-ayu-text hover:text-white'
                }`}
              >
                {saved ? <Check className="w-4 h-4 stroke-[3]" /> : <Bookmark className="w-4 h-4" />}
                <span>{saved ? 'Dalam Senarai' : 'Tambah ke Senarai'}</span>
              </button>

              <button
                onClick={handleShare}
                aria-label="Kongsi pautan drama"
                className="p-3 rounded-xl bg-ayu-card/80 border border-ayu-border text-ayu-text-muted hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Sinopsis */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-ayu-text-subtle uppercase tracking-wider mb-1">
                Sinopsis
              </h3>
              <p className="text-xs sm:text-sm text-ayu-text leading-relaxed">
                {drama.synopsis}
              </p>
            </div>

            {/* Cast & Info Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-ayu-text-muted border-t border-ayu-border/40">
              <div>
                <span className="text-ayu-text-subtle">Barisan Pelakon: </span>
                <span className="text-white font-medium">{drama.cast.join(', ')}</span>
              </div>
              {drama.director && (
                <div>
                  <span className="text-ayu-text-subtle">Pengarah: </span>
                  <span className="text-white font-medium">{drama.director}</span>
                </div>
              )}
              <div>
                <span className="text-ayu-text-subtle">Genre: </span>
                <span className="text-white font-medium">{drama.genres.join(', ')}</span>
              </div>
              <div>
                <span className="text-ayu-text-subtle">Kategori: </span>
                <span className="text-white font-medium">{drama.category}</span>
              </div>
            </div>

          </div>
        </div>

        {/* ==================== EPISODES LIST ==================== */}
        <div className="mt-12 pt-8 border-t border-ayu-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {drama.format === 'movie' ? 'Tayangan Filem' : 'Semua Episod'}
              </h2>
              <p className="text-xs text-ayu-text-muted mt-0.5">
                {drama.format === 'movie'
                  ? 'Format layar lebar 16:9 berkualiti tinggi'
                  : `Jumlah ${drama.episodes.length} episod disediakan`}
              </p>
            </div>

            {drama.format === 'short_drama' && (
              <div className="flex items-center gap-2 text-xs bg-ayu-card border border-ayu-border/60 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-white font-medium">
                  Ep 1-{getFreeEpisodeCount(drama.totalEpisodes)} Percuma (30% Siri)
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {drama.episodes.map((ep) => {
              const isWatched = progress && progress.episodeNumber >= ep.episodeNumber;
              const isCurrent = progress && progress.episodeId === ep.id;
              const isAvailable = ep.status === 'available';
              const isFree = isEpisodeFree(ep.episodeNumber, drama.totalEpisodes);
              const isUnlocked = isEpisodeUnlocked(drama.id, ep.id, ep.episodeNumber, drama.totalEpisodes);

              return (
                <div
                  key={ep.id}
                  onClick={() => {
                    if (isAvailable) {
                      const epRoute =
                        drama.format === 'movie'
                          ? `/tonton-filem/${drama.slug}`
                          : `/tonton/${drama.slug}/${ep.id}`;
                      navigate(epRoute);
                    } else {
                      showToast('Episod ini akan ditayangkan tidak lama lagi.', 'info');
                    }
                  }}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3.5 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-ayu-coral/10 border-ayu-coral'
                      : isAvailable
                      ? 'bg-ayu-card/80 hover:bg-ayu-surface border-ayu-border/60 hover:border-ayu-border'
                      : 'bg-ayu-surface/30 border-ayu-border/30 opacity-70 cursor-not-allowed'
                  }`}
                >
                  {/* Thumbnail / Number */}
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-ayu-surface shrink-0 border border-white/5">
                    <img
                      src={ep.thumbnail || drama.poster}
                      alt={ep.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      {isAvailable ? (
                        <Play className="w-5 h-5 text-white/90 fill-current" />
                      ) : (
                        <Clock className="w-5 h-5 text-ayu-gold" />
                      )}
                    </div>
                  </div>

                  {/* Episode Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">
                        {ep.title}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isAvailable && drama.format === 'short_drama' && (
                          isFree ? (
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              Percuma
                            </span>
                          ) : isUnlocked ? (
                            <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Unlock className="w-2.5 h-2.5" /> Dibuka
                            </span>
                          ) : (
                            <span className="text-[10px] text-ayu-gold-light font-bold bg-ayu-gold/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> 50 Syiling
                            </span>
                          )
                        )}
                        {isAvailable ? (
                          <span className="text-[10px] font-mono text-ayu-text-subtle">
                            {ep.duration}
                          </span>
                        ) : (
                          <AyuBadge variant="gold" size="sm">
                            Akan Datang
                          </AyuBadge>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-ayu-text-muted line-clamp-2 mt-1">
                      {ep.synopsis}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-ayu-coral flex items-center gap-1">
                          Sedang Ditonton
                        </span>
                      )}
                      {isWatched && !isCurrent && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Telah Ditonton
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================== RELATED RECOMMENDATIONS ==================== */}
        {relatedDramas.length > 0 && (
          <div className="mt-14 pt-8 border-t border-ayu-border/60">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              Cadangan Serupa Untuk Anda
            </h2>
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {relatedDramas.map((rel) => (
                <DramaCard key={rel.id} drama={rel} aspect="9/16" />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
