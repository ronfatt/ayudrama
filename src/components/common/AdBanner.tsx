import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clapperboard, ExternalLink, Play, Sparkles, Coins } from 'lucide-react';
import { AyuBadge } from './AyuBadge';

interface AdBannerProps {
  className?: string;
  variant?: 'full' | 'compact';
}

export const AdBanner: React.FC<AdBannerProps> = ({
  className = '',
  variant = 'full',
}) => {
  const { openAdModal } = useApp();

  const AD_URL = 'https://d.ayupictures.com';

  if (variant === 'compact') {
    return (
      <div
        className={`bg-gradient-to-r from-ayu-card via-ayu-surface to-ayu-card border border-ayu-coral/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ayu-coral to-rose-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-ayu-coral/20">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-white">D'Ayu Pictures</span>
              <AyuBadge variant="gold" size="sm">Tajaan</AyuBadge>
            </div>
            <p className="text-[11px] text-ayu-text-muted mt-0.5">
              Tonton iklan 5 saat untuk menerima <strong className="text-ayu-gold-light">+50 Syiling percuma</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => openAdModal({ rewardType: 'coins' })}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-ayu-coral hover:bg-ayu-coral-hover text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Tonton 5s (+50)</span>
          </button>
          <a
            href={AD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-ayu-text-muted hover:text-white transition-colors"
            title="Layari d.ayupictures.com"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-ayu-coral/40 bg-gradient-to-r from-[#171B24] via-[#10141C] to-[#0D1017] p-6 sm:p-8 shadow-2xl ${className}`}
    >
      {/* Background Cinematic Texture */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-ayu-coral/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-ayu-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ayu-coral flex items-center justify-center text-white shadow-md">
              <Clapperboard className="w-4 h-4" />
            </div>
            <span className="text-sm font-extrabold tracking-wide text-white">
              D'Ayu Pictures
            </span>
            <AyuBadge variant="coral" size="sm">
              <Sparkles className="w-2.5 h-2.5" />
              Rakan Penerbit Rasmi
            </AyuBadge>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
            Menerajui Sinema & Drama Bersiri Berkualiti Tinggi Malaysia
          </h3>

          <p className="text-xs sm:text-sm text-ayu-text-muted leading-relaxed">
            Terokai barisan penerbitan filem layar perak, pra-tonton karya terbaharu, dan informasi produksi perfileman rasmi di portal rasmi D'Ayu Pictures.
          </p>

          <div className="flex items-center gap-2 text-xs text-ayu-gold-light font-medium pt-1">
            <Coins className="w-4 h-4 fill-current" />
            <span>Tonton iklan 5 saat D'Ayu Pictures untuk dapatkan 50 Syiling AIWAY percuma!</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => openAdModal({ rewardType: 'coins' })}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ayu-coral hover:bg-ayu-coral-hover text-white text-xs sm:text-sm font-bold shadow-lg shadow-ayu-coral/30 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Tonton Iklan 5s (+50 Syiling)</span>
          </button>

          <a
            href={AD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-ayu-border hover:border-ayu-coral/40 text-white text-xs sm:text-sm font-semibold transition-all group"
          >
            <span className="font-mono text-ayu-text group-hover:text-white">d.ayupictures.com</span>
            <ExternalLink className="w-4 h-4 text-ayu-coral group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};
