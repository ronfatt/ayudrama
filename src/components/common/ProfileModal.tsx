import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Sparkles, X, PlayCircle } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { autoplayNext, setAutoplayNext, clearHistory, watchHistory, savedIds } = useApp();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-ayu-card border border-ayu-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup tetingkap profil"
          className="absolute top-4 right-4 p-2 text-ayu-text-muted hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-4 pb-6 border-b border-ayu-border/60">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-ayu-coral to-ayu-gold/80 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-ayu-coral/20">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 id="profile-modal-title" className="text-lg font-bold text-white">
                Penonton Ayu
              </h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                Sesi Tempatan
              </span>
            </div>
            <p className="text-xs text-ayu-text-muted mt-0.5">
              Cerita dekat di hati • Mod Pratonton Rasmi
            </p>
          </div>
        </div>

        {/* Local device status */}
        <div className="py-4 space-y-3">
          <h4 className="text-xs font-semibold text-ayu-text-subtle uppercase tracking-wider">
            Status Peranti Anda
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-ayu-surface/60 border border-ayu-border/40 rounded-xl p-3">
              <span className="text-xs text-ayu-text-muted block">Dalam Senarai</span>
              <span className="text-xl font-bold text-white mt-1 block">
                {savedIds.length} drama
              </span>
            </div>
            <div className="bg-ayu-surface/60 border border-ayu-border/40 rounded-xl p-3">
              <span className="text-xs text-ayu-text-muted block">Sejarah Ditonton</span>
              <span className="text-xl font-bold text-white mt-1 block">
                {Object.keys(watchHistory).length} tajuk
              </span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="py-3 border-t border-ayu-border/40 space-y-3">
          <h4 className="text-xs font-semibold text-ayu-text-subtle uppercase tracking-wider">
            Tetapan Main Semula
          </h4>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <PlayCircle className="w-5 h-5 text-ayu-coral" />
              <div>
                <p className="text-sm font-medium text-white">Sambung Episod Automatik</p>
                <p className="text-xs text-ayu-text-muted">Mainkan episod seterusnya secara automatik</p>
              </div>
            </div>
            <button
              onClick={() => setAutoplayNext((prev) => !prev)}
              aria-label="Togol sambung automatik"
              className={`w-12 h-6 rounded-full transition-colors relative ${
                autoplayNext ? 'bg-ayu-coral' : 'bg-ayu-muted'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  autoplayNext ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Honest Architecture Notice */}
        <div className="mt-2 bg-ayu-surface/80 border border-ayu-border/60 rounded-xl p-3.5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-ayu-gold shrink-0 mt-0.5" />
          <div className="text-xs text-ayu-text-muted leading-relaxed">
            <span className="font-semibold text-white block mb-0.5">Nota Pratonton Versi MVP:</span>
            Semua rekod kegemaran dan kemajuan tontonan kini disimpan dengan selamat dalam storan peranti anda (localStorage). Pendaftaran akaun awan dan langganan rasmi akan diperkenalkan pada fasa pelancaran seterusnya.
          </div>
        </div>

        {/* Clear Data Action */}
        <div className="mt-5 flex items-center justify-between pt-2">
          <button
            onClick={() => {
              if (window.confirm('Adakah anda pasti mahu mengosongkan semua sejarah tontonan?')) {
                clearHistory();
              }
            }}
            className="text-xs text-ayu-text-subtle hover:text-rose-400 transition-colors"
          >
            Kosongkan Sejarah Tontonan
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
