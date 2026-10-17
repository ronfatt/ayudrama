import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ExternalLink,
  Clapperboard,
  CheckCircle2,
  Sparkles,
  Film,
  Award,
  Clock,
  Play,
  X,
} from 'lucide-react';
import { AyuBadge } from './AyuBadge';

export const AdModal: React.FC = () => {
  const { isAdModalOpen, closeAdModal, completeAdReward, adRewardType, targetEpisodeToUnlock } = useApp();

  const [countdown, setCountdown] = useState<number>(5);
  const [canSkip, setCanSkip] = useState<boolean>(false);

  const AD_TARGET_URL = 'https://d.ayupictures.com';

  useEffect(() => {
    if (!isAdModalOpen) {
      setCountdown(5);
      setCanSkip(false);
      return;
    }

    setCountdown(5);
    setCanSkip(false);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAdModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (canSkip) completeAdReward();
        else closeAdModal();
      }
    };
    if (isAdModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdModalOpen, canSkip]);

  if (!isAdModalOpen) return null;

  const rewardLabel =
    adRewardType === 'unlock_episode' && targetEpisodeToUnlock
      ? `Buka Episod ${targetEpisodeToUnlock.episode.episodeNumber} Percuma`
      : '+50 Syiling AIWAY Percuma';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fade-in select-none"
      onClick={() => {
        if (canSkip) completeAdReward();
      }}
    >
      <div
        className="bg-gradient-to-b from-[#151922] via-[#0F131A] to-[#0A0C10] border border-ayu-coral/40 w-full max-w-lg rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(255,65,84,0.25)] relative overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-ayu-coral/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Sponsor Badge & Countdown Timer */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-widest text-white/90 bg-white/10 border border-white/15 px-2.5 py-1 rounded-md uppercase">
              Tajaan Rasmi
            </span>
            <AyuBadge variant="coral" size="sm">
              <Sparkles className="w-3 h-3" />
              Iklan 5 Saat
            </AyuBadge>
          </div>

          {/* 5-Second Countdown / Close Pill */}
          <div className="flex items-center gap-2">
            {canSkip ? (
              <button
                onClick={completeAdReward}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 transition-all animate-pulse"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tutup & Tuntut</span>
                <X className="w-3.5 h-3.5 ml-0.5" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-xs font-bold text-ayu-gold-light">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Boleh langkau dalam {countdown}s</span>
                </div>
                <button
                  onClick={closeAdModal}
                  title="Batalkan iklan"
                  className="p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Ad Creative Card: D'Ayu Pictures */}
        <div className="relative z-10 my-5 rounded-2xl overflow-hidden border border-ayu-border/60 bg-ayu-card/90 shadow-2xl group">
          {/* Visual Showcase Banner */}
          <div className="relative h-44 sm:h-52 overflow-hidden bg-black">
            <img
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop"
              alt="D'Ayu Pictures Studio"
              className="w-full h-full object-cover transform duration-700 group-hover:scale-105 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ayu-card via-black/40 to-transparent" />

            {/* Overlaid Logo and Branding */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-ayu-coral flex items-center justify-center text-white font-extrabold shadow-md">
                <Clapperboard className="w-4 h-4" />
              </div>
              <span className="text-white font-extrabold text-sm tracking-wide drop-shadow">
                D'Ayu Pictures
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <AyuBadge variant="gold" size="sm" className="mb-1">
                  <Award className="w-3 h-3" />
                  Rakan Penerbit Filem Negara
                </AyuBadge>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight drop-shadow">
                  Menerajui Sinema & Karya Sinematik Malaysia
                </h3>
              </div>
            </div>
          </div>

          {/* Description & Link Out */}
          <div className="p-4 sm:p-5 space-y-3">
            <p className="text-xs text-ayu-text leading-relaxed">
              D'Ayu Pictures merupakan rumah penerbitan perfileman terkemuka yang menerbitkan karya blockbuster, drama bersiri popular, dan kandungan digital berkualiti tinggi untuk peminat sinema tanah air.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-ayu-text-muted">
              <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                <Film className="w-3 h-3 text-ayu-coral" /> Penerbitan 4K HDR
              </span>
              <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                <Play className="w-3 h-3 text-ayu-gold" /> Tayangan Pawagam & Penstriman
              </span>
            </div>

            {/* Direct Visit Website Button */}
            <a
              href={AD_TARGET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-ayu-border hover:border-ayu-coral/50 transition-all text-white group/link"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-white group-hover/link:text-ayu-coral transition-colors font-mono">
                  d.ayupictures.com
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-ayu-coral font-semibold">
                <span>Layari Laman Web Rasmi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>
          </div>
        </div>

        {/* Footer Reward Bar & CTA */}
        <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <span className="text-[10px] text-ayu-text-subtle uppercase tracking-wider block">
              Ganjaran Anda
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              {rewardLabel}
            </span>
          </div>

          {canSkip ? (
            <button
              onClick={completeAdReward}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-ayu-coral to-rose-600 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-ayu-coral/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tuntut Ganjaran & Sambung Tonton</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 text-white/50 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Clock className="w-4 h-4 animate-spin" />
              <span>Sila tonton selama {countdown} saat...</span>
            </button>
          )}
        </div>

        {/* Small Disclaimer */}
        <p className="text-[10px] text-ayu-text-subtle text-center mt-3">
          Iklan tajaan eksklusif dibawakan oleh D'Ayu Pictures Malaysia (d.ayupictures.com).
        </p>
      </div>
    </div>
  );
};
