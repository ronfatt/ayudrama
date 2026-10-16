import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Drama, WatchProgress } from '../types/drama';
import { DRAMAS_DATA } from '../data/dramas';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Saved list
  savedIds: string[];
  toggleSave: (dramaId: string) => void;
  isSaved: (dramaId: string) => boolean;
  savedDramas: Drama[];

  // Watch history
  watchHistory: Record<string, WatchProgress>;
  saveWatchProgress: (dramaId: string, episodeId: string, episodeNumber: number, progressSeconds: number, totalSeconds: number) => void;
  getDramaProgress: (dramaId: string) => WatchProgress | undefined;
  clearHistory: () => void;
  removeFromHistory: (dramaId: string) => void;
  historyDramas: { drama: Drama; progress: WatchProgress }[];

  // Settings
  autoplayNext: boolean;
  setAutoplayNext: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Navigation
  currentRoute: string;
  navigate: (route: string) => void;
  routeParams: { slug?: string; episodeId?: string };

  // Toast
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SAVED_STORAGE_KEY = 'ayu_drama_saved_list_v1';
const HISTORY_STORAGE_KEY = 'ayu_drama_history_v1';
const AUTOPLAY_STORAGE_KEY = 'ayu_drama_autoplay_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize Saved List from localStorage
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['ayu-sd-01', 'ayu-sd-03']; // pre-seeded with 2 titles for lively first-time experience
    } catch {
      return ['ayu-sd-01', 'ayu-sd-03'];
    }
  });

  // Initialize Watch History from localStorage
  const [watchHistory, setWatchHistory] = useState<Record<string, WatchProgress>>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        'ayu-sd-01': {
          dramaId: 'ayu-sd-01',
          episodeId: 'jyt-ep-02',
          episodeNumber: 2,
          progressSeconds: 38,
          totalSeconds: 68,
          updatedAt: Date.now() - 3600000,
        }
      };
    } catch {
      return {};
    }
  });

  // Autoplay preference
  const [autoplayNext, setAutoplayNext] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(AUTOPLAY_STORAGE_KEY);
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  // Route state via window.location.hash
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '') || '/';
    return hash;
  });

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync savedIds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedIds));
    } catch (e) {
      console.warn('Gagal menyimpan senarai:', e);
    }
  }, [savedIds]);

  // Sync watchHistory to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(watchHistory));
    } catch (e) {
      console.warn('Gagal menyimpan sejarah:', e);
    }
  }, [watchHistory]);

  // Sync autoplay to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(AUTOPLAY_STORAGE_KEY, JSON.stringify(autoplayNext));
    } catch (e) {
      console.warn('Gagal menyimpan tetapan autoplay:', e);
    }
  }, [autoplayNext]);

  // Listen to hash change for back/forward browser support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentRoute(hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3000);
  };

  const toggleSave = (dramaId: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(dramaId);
      if (exists) {
        showToast('Dikeluarkan daripada Senarai Saya', 'info');
        return prev.filter((id) => id !== dramaId);
      } else {
        showToast('Ditambah ke Senarai Saya', 'success');
        return [...prev, dramaId];
      }
    });
  };

  const isSaved = (dramaId: string) => savedIds.includes(dramaId);

  const saveWatchProgress = (
    dramaId: string,
    episodeId: string,
    episodeNumber: number,
    progressSeconds: number,
    totalSeconds: number
  ) => {
    if (!dramaId || !episodeId || totalSeconds <= 0) return;
    setWatchHistory((prev) => ({
      ...prev,
      [dramaId]: {
        dramaId,
        episodeId,
        episodeNumber,
        progressSeconds: Math.floor(progressSeconds),
        totalSeconds: Math.floor(totalSeconds),
        updatedAt: Date.now(),
      },
    }));
  };

  const getDramaProgress = (dramaId: string) => {
    return watchHistory[dramaId];
  };

  const clearHistory = () => {
    setWatchHistory({});
    showToast('Sejarah tontonan telah dikosongkan', 'info');
  };

  const removeFromHistory = (dramaId: string) => {
    setWatchHistory((prev) => {
      const next = { ...prev };
      delete next[dramaId];
      return next;
    });
    showToast('Dikeluarkan daripada sejarah tontonan', 'info');
  };

  // Parse route parameters
  // Routes:
  // /
  // /drama-pendek
  // /filem
  // /cari
  // /senarai-saya
  // /butiran/:slug
  // /tonton/:slug (or /tonton/:slug/:episodeId)
  // /tonton-filem/:slug
  const parseParams = () => {
    const parts = currentRoute.split('/').filter(Boolean);
    if ((parts[0] === 'butiran' || parts[0] === 'tonton' || parts[0] === 'tonton-filem') && parts[1]) {
      return {
        slug: parts[1],
        episodeId: parts[2],
      };
    }
    return {};
  };

  const routeParams = parseParams();

  // Resolved list of saved dramas
  const savedDramas = DRAMAS_DATA.filter((d) => savedIds.includes(d.id));

  // Resolved list of history dramas sorted by updatedAt descending
  const historyEntries = Object.values(watchHistory).sort((a, b) => b.updatedAt - a.updatedAt);
  const historyDramas = historyEntries
    .map((prog) => {
      const drama = DRAMAS_DATA.find((d) => d.id === prog.dramaId);
      if (!drama) return null;
      return { drama, progress: prog };
    })
    .filter((item): item is { drama: Drama; progress: WatchProgress } => item !== null);

  return (
    <AppContext.Provider
      value={{
        savedIds,
        toggleSave,
        isSaved,
        savedDramas,
        watchHistory,
        saveWatchProgress,
        getDramaProgress,
        clearHistory,
        removeFromHistory,
        historyDramas,
        autoplayNext,
        setAutoplayNext,
        currentRoute,
        navigate,
        routeParams,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
