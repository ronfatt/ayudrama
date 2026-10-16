import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, PlaySquare, Search, Bookmark, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentRoute, navigate, savedIds } = useApp();

  // Hide BottomNav when inside immersive vertical player or full movie player
  const isPlayingImmersive =
    currentRoute.startsWith('/tonton/') ||
    currentRoute.startsWith('/tonton-filem/');

  if (isPlayingImmersive) return null;

  const items = [
    { label: 'Utama', path: '/', icon: Home },
    { label: 'Drama', path: '/drama-pendek', icon: PlaySquare },
    { label: 'Cari', path: '/cari', icon: Search },
    {
      label: 'Senarai',
      path: '/senarai-saya',
      icon: Bookmark,
      badge: savedIds.length > 0 ? savedIds.length : undefined,
    },
    { label: 'Profil', path: '/profil', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/') return currentRoute === '/' || currentRoute === '';
    return currentRoute.startsWith(path);
  };

  return (
    <nav
      aria-label="Navigasi Bawah Mudah Alih"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ayu-bg/95 backdrop-blur-2xl border-t border-ayu-border/60 pb-safe shadow-[0_-8px_24px_rgba(0,0,0,0.6)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-1 relative transition-all duration-200 ${
                active ? 'text-ayu-coral scale-105' : 'text-ayu-text-muted hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[14px] h-[14px] rounded-full bg-ayu-coral text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {active && (
                <span className="w-1 h-1 rounded-full bg-ayu-coral absolute bottom-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
