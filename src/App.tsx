import React from 'react';
import { useApp } from './context/AppContext';
import { DRAMAS_DATA } from './data/dramas';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { UtamaPage } from './pages/UtamaPage';
import { DramaPendekPage } from './pages/DramaPendekPage';
import { FilemPage } from './pages/FilemPage';
import { ButiranPage } from './pages/ButiranPage';
import { CariPage } from './pages/CariPage';
import { SenaraiSayaPage } from './pages/SenaraiSayaPage';
import { ShortDramaPlayer } from './components/player/ShortDramaPlayer';
import { MoviePlayer } from './components/player/MoviePlayer';
import { ShieldAlert } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { currentRoute, routeParams, navigate } = useApp();

  // Determine if in full-screen player mode
  const isShortDramaPlayer = currentRoute.startsWith('/tonton/');
  const isMoviePlayer = currentRoute.startsWith('/tonton-filem/');
  const isImmersivePlayer = isShortDramaPlayer || isMoviePlayer;

  // Active playing drama
  const activeDrama = routeParams.slug
    ? DRAMAS_DATA.find((d) => d.slug === routeParams.slug)
    : undefined;

  // Route Dispatcher
  const renderCurrentView = () => {
    // 1. Vertical Short Drama Player
    if (isShortDramaPlayer) {
      if (!activeDrama) {
        return (
          <div className="min-h-screen pt-32 text-center text-white">
            <p>Drama tidak dijumpai.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-ayu-coral rounded-xl text-xs font-bold"
            >
              Kembali ke Utama
            </button>
          </div>
        );
      }
      return (
        <ShortDramaPlayer
          drama={activeDrama}
          initialEpisodeId={routeParams.episodeId}
          onBack={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              navigate(`/butiran/${activeDrama.slug}`);
            }
          }}
        />
      );
    }

    // 2. Horizontal Movie Player
    if (isMoviePlayer) {
      if (!activeDrama) {
        return (
          <div className="min-h-screen pt-32 text-center text-white">
            <p>Filem tidak dijumpai.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-ayu-coral rounded-xl text-xs font-bold"
            >
              Kembali ke Utama
            </button>
          </div>
        );
      }
      return (
        <MoviePlayer
          drama={activeDrama}
          onBack={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              navigate(`/butiran/${activeDrama.slug}`);
            }
          }}
        />
      );
    }

    // 3. Details Page
    if (currentRoute.startsWith('/butiran/')) {
      return <ButiranPage slug={routeParams.slug || ''} />;
    }

    // 4. Hub & Listing Pages
    if (currentRoute === '/drama-pendek') {
      return <DramaPendekPage />;
    }
    if (currentRoute === '/filem') {
      return <FilemPage />;
    }
    if (currentRoute === '/cari') {
      return <CariPage />;
    }
    if (currentRoute === '/senarai-saya') {
      return <SenaraiSayaPage />;
    }

    // Default: Utama (Home)
    return <UtamaPage />;
  };

  return (
    <div className="min-h-screen bg-ayu-bg text-ayu-text flex flex-col font-sans selection:bg-ayu-coral selection:text-white">
      {/* Global Navbar (hidden in player mode) */}
      {!isImmersivePlayer && <Navbar />}

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Footer (hidden in player mode) */}
      {!isImmersivePlayer && (
        <footer className="border-t border-ayu-border/40 bg-ayu-card/60 pt-10 pb-24 md:pb-12 text-xs text-ayu-text-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-ayu-border/30">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-ayu-coral flex items-center justify-center text-white font-extrabold text-sm">
                    a
                  </div>
                  <span className="text-lg font-extrabold text-white tracking-tight lowercase">
                    ayu<span className="text-ayu-coral">drama</span>
                  </span>
                </div>
                <p className="text-ayu-gold-light text-xs font-medium">
                  Cerita dekat di hati.
                </p>
                <p className="text-[11px] text-ayu-text-subtle mt-1 max-w-sm">
                  Platform penstriman drama pendek dan sinema tempatan dengan sentuhan emosi masyarakat Malaysia.
                </p>
              </div>

              {/* Quick Links */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-white transition-colors"
                >
                  Utama
                </button>
                <button
                  onClick={() => navigate('/drama-pendek')}
                  className="hover:text-white transition-colors"
                >
                  Drama Pendek
                </button>
                <button
                  onClick={() => navigate('/filem')}
                  className="hover:text-white transition-colors"
                >
                  Koleksi Filem
                </button>
                <button
                  onClick={() => navigate('/senarai-saya')}
                  className="hover:text-white transition-colors"
                >
                  Senarai Saya
                </button>
                <button
                  onClick={() => navigate('/cari')}
                  className="hover:text-white transition-colors"
                >
                  Carian Drama
                </button>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ayu-text-subtle">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <ShieldAlert className="w-3.5 h-3.5 text-ayu-gold shrink-0" />
                <span>
                  Pratonton Rasmi MVP • Dikuasakan oleh Storan Tempatan (localStorage)
                </span>
              </div>
              <p className="flex items-center gap-1">
                © {new Date().getFullYear()} Ayu Drama Malaysia. Hak cipta terpelihara.
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Toast Alert */}
      <Toast />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
