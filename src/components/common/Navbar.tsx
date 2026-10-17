import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bookmark, Coins, PlusCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentRoute, navigate, savedIds, coinsBalance, openTopUp, userProfile } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Utama', path: '/' },
    { label: 'Drama Pendek', path: '/drama-pendek' },
    { label: 'Filem', path: '/filem' },
    { label: 'Senarai Saya', path: '/senarai-saya', badge: savedIds.length > 0 ? savedIds.length : undefined },
    { label: 'Profil Saya', path: '/profil' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return currentRoute === '/' || currentRoute === '';
    return currentRoute.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-ayu-bg/90 backdrop-blur-xl border-b border-ayu-border/50 py-3 shadow-lg shadow-black/40'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('/')}
            className="group text-left flex items-center gap-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-ayu-coral via-rose-500 to-amber-500 flex items-center justify-center shadow-md shadow-ayu-coral/25">
              <span className="text-white font-black text-xs leading-none tracking-tight">
                AI
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-ayu-coral transition-colors font-sans">
                  AI<span className="text-ayu-coral">WAY</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-ayu-gold ml-1 animate-pulse" />
              </div>
              <span className="text-[10px] text-ayu-text-subtle font-semibold tracking-wide hidden sm:block">
                Ayu In Wayang
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-ayu-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {link.badge !== undefined && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-ayu-coral text-white">
                    {link.badge}
                  </span>
                )}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-ayu-coral rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Actions: Coins Pill & Search & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Top Up / Coins Pill */}
          <button
            onClick={openTopUp}
            title="Tambah nilai Syiling AIWAY"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ayu-card/90 hover:bg-ayu-surface border border-ayu-gold/40 text-xs font-bold text-ayu-gold-light shadow-md transition-all active:scale-95"
          >
            <Coins className="w-3.5 h-3.5 fill-current" />
            <span>{coinsBalance}</span>
            <PlusCircle className="w-3.5 h-3.5 text-ayu-coral ml-0.5" />
          </button>

          <button
            onClick={() => navigate('/cari')}
            aria-label="Cari drama dan filem"
            className={`p-2.5 rounded-full text-ayu-text-muted hover:text-white hover:bg-white/10 transition-colors ${
              currentRoute === '/cari' ? 'text-white bg-white/10' : ''
            }`}
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/senarai-saya')}
            aria-label="Senarai Saya"
            className="p-2.5 rounded-full text-ayu-text-muted hover:text-white hover:bg-white/10 transition-colors md:hidden relative"
          >
            <Bookmark className="w-5 h-5" />
            {savedIds.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ayu-coral" />
            )}
          </button>

          {/* User Profile Avatar CTA */}
          <button
            onClick={() => navigate('/profil')}
            aria-label="Buka profil penonton"
            className={`flex items-center gap-2 p-1 sm:px-3 sm:py-1 rounded-full border transition-all ${
              currentRoute === '/profil'
                ? 'bg-ayu-coral/15 border-ayu-coral text-white'
                : 'bg-ayu-surface/80 hover:bg-ayu-surface border-ayu-border/60 hover:border-ayu-coral/40'
            }`}
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-ayu-coral/50 shrink-0">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-ayu-text hidden sm:block max-w-[90px] truncate">
              {userProfile.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
