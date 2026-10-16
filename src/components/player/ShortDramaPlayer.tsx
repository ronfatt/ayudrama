import React, { useState, useEffect, useRef } from 'react';
import type { Drama, Episode } from '../../types/drama';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Heart,
  Bookmark,
  ListVideo,
  RotateCcw,
  Sparkles,
  X,
  Clock,
  AlertTriangle,
  PlayCircle,
  Lock,
  Unlock,
  Coins,
  PlusCircle,
  Flame,
} from 'lucide-react';
import { AyuBadge } from '../common/AyuBadge';
import { EPISODE_UNLOCK_COST } from '../../data/packages';

interface ShortDramaPlayerProps {
  drama: Drama;
  initialEpisodeId?: string;
  onBack: () => void;
}

export const ShortDramaPlayer: React.FC<ShortDramaPlayerProps> = ({
  drama,
  initialEpisodeId,
  onBack,
}) => {
  const {
    isSaved,
    toggleSave,
    saveWatchProgress,
    getDramaProgress,
    autoplayNext,
    showToast,
    // Paywall & Coins
    coinsBalance,
    isEpisodeFree,
    isEpisodeUnlocked,
    getFreeEpisodeCount,
    unlockEpisode,
    unlockAllEpisodes,
    openTopUp,
  } = useApp();

  const freeCount = getFreeEpisodeCount(drama.totalEpisodes);

  // Find saved progress if initialEpisodeId is not explicitly given
  const savedProgress = getDramaProgress(drama.id);
  const startingEpisodeId =
    initialEpisodeId ||
    savedProgress?.episodeId ||
    drama.episodes[0]?.id;

  const currentEpIndex = Math.max(
    0,
    drama.episodes.findIndex((e) => e.id === startingEpisodeId)
  );

  const [activeIndex, setActiveIndex] = useState<number>(currentEpIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showCenterIcon, setShowCenterIcon] = useState<boolean>(false);
  const [centerIconType, setCenterIconType] = useState<'play' | 'pause'>('play');
  const [isEpisodeDrawerOpen, setIsEpisodeDrawerOpen] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(1420 + activeIndex * 37);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [showNextCountdown, setShowNextCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const lastWheelTime = useRef<number>(0);

  const currentEpisode: Episode = drama.episodes[activeIndex] || drama.episodes[0];
  const isSavedItem = isSaved(drama.id);

  // Check if current episode is unlocked (either within 30% free or purchased with coins)
  const isCurrentUnlocked = isEpisodeUnlocked(
    drama.id,
    currentEpisode.id,
    currentEpisode.episodeNumber,
    drama.totalEpisodes
  );

  // When changing episode index or unlock state
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setCurrentTime(0);
    setDuration(0);
    setShowNextCountdown(null);

    // Stop previous video
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      if (isCurrentUnlocked && currentEpisode.status === 'available' && currentEpisode.videoUrl) {
        videoRef.current.load();
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              setIsPlaying(false);
            });
        }
      } else {
        setIsPlaying(false);
      }
    }
  }, [activeIndex, isCurrentUnlocked]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (isCurrentUnlocked) togglePlay();
          break;
        case 'ArrowUp':
          e.preventDefault();
          goToPrevEpisode();
          break;
        case 'ArrowDown':
          e.preventDefault();
          goToNextEpisode();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isEpisodeDrawerOpen) {
            setIsEpisodeDrawerOpen(false);
          } else if (isFullscreen) {
            exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, isPlaying, isMuted, isFullscreen, isEpisodeDrawerOpen, isCurrentUnlocked]);

  // Track progress
  const handleTimeUpdate = () => {
    if (!videoRef.current || !isCurrentUnlocked) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);

    if (Math.floor(curr) % 3 === 0 && dur > 0) {
      saveWatchProgress(drama.id, currentEpisode.id, currentEpisode.episodeNumber, curr, dur);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    saveWatchProgress(
      drama.id,
      currentEpisode.id,
      currentEpisode.episodeNumber,
      duration || 60,
      duration || 60
    );

    if (autoplayNext && activeIndex < drama.episodes.length - 1) {
      const nextEp = drama.episodes[activeIndex + 1];
      if (nextEp.status === 'available') {
        setShowNextCountdown(3);
      }
    }
  };

  // Autoplay countdown
  useEffect(() => {
    if (showNextCountdown === null) return;
    if (showNextCountdown <= 0) {
      goToNextEpisode();
      setShowNextCountdown(null);
      return;
    }
    const timer = setTimeout(() => {
      setShowNextCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [showNextCountdown]);

  const togglePlay = () => {
    if (!videoRef.current || !isCurrentUnlocked || currentEpisode.status !== 'available') return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      triggerCenterIcon('play');
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      triggerCenterIcon('pause');
    }
  };

  const triggerCenterIcon = (type: 'play' | 'pause') => {
    setCenterIconType(type);
    setShowCenterIcon(true);
    setTimeout(() => setShowCenterIcon(false), 500);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    showToast(newMuted ? 'Audio Dimatikan' : 'Audio Dibuka', 'info');
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsFullscreen(false);
  };

  const goToNextEpisode = () => {
    if (activeIndex < drama.episodes.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else {
      showToast('Ini adalah episod terakhir yang tersedia buat masa ini.', 'info');
    }
  };

  const goToPrevEpisode = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  // Touch gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    if (diff > 55) {
      goToNextEpisode();
    } else if (diff < -55) {
      goToPrevEpisode();
    }
  };

  // Desktop wheel
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 700) return;
    if (e.deltaY > 60) {
      lastWheelTime.current = now;
      goToNextEpisode();
    } else if (e.deltaY < -60) {
      lastWheelTime.current = now;
      goToPrevEpisode();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current || duration <= 0) return;
    const target = parseFloat(e.target.value);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setHasLiked(true);
      setLikeCount((prev) => prev + 1);
      showToast('Terima kasih atas sokongan anda!', 'success');
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none"
    >
      {/* Desktop Split View Container */}
      <div className="w-full h-full flex items-center justify-center lg:gap-8 lg:p-6 max-w-7xl mx-auto">
        
        {/* ==================== 9:16 VERTICAL PLAYER ==================== */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-full lg:h-[88vh] lg:max-h-[880px] lg:w-auto lg:aspect-[9/16] bg-ayu-card lg:rounded-3xl overflow-hidden shadow-2xl lg:border lg:border-white/10 flex flex-col justify-between"
        >
          {/* Main Video or Locked Paywall Screen */}
          <div
            onClick={isCurrentUnlocked ? togglePlay : undefined}
            className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black"
          >
            {/* 1. If Locked: Render 30% Paywall Lock Screen */}
            {!isCurrentUnlocked ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 bg-gradient-to-b from-ayu-surface/95 via-ayu-card to-ayu-bg p-6 flex flex-col items-center justify-center text-center z-30 animate-fade-in"
              >
                {/* Lock Badge & Icon */}
                <div className="w-16 h-16 rounded-3xl bg-ayu-coral/10 border-2 border-ayu-coral/40 flex items-center justify-center text-ayu-coral mb-4 shadow-xl shadow-ayu-coral/20 animate-pulse">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <AyuBadge variant="coral" size="sm">
                    EPISOD TERKUNCI
                  </AyuBadge>
                  <span className="text-xs text-ayu-gold-light font-bold">
                    30% Percuma Selesai
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-white mb-1">
                  {currentEpisode.title}
                </h3>

                <p className="text-xs text-ayu-text-muted max-w-xs mb-4 leading-relaxed">
                  Episod 1 hingga {freeCount} telah dinikmati secara percuma. Buka episod ini untuk meneruskan debaran cerita!
                </p>

                {/* Coin Price & Balance Info */}
                <div className="bg-ayu-surface/80 border border-ayu-border/70 rounded-2xl p-3 w-full max-w-xs mb-4 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] text-ayu-text-subtle uppercase tracking-wider block">
                      Harga Tebusan
                    </span>
                    <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                      <Coins className="w-4 h-4 text-ayu-gold-light fill-current" />
                      {EPISODE_UNLOCK_COST} Syiling
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-ayu-text-subtle uppercase tracking-wider block">
                      Baki Anda
                    </span>
                    <span
                      className={`text-sm font-extrabold flex items-center gap-1 mt-0.5 ${
                        coinsBalance >= EPISODE_UNLOCK_COST
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {coinsBalance} Syiling
                    </span>
                  </div>
                </div>

                {/* Unlock CTA Buttons */}
                <div className="w-full max-w-xs space-y-2">
                  {coinsBalance >= EPISODE_UNLOCK_COST ? (
                    <button
                      onClick={() => unlockEpisode(drama, currentEpisode)}
                      className="w-full py-3 rounded-xl bg-ayu-coral hover:bg-ayu-coral-hover text-white text-xs font-bold shadow-lg shadow-ayu-coral/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Buka Episod Sekarang (-{EPISODE_UNLOCK_COST} Syiling)</span>
                    </button>
                  ) : (
                    <button
                      onClick={openTopUp}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-ayu-coral to-amber-500 hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-ayu-coral/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Tambah Nilai (Baki Tidak Mencukupi)</span>
                    </button>
                  )}

                  {/* Bundle Unlock Option */}
                  <button
                    onClick={() => unlockAllEpisodes(drama)}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-ayu-gold-light text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Flame className="w-3.5 h-3.5 text-ayu-gold" />
                    <span>Buka Pakej Siri Lengkap (Jimat 20%)</span>
                  </button>
                </div>
              </div>
            ) : currentEpisode.status === 'available' ? (
              /* 2. Unlocked & Available: Video Player */
              <>
                <video
                  ref={videoRef}
                  key={currentEpisode.id}
                  src={currentEpisode.videoUrl}
                  playsInline
                  autoPlay
                  loop={false}
                  muted={isMuted}
                  onWaiting={() => setIsLoading(true)}
                  onCanPlay={() => {
                    setIsLoading(false);
                    setHasError(false);
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                  }}
                  className="w-full h-full object-cover object-center"
                />

                {/* Loading Buffer Spinner */}
                {isLoading && !hasError && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 border-3 border-ayu-coral/30 border-t-ayu-coral rounded-full animate-spin" />
                    <span className="text-xs text-white/80 mt-3 font-medium tracking-wide">
                      Memuatkan episod...
                    </span>
                  </div>
                )}

                {/* Video Error Fallback */}
                {hasError && (
                  <div className="absolute inset-0 bg-ayu-card/95 flex flex-col items-center justify-center p-6 text-center z-20">
                    <AlertTriangle className="w-12 h-12 text-ayu-gold mb-3 animate-pulse" />
                    <h4 className="text-base font-bold text-white mb-1">
                      Gagal Memuatkan Video
                    </h4>
                    <p className="text-xs text-ayu-text-muted mb-4 max-w-xs">
                      Sila periksa sambungan internet anda atau cuba muat semula video ini.
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setHasError(false);
                        setIsLoading(true);
                        if (videoRef.current) {
                          videoRef.current.load();
                          videoRef.current.play().catch(() => {});
                        }
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ayu-coral hover:bg-ayu-coral-hover text-white text-xs font-bold transition-all shadow-lg shadow-ayu-coral/25"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Cuba Lagi</span>
                    </button>
                  </div>
                )}

                {/* Center Ripple */}
                {showCenterIcon && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white scale-125 animate-fade-in shadow-2xl">
                      {centerIconType === 'play' ? (
                        <Play className="w-8 h-8 fill-current ml-1" />
                      ) : (
                        <Pause className="w-8 h-8 fill-current" />
                      )}
                    </div>
                  </div>
                )}

                {/* Autoplay Countdown Pill */}
                {showNextCountdown !== null && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-ayu-card/95 border border-ayu-coral p-5 rounded-2xl shadow-2xl text-center max-w-xs animate-slide-up"
                  >
                    <PlayCircle className="w-10 h-10 text-ayu-coral mx-auto mb-2 animate-bounce" />
                    <h5 className="text-sm font-bold text-white">Episod Seterusnya</h5>
                    <p className="text-xs text-ayu-text-muted mt-1 mb-3">
                      Bermula dalam masa <span className="text-ayu-coral font-bold text-sm">{showNextCountdown}s</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={goToNextEpisode}
                        className="flex-1 py-2 bg-ayu-coral hover:bg-ayu-coral-hover text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Tonton Terus
                      </button>
                      <button
                        onClick={() => setShowNextCountdown(null)}
                        className="px-3 py-2 bg-white/10 text-white text-xs rounded-lg transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* 3. Coming Soon */
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 bg-gradient-to-b from-ayu-surface via-ayu-card to-ayu-bg flex flex-col items-center justify-center p-6 text-center z-10"
              >
                <div className="w-16 h-16 rounded-3xl bg-ayu-gold/10 border border-ayu-gold/30 flex items-center justify-center text-ayu-gold mb-4 shadow-xl">
                  <Clock className="w-8 h-8" />
                </div>
                <AyuBadge variant="gold" size="md" className="mb-2">
                  AKAN DATANG
                </AyuBadge>
                <h3 className="text-lg font-bold text-white mb-1">
                  {currentEpisode.title}
                </h3>
                <p className="text-xs text-ayu-text-muted max-w-xs mb-5 leading-relaxed">
                  {currentEpisode.synopsis || 'Episod ini sedang dalam proses penyuntingan akhir audio visual.'}
                </p>
                <button
                  onClick={() => showToast('Anda akan dimaklumkan sebaik sahaja episod ini ditayangkan!', 'success')}
                  className="px-5 py-2.5 rounded-xl bg-ayu-coral hover:bg-ayu-coral-hover text-white text-xs font-bold transition-all shadow-lg shadow-ayu-coral/20"
                >
                  Beritahu Saya Apabila Tersedia
                </button>
              </div>
            )}
          </div>

          {/* ==================== PLAYER TOP BAR ==================== */}
          <div className="relative z-20 pt-safe px-3 sm:px-4 py-3 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between text-white">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Drama Title Pill */}
            <div className="flex flex-col items-center max-w-[170px] xs:max-w-[200px]">
              <span className="text-xs font-bold text-white truncate drop-shadow">
                {drama.title}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-ayu-gold-light font-medium">
                  Episod {currentEpisode.episodeNumber} / {drama.totalEpisodes}
                </span>
                {isEpisodeFree(currentEpisode.episodeNumber, drama.totalEpisodes) && (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded-full font-bold">
                    Percuma
                  </span>
                )}
              </div>
            </div>

            {/* Right actions: Coin Wallet & Mute & Autoplay */}
            <div className="flex items-center gap-1.5">
              {/* Coin Balance Pill */}
              <button
                onClick={openTopUp}
                aria-label="Buka baki syiling"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-ayu-card/80 hover:bg-ayu-card border border-ayu-gold/40 text-[11px] font-bold text-ayu-gold-light backdrop-blur-md transition-colors"
              >
                <Coins className="w-3.5 h-3.5 fill-current" />
                <span>{coinsBalance}</span>
                <PlusCircle className="w-3 h-3 text-ayu-coral ml-0.5" />
              </button>

              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Buka bunyi' : 'Matikan bunyi'}
                className="p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-ayu-coral" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleFullscreen}
                aria-label="Skrin penuh"
                className="p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-colors hidden sm:block"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ==================== RIGHT FLOATING ACTIONS ==================== */}
          <div className="absolute right-2.5 bottom-24 z-20 flex flex-col items-center gap-4 text-white">
            {/* Like Button */}
            <button
              onClick={handleLike}
              aria-label="Suka episod ini"
              className="group flex flex-col items-center focus:outline-none"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                  hasLiked
                    ? 'bg-ayu-coral border-ayu-coral text-white scale-110 shadow-lg shadow-ayu-coral/40'
                    : 'bg-black/50 border-white/10 text-white hover:bg-black/70'
                }`}
              >
                <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current text-white' : ''}`} />
              </div>
              <span className="text-[10px] font-semibold mt-1 drop-shadow">
                {likeCount}
              </span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleSave(drama.id)}
              aria-label={isSavedItem ? 'Keluarkan dari Senarai' : 'Simpan drama'}
              className="group flex flex-col items-center focus:outline-none"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                  isSavedItem
                    ? 'bg-ayu-coral border-ayu-coral text-white shadow-lg shadow-ayu-coral/30'
                    : 'bg-black/50 border-white/10 text-white hover:bg-black/70'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSavedItem ? 'fill-current' : ''}`} />
              </div>
              <span className="text-[10px] font-semibold mt-1 drop-shadow">
                {isSavedItem ? 'Disimpan' : 'Senarai'}
              </span>
            </button>

            {/* Episode Selector Drawer Button */}
            <button
              onClick={() => setIsEpisodeDrawerOpen(true)}
              aria-label="Pilih episod"
              className="group flex flex-col items-center focus:outline-none"
            >
              <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 flex items-center justify-center backdrop-blur-md transition-all">
                <ListVideo className="w-5 h-5 text-ayu-gold-light" />
              </div>
              <span className="text-[10px] font-semibold mt-1 drop-shadow">
                Episod
              </span>
            </button>

            {/* Up / Down Switchers */}
            <div className="flex flex-col gap-1.5 pt-2">
              <button
                onClick={goToPrevEpisode}
                disabled={activeIndex === 0}
                aria-label="Episod sebelumnya"
                className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all ${
                  activeIndex === 0
                    ? 'bg-black/20 text-white/30 cursor-not-allowed'
                    : 'bg-black/50 text-white hover:bg-black/80'
                }`}
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={goToNextEpisode}
                disabled={activeIndex === drama.episodes.length - 1}
                aria-label="Episod seterusnya"
                className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all ${
                  activeIndex === drama.episodes.length - 1
                    ? 'bg-black/20 text-white/30 cursor-not-allowed'
                    : 'bg-black/50 text-white hover:bg-black/80'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ==================== BOTTOM INFO & SEEKBAR ==================== */}
          <div className="relative z-20 pb-safe px-4 py-3 bg-gradient-to-t from-black via-black/80 to-transparent text-white">
            <div className="pr-14 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-bold text-white drop-shadow line-clamp-1">
                  {currentEpisode.title}
                </h2>
                {isEpisodeFree(currentEpisode.episodeNumber, drama.totalEpisodes) ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                    Percuma
                  </span>
                ) : !isCurrentUnlocked ? (
                  <span className="text-[10px] bg-ayu-coral/20 text-ayu-coral font-bold px-2 py-0.5 rounded-md border border-ayu-coral/40 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Terkunci
                  </span>
                ) : (
                  <span className="text-[10px] bg-white/10 text-white/90 font-bold px-2 py-0.5 rounded-md">
                    Dibuka
                  </span>
                )}
              </div>
              <p className="text-[11px] text-ayu-text-muted leading-tight line-clamp-2">
                {currentEpisode.synopsis}
              </p>
            </div>

            {/* Seekbar if unlocked */}
            {isCurrentUnlocked && currentEpisode.status === 'available' && (
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Kemajuan video"
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-ayu-coral"
                />
                <div className="flex items-center justify-between text-[10px] text-ayu-text-subtle font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}
          </div>

          {/* ==================== SLIDING EPISODE DRAWER ==================== */}
          {isEpisodeDrawerOpen && (
            <div
              className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in"
              onClick={() => setIsEpisodeDrawerOpen(false)}
            >
              <div
                className="bg-ayu-card border-t border-ayu-border rounded-t-3xl p-5 max-h-[75vh] flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header with 30% indicator */}
                <div className="flex items-center justify-between pb-3 border-b border-ayu-border/60">
                  <div className="flex items-center gap-2">
                    <ListVideo className="w-5 h-5 text-ayu-coral" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Pilih Episod</h4>
                      <p className="text-[11px] text-ayu-text-muted">
                        Jumlah {drama.episodes.length} Episod •{' '}
                        <span className="text-emerald-400 font-bold">
                          Ep 1-{freeCount} Percuma
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEpisodeDrawerOpen(false)}
                    aria-label="Tutup laci episod"
                    className="p-1.5 rounded-full hover:bg-white/10 text-ayu-text-muted hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Episodes List with Lock/Free badges */}
                <div className="overflow-y-auto custom-scrollbar divide-y divide-ayu-border/30 py-2">
                  {drama.episodes.map((ep, idx) => {
                    const isCurrent = idx === activeIndex;
                    const isFree = isEpisodeFree(ep.episodeNumber, drama.totalEpisodes);
                    const isUnlocked = isEpisodeUnlocked(drama.id, ep.id, ep.episodeNumber, drama.totalEpisodes);

                    return (
                      <button
                        key={ep.id}
                        onClick={() => {
                          setActiveIndex(idx);
                          setIsEpisodeDrawerOpen(false);
                        }}
                        className={`w-full text-left py-3 px-2 flex items-start gap-3 rounded-xl transition-colors ${
                          isCurrent
                            ? 'bg-ayu-coral/10 text-ayu-coral'
                            : 'hover:bg-white/5 text-ayu-text'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCurrent
                              ? 'bg-ayu-coral text-white'
                              : isFree || isUnlocked
                              ? 'bg-ayu-surface text-ayu-text-muted'
                              : 'bg-ayu-muted/60 text-ayu-text-subtle'
                          }`}
                        >
                          {ep.episodeNumber}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`text-xs font-semibold truncate ${
                                isCurrent ? 'text-ayu-coral' : 'text-white'
                              }`}
                            >
                              {ep.title}
                            </span>

                            {isFree ? (
                              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                                Percuma
                              </span>
                            ) : isUnlocked ? (
                              <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-1.5 py-0.5 rounded shrink-0 flex items-center gap-0.5">
                                <Unlock className="w-2.5 h-2.5" /> Dibuka
                              </span>
                            ) : (
                              <span className="text-[10px] text-ayu-gold-light font-bold bg-ayu-gold/10 px-1.5 py-0.5 rounded shrink-0 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" /> 50 Syiling
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-ayu-text-muted truncate mt-0.5">
                            {ep.synopsis}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==================== DESKTOP WORKSTATION COMPANION PANEL ==================== */}
        <div className="hidden lg:flex flex-col w-[380px] xl:w-[420px] h-[88vh] max-h-[880px] bg-ayu-card/90 border border-ayu-border/60 rounded-3xl p-6 overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="pb-4 border-b border-ayu-border/60">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {drama.isAyuOriginal && (
                  <AyuBadge variant="coral" size="sm">
                    <Sparkles className="w-3 h-3" />
                    ORIGINAL
                  </AyuBadge>
                )}
                <AyuBadge variant="dark" size="sm">
                  {drama.rating}
                </AyuBadge>
              </div>

              {/* Wallet In Companion Header */}
              <button
                onClick={openTopUp}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ayu-surface hover:bg-ayu-card border border-ayu-gold/40 text-xs font-bold text-ayu-gold-light transition-all"
              >
                <Coins className="w-3.5 h-3.5 fill-current" />
                <span>{coinsBalance} Syiling</span>
                <PlusCircle className="w-3.5 h-3.5 text-ayu-coral ml-0.5" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-white">{drama.title}</h2>
            <p className="text-xs text-ayu-gold-light mt-0.5 italic">"{drama.tagline}"</p>
          </div>

          {/* 30% Free Policy Notice */}
          <div className="py-2.5 border-b border-ayu-border/40 text-xs text-ayu-text-muted flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Ep 1 hingga {freeCount} adalah percuma</span>
            </span>
            <span className="text-ayu-text-subtle text-[11px]">
              Ep {freeCount + 1}+: 50 Syiling
            </span>
          </div>

          {/* Episodes List in Desktop Panel */}
          <div className="flex-1 flex flex-col min-h-0 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ayu-text-subtle">
                Senarai Episod ({drama.episodes.length})
              </span>
              <span className="text-[11px] text-ayu-coral font-medium">
                Sedang Dipilih: Ep {currentEpisode.episodeNumber}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {drama.episodes.map((ep, idx) => {
                const isCurrent = idx === activeIndex;
                const isFree = isEpisodeFree(ep.episodeNumber, drama.totalEpisodes);
                const isUnlocked = isEpisodeUnlocked(drama.id, ep.id, ep.episodeNumber, drama.totalEpisodes);

                return (
                  <button
                    key={ep.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-ayu-coral/15 border-ayu-coral text-white shadow-md shadow-ayu-coral/10'
                        : 'bg-ayu-surface/40 hover:bg-ayu-surface border-ayu-border/40 text-ayu-text'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCurrent
                          ? 'bg-ayu-coral text-white'
                          : isFree || isUnlocked
                          ? 'bg-ayu-card text-ayu-text-muted'
                          : 'bg-ayu-muted/60 text-ayu-text-subtle'
                      }`}
                    >
                      {ep.episodeNumber}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate">
                          {ep.title}
                        </span>

                        {isFree ? (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            Percuma
                          </span>
                        ) : isUnlocked ? (
                          <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Unlock className="w-2.5 h-2.5" /> Dibuka
                          </span>
                        ) : (
                          <span className="text-[10px] text-ayu-gold-light font-bold bg-ayu-gold/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> 50 Syiling
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ayu-text-muted line-clamp-1 mt-0.5">
                        {ep.synopsis}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Keyboard Shortcuts Tip */}
          <div className="mt-3 pt-3 border-t border-ayu-border/40 flex items-center justify-between text-[11px] text-ayu-text-subtle">
            <span>
              <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded font-mono">
                ↑
              </kbd>
              <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded font-mono ml-0.5">
                ↓
              </kbd>{' '}
              Episod
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono">
                Spasi
              </kbd>{' '}
              Main/Jeda
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono">
                M
              </kbd>{' '}
              Bunyi
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
