import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, User, Bookmark } from 'lucide-react';
import { ProfileModal } from './ProfileModal';

export const Navbar: React.FC = () => {
  const { currentRoute, navigate, savedIds } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
  ];

  const isActive = (path: string) => {
    if (path === '/') return currentRoute === '/' || currentRoute === '';
    return currentRoute.startsWith(path);
  };

  return (
    <>
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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-ayu-coral to-rose-600 flex items-center justify-center shadow-md shadow-ayu-coral/25">
                <span className="text-white font-extrabold text-lg leading-none tracking-tighter">
                  a
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-ayu-coral transition-colors font-sans lowercase">
                    ayu<span className="text-ayu-coral ml-0.5">drama</span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-ayu-gold ml-1 animate-pulse" />
                </div>
                <span className="text-[10px] text-ayu-text-subtle font-medium tracking-wide hidden sm:block">
                  Cerita dekat di hati.
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

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
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

            <button
              onClick={() => setIsProfileOpen(true)}
              aria-label="Buka profil penonton"
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-ayu-surface/80 hover:bg-ayu-surface border border-ayu-border/60 hover:border-ayu-coral/40 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-ayu-coral to-ayu-gold flex items-center justify-center text-white text-xs font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-ayu-text hidden sm:block">
                Penonton
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Profile & Settings Dialog */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};
