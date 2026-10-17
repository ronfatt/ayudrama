import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TOP_UP_PACKAGES, PAYMENT_METHODS } from '../../data/packages';
import {
  Coins,
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Gift,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { AyuBadge } from './AyuBadge';

export const TopUpModal: React.FC = () => {
  const {
    isTopUpOpen,
    closeTopUp,
    coinsBalance,
    rechargeCoins,
    claimDailyBonus,
  } = useApp();

  const [selectedPackageId, setSelectedPackageId] = useState<string>(TOP_UP_PACKAGES[1].id);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('tng');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTopUp();
    };
    if (isTopUpOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isTopUpOpen, closeTopUp]);

  if (!isTopUpOpen) return null;

  const currentPkg = TOP_UP_PACKAGES.find((p) => p.id === selectedPackageId) || TOP_UP_PACKAGES[1];
  const currentPayment = PAYMENT_METHODS.find((p) => p.id === selectedPaymentId) || PAYMENT_METHODS[0];

  const totalCoins = currentPkg.coins + currentPkg.bonusCoins;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      rechargeCoins(
        `Pakej RM${currentPkg.priceRM}`,
        totalCoins,
        currentPkg.priceRM,
        currentPayment.name
      );
      setIsProcessing(false);
    }, 900);
  };

  const getPaymentIcon = (id: string) => {
    switch (id) {
      case 'tng':
        return <Smartphone className="w-5 h-5 text-sky-400" />;
      case 'duitnow':
        return <QrCode className="w-5 h-5 text-rose-400" />;
      case 'fpx':
        return <CreditCard className="w-5 h-5 text-emerald-400" />;
      case 'grabpay':
        return <Smartphone className="w-5 h-5 text-emerald-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-ayu-coral" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="topup-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeTopUp}
    >
      <div
        className="bg-ayu-card border-t sm:border border-ayu-border w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar animate-slide-up pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={closeTopUp}
          aria-label="Tutup tetingkap tambah nilai"
          className="absolute top-4 right-4 p-2 text-ayu-text-muted hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-ayu-border/60">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ayu-gold to-amber-500 flex items-center justify-center text-ayu-bg shadow-lg shadow-ayu-gold/20 font-bold">
            <Coins className="w-6 h-6 text-black fill-current" />
          </div>
          <div>
            <h2 id="topup-title" className="text-lg font-bold text-white flex items-center gap-2">
              <span>Tambah Nilai Syiling AIWAY</span>
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-ayu-text-muted">Baki Semasa:</span>
              <span className="text-xs font-bold text-ayu-gold-light bg-ayu-gold/10 px-2 py-0.5 rounded-full border border-ayu-gold/20">
                {coinsBalance} Syiling
              </span>
            </div>
          </div>
        </div>

        {/* Free Daily Reward Pill */}
        <div className="mt-4 bg-gradient-to-r from-ayu-coral/10 via-ayu-gold/10 to-transparent border border-ayu-coral/30 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Gift className="w-5 h-5 text-ayu-coral shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Ganjaran Harian Penonton</p>
              <p className="text-[11px] text-ayu-text-muted">Tuntut 100 Syiling percuma hari ini</p>
            </div>
          </div>
          <button
            onClick={claimDailyBonus}
            className="px-3 py-1.5 bg-ayu-coral hover:bg-ayu-coral-hover text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            Tuntut
          </button>
        </div>

        {/* Package Selector */}
        <div className="mt-5 space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-ayu-text-subtle block">
            Pilih Pakej Syiling
          </label>

          <div className="grid grid-cols-2 gap-3">
            {TOP_UP_PACKAGES.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              const hasBonus = pkg.bonusCoins > 0;

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-ayu-coral/15 border-ayu-coral shadow-lg shadow-ayu-coral/15'
                      : 'bg-ayu-surface/50 hover:bg-ayu-surface border-ayu-border/60 hover:border-ayu-border'
                  }`}
                >
                  {pkg.tag && (
                    <span className="absolute -top-2.5 right-2 px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-gradient-to-r from-ayu-coral to-ayu-gold text-white shadow-sm flex items-center gap-0.5">
                      {pkg.isPopular && <Flame className="w-2.5 h-2.5 fill-current" />}
                      {pkg.tag}
                    </span>
                  )}

                  <div>
                    <span className="text-xl font-extrabold text-white block">
                      RM {pkg.priceRM}
                    </span>
                    <div className="flex items-center gap-1 mt-1 text-sm font-bold text-ayu-gold-light">
                      <Coins className="w-4 h-4 fill-current" />
                      <span>{pkg.coins}</span>
                    </div>
                  </div>

                  {hasBonus && (
                    <div className="mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md inline-block w-fit">
                      +{pkg.bonusCoins} Bonus Percuma
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-5 space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-ayu-text-subtle block">
            Kaedah Pembayaran Tempatan
          </label>

          <div className="space-y-2">
            {PAYMENT_METHODS.map((pm) => {
              const isSelected = selectedPaymentId === pm.id;

              return (
                <div
                  key={pm.id}
                  onClick={() => setSelectedPaymentId(pm.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-ayu-coral/10 border-ayu-coral'
                      : 'bg-ayu-surface/40 hover:bg-ayu-surface border-ayu-border/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-ayu-card border border-ayu-border flex items-center justify-center">
                      {getPaymentIcon(pm.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{pm.name}</span>
                        {pm.badge && (
                          <AyuBadge variant="gold" size="sm">
                            {pm.badge}
                          </AyuBadge>
                        )}
                      </div>
                      <span className="text-[11px] text-ayu-text-muted">{pm.description}</span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-ayu-coral bg-ayu-coral' : 'border-ayu-border'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary & Checkout CTA */}
        <div className="mt-6 pt-4 border-t border-ayu-border/60">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-ayu-text-muted">Jumlah Diterima:</span>
            <span className="font-bold text-white text-sm flex items-center gap-1">
              <Coins className="w-4 h-4 text-ayu-gold-light fill-current" />
              {totalCoins} Syiling AIWAY
            </span>
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl bg-ayu-coral hover:bg-ayu-coral-hover text-white font-bold text-sm shadow-xl shadow-ayu-coral/30 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-70"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Bayar RM {currentPkg.priceRM.toFixed(2)} Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[10px] text-ayu-text-subtle text-center mt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Transaksi Selamat & Pengkreditan Segera ke Baki Akaun
          </p>
        </div>
      </div>
    </div>
  );
};
