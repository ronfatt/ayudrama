import React, { useState, useEffect, useRef } from 'react';
import type { Drama } from '../../types/drama';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Subtitles,
  AlertTriangle,
} from 'lucide-react';
import { AyuBadge } from '../common/AyuBadge';

interface MoviePlayerProps {
  drama: Drama;
  onBack: () => void;
}

export const MoviePlayer: React.FC<MoviePlayerProps> = ({ drama, onBack }) => {
  const { saveWatchProgress, getDramaProgress, showToast } = useApp();

  const episode = drama.episodes[0];
  const progress = getDramaProgress(drama.id);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(progress?.progressSeconds || 0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('ms');
  const [showSubtitleMenu, setShowSubtitleMenu] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (videoRef.current && progress?.progressSeconds) {
      videoRef.current.currentTime = progress.progressSeconds;
    }
  }, []);

  // Auto-hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);

    if (Math.floor(curr) % 4 === 0 && dur > 0) {
      saveWatchProgress(drama.id, episode.id, 1, curr, dur);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current || duration <= 0) return;
    const target = parseFloat(e.target.value);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Video Viewport */}
      <div
        onClick={togglePlay}
        className="relative w-full h-full flex items-center justify-center cursor-pointer bg-black"
      >
        <video
          ref={videoRef}
          src={episode.videoUrl}
          playsInline
          autoPlay
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => {
            setIsLoading(false);
            setHasError(false);
          }}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            saveWatchProgress(drama.id, episode.id, 1, duration, duration);
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className="w-full h-full object-contain"
        />

        {/* Loading Spinner */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 border-4 border-ayu-coral/30 border-t-ayu-coral rounded-full animate-spin" />
          </div>
        )}

        {/* Error Fallback */}
        {hasError && (
          <div className="absolute inset-0 bg-ayu-card/95 flex flex-col items-center justify-center p-6 text-center z-20">
            <AlertTriangle className="w-12 h-12 text-ayu-gold mb-3" />
            <h4 className="text-base font-bold text-white mb-1">
              Gagal Memuatkan Filem
            </h4>
            <p className="text-xs text-ayu-text-muted mb-4 max-w-sm">
              Sila pastikan rangkaian internet anda stabil.
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ayu-coral hover:bg-ayu-coral-hover text-white text-xs font-bold transition-all shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Cuba Lagi</span>
            </button>
          </div>
        )}
      </div>

      {/* Top Header Controls */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 pt-safe px-4 sm:px-6 py-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={onBack}
          aria-label="Kembali"
          className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            {drama.isAyuOriginal && (
              <AyuBadge variant="coral" size="sm">
                AYU ORIGINAL
              </AyuBadge>
            )}
            <AyuBadge variant="dark" size="sm">
              {drama.rating}
            </AyuBadge>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white mt-1 truncate max-w-md">
            {drama.title}
          </h2>
        </div>

        <div className="w-10" />
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 pb-safe px-4 sm:px-8 py-5 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Seekbar */}
        <div className="space-y-1 mb-3">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Kemajuan tontonan filem"
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-ayu-coral"
          />
          <div className="flex items-center justify-between text-xs text-ayu-text-muted font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Jeda' : 'Main'}
              className="p-2.5 rounded-full bg-white text-black hover:bg-ayu-coral hover:text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Buka bunyi' : 'Matikan bunyi'}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-ayu-coral" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Subtitle track button */}
            {episode.subtitles && episode.subtitles.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                  aria-label="Tetapan sari kata"
                  className={`p-2 rounded-full transition-colors ${
                    showSubtitleMenu ? 'bg-ayu-coral text-white' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <Subtitles className="w-5 h-5" />
                </button>

                {showSubtitleMenu && (
                  <div className="absolute bottom-10 right-0 bg-ayu-card border border-ayu-border rounded-xl p-2 shadow-2xl min-w-[140px] text-xs">
                    <span className="block px-3 py-1 font-bold text-ayu-text-subtle text-[10px] uppercase">
                      Sari Kata
                    </span>
                    <button
                      onClick={() => {
                        setSelectedSubtitle('off');
                        setShowSubtitleMenu(false);
                        showToast('Sari kata dimatikan', 'info');
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                        selectedSubtitle === 'off' ? 'bg-ayu-coral/10 text-ayu-coral font-bold' : 'text-ayu-text hover:bg-white/5'
                      }`}
                    >
                      Mati
                    </button>
                    {episode.subtitles.map((sub) => (
                      <button
                        key={sub.lang}
                        onClick={() => {
                          setSelectedSubtitle(sub.lang);
                          setShowSubtitleMenu(false);
                          showToast(`Sari kata: ${sub.label}`, 'success');
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                          selectedSubtitle === sub.lang ? 'bg-ayu-coral/10 text-ayu-coral font-bold' : 'text-ayu-text hover:bg-white/5'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={toggleFullscreen}
              aria-label="Skrin penuh"
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
