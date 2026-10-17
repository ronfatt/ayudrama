import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Drama, WatchProgress, CoinTransaction, Episode, UserProfile } from '../types/drama';
import { DRAMAS_DATA } from '../data/dramas';
import { EPISODE_UNLOCK_COST } from '../data/packages';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // User Profile
  userProfile: UserProfile;

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

  // Coins & Unlocking (Paywall 30% Free Mechanism)
  coinsBalance: number;
  unlockedEpisodes: string[];
  transactions: CoinTransaction[];
  getFreeEpisodeCount: (totalEpisodes: number) => number;
  isEpisodeFree: (episodeNumber: number, totalEpisodes: number) => boolean;
  isEpisodeUnlocked: (dramaId: string, episodeId: string, episodeNumber: number, totalEpisodes: number) => boolean;
  unlockEpisode: (drama: Drama, episode: Episode, cost?: number) => { success: boolean; message: string };
  unlockAllEpisodes: (drama: Drama) => { success: boolean; message: string };
  rechargeCoins: (packageName: string, coinsTotal: number, priceRM: number, paymentMethodName: string) => void;
  claimDailyBonus: () => void;

  // Top Up Modal Control
  isTopUpOpen: boolean;
  openTopUp: () => void;
  closeTopUp: () => void;

  // 5-Second Ad Modal & Rewards (d.ayupictures.com)
  isAdModalOpen: boolean;
  adRewardType: 'coins' | 'unlock_episode';
  targetEpisodeToUnlock: { drama: Drama; episode: Episode } | null;
  openAdModal: (options?: { rewardType?: 'coins' | 'unlock_episode'; drama?: Drama; episode?: Episode }) => void;
  closeAdModal: () => void;
  completeAdReward: () => void;

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
const COINS_STORAGE_KEY = 'ayu_drama_coins_balance_v1';
const UNLOCKED_STORAGE_KEY = 'ayu_drama_unlocked_episodes_v1';
const TRANSACTIONS_STORAGE_KEY = 'ayu_drama_transactions_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Profile
  const [userProfile] = useState<UserProfile>({
    id: 'AYU-88294',
    name: 'Ahmad Faiz',
    email: 'faiz.ahmad@aiway.my',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
    memberTier: 'VIP AIWAY',
    joinDate: 'Oktober 2025',
  });

  // Saved List
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['ayu-sd-01', 'ayu-sd-03'];
    } catch {
      return ['ayu-sd-01', 'ayu-sd-03'];
    }
  });

  // Watch History
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

  // Coins Balance (Default 150 Ayu Syiling for fresh interactive testing)
  const [coinsBalance, setCoinsBalance] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(COINS_STORAGE_KEY);
      return stored !== null ? JSON.parse(stored) : 150;
    } catch {
      return 150;
    }
  });

  // Unlocked Episodes list: format "dramaId:episodeId"
  const [unlockedEpisodes, setUnlockedEpisodes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(UNLOCKED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Transactions log
  const [transactions, setTransactions] = useState<CoinTransaction[]>(() => {
    try {
      const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [
        {
          id: 'tx-welcome-01',
          type: 'bonus',
          amount: 150,
          title: 'Hadiah Alu-aluan Pendaftaran',
          description: '150 Ayu Syiling percuma untuk menonton drama kegemaran anda.',
          timestamp: Date.now() - 86400000,
        }
      ];
    } catch {
      return [];
    }
  });

  // Top Up Modal open state
  const [isTopUpOpen, setIsTopUpOpen] = useState<boolean>(false);

  // 5-Second Rewarded Ad Modal State (d.ayupictures.com)
  const [isAdModalOpen, setIsAdModalOpen] = useState<boolean>(false);
  const [adRewardType, setAdRewardType] = useState<'coins' | 'unlock_episode'>('coins');
  const [targetEpisodeToUnlock, setTargetEpisodeToUnlock] = useState<{ drama: Drama; episode: Episode } | null>(null);

  // Autoplay
  const [autoplayNext, setAutoplayNext] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(AUTOPLAY_STORAGE_KEY);
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  // Routing
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '') || '/';
    return hash;
  });

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedIds));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(watchHistory));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [watchHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTOPLAY_STORAGE_KEY, JSON.stringify(autoplayNext));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [autoplayNext]);

  useEffect(() => {
    try {
      localStorage.setItem(COINS_STORAGE_KEY, JSON.stringify(coinsBalance));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [coinsBalance]);

  useEffect(() => {
    try {
      localStorage.setItem(UNLOCKED_STORAGE_KEY, JSON.stringify(unlockedEpisodes));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [unlockedEpisodes]);

  useEffect(() => {
    try {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [transactions]);

  // Listen to hash change
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
    }, 3200);
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

  // ==================== 30% FREE PAYWALL LOGIC ====================
  // Calculate free episode count (30% of total episodes)
  const getFreeEpisodeCount = (totalEpisodes: number) => {
    if (totalEpisodes <= 1) return 1;
    return Math.max(1, Math.ceil(totalEpisodes * 0.3));
  };

  // Check if an episode is inherently free under the 30% policy
  const isEpisodeFree = (episodeNumber: number, totalEpisodes: number) => {
    const freeCount = getFreeEpisodeCount(totalEpisodes);
    return episodeNumber <= freeCount;
  };

  // Check if an episode is accessible (either free OR already unlocked by user)
  const isEpisodeUnlocked = (
    dramaId: string,
    episodeId: string,
    episodeNumber: number,
    totalEpisodes: number
  ) => {
    if (isEpisodeFree(episodeNumber, totalEpisodes)) return true;
    const unlockKey = `${dramaId}:${episodeId}`;
    return unlockedEpisodes.includes(unlockKey);
  };

  // Unlock single episode
  const unlockEpisode = (
    drama: Drama,
    episode: Episode,
    cost: number = EPISODE_UNLOCK_COST
  ): { success: boolean; message: string } => {
    const unlockKey = `${drama.id}:${episode.id}`;

    if (unlockedEpisodes.includes(unlockKey)) {
      return { success: true, message: 'Episod ini telah pun dibuka sebelum ini.' };
    }

    if (coinsBalance < cost) {
      showToast(`Baki Syiling tidak cukup (${coinsBalance}/${cost}). Sila tambah nilai.`, 'warning');
      setIsTopUpOpen(true);
      return { success: false, message: 'Baki syiling tidak mencukupi.' };
    }

    // Deduct coins and record unlock
    setCoinsBalance((prev) => prev - cost);
    setUnlockedEpisodes((prev) => [...prev, unlockKey]);

    const newTx: CoinTransaction = {
      id: `tx-unlock-${Date.now()}`,
      type: 'unlock_episode',
      amount: -cost,
      title: `Buka Episod ${episode.episodeNumber}`,
      description: `${drama.title} - ${episode.title}`,
      timestamp: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(`Episod ${episode.episodeNumber} berjaya dibuka! (-${cost} Syiling)`, 'success');
    return { success: true, message: 'Episod berjaya dibuka.' };
  };

  // Unlock all remaining locked episodes of a series with 20% bundle discount
  const unlockAllEpisodes = (drama: Drama): { success: boolean; message: string } => {
    const lockedEpisodes = drama.episodes.filter(
      (ep) => !isEpisodeUnlocked(drama.id, ep.id, ep.episodeNumber, drama.totalEpisodes)
    );

    if (lockedEpisodes.length === 0) {
      showToast('Semua episod dalam siri ini telah pun dibuka!', 'info');
      return { success: true, message: 'Semua episod sudah dibuka.' };
    }

    // 20% discount on bundle
    const rawCost = lockedEpisodes.length * EPISODE_UNLOCK_COST;
    const bundleCost = Math.round(rawCost * 0.8);

    if (coinsBalance < bundleCost) {
      showToast(
        `Baki Syiling tidak mencukupi untuk membuka pakej siri (${coinsBalance}/${bundleCost} Syiling).`,
        'warning'
      );
      setIsTopUpOpen(true);
      return { success: false, message: 'Baki syiling tidak mencukupi.' };
    }

    // Deduct and unlock all
    setCoinsBalance((prev) => prev - bundleCost);
    const newKeys = lockedEpisodes.map((ep) => `${drama.id}:${ep.id}`);
    setUnlockedEpisodes((prev) => [...prev, ...newKeys]);

    const newTx: CoinTransaction = {
      id: `tx-bundle-${Date.now()}`,
      type: 'unlock_bundle',
      amount: -bundleCost,
      title: `Buka Pakej Siri Penuh: ${drama.title}`,
      description: `Membuka baki ${lockedEpisodes.length} episod dengan diskaun istimewa 20%.`,
      timestamp: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(
      `Pakej penuh berjaya dibuka! (-${bundleCost} Syiling untuk ${lockedEpisodes.length} episod)`,
      'success'
    );
    return { success: true, message: 'Semua episod berjaya dibuka.' };
  };

  // Top Up / Recharge Coins
  const rechargeCoins = (
    packageName: string,
    coinsTotal: number,
    priceRM: number,
    paymentMethodName: string
  ) => {
    setCoinsBalance((prev) => prev + coinsTotal);

    const newTx: CoinTransaction = {
      id: `tx-topup-${Date.now()}`,
      type: 'recharge',
      amount: coinsTotal,
      title: `Tambah Nilai: ${packageName}`,
      description: `Bayaran RM${priceRM.toFixed(2)} melalui ${paymentMethodName}.`,
      timestamp: Date.now(),
      paymentMethod: paymentMethodName,
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(`Tambah nilai RM${priceRM} berjaya! +${coinsTotal} Ayu Syiling`, 'success');
    setIsTopUpOpen(false);
  };

  // Claim Daily Free Bonus for testing
  const claimDailyBonus = () => {
    const bonus = 100;
    setCoinsBalance((prev) => prev + bonus);

    const newTx: CoinTransaction = {
      id: `tx-bonus-${Date.now()}`,
      type: 'bonus',
      amount: bonus,
      title: 'Ganjaran Harian Penonton Setia',
      description: 'Ganjaran harian 100 Ayu Syiling percuma untuk meneruskan tontonan.',
      timestamp: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(`Tahniah! Anda menerima +${bonus} Ayu Syiling percuma.`, 'success');
  };

  // 5-Second Rewarded Ad Handlers (https://d.ayupictures.com)
  const openAdModal = (options?: {
    rewardType?: 'coins' | 'unlock_episode';
    drama?: Drama;
    episode?: Episode;
  }) => {
    setAdRewardType(options?.rewardType || 'coins');
    setTargetEpisodeToUnlock(
      options?.drama && options?.episode
        ? { drama: options.drama, episode: options.episode }
        : null
    );
    setIsAdModalOpen(true);
  };

  const closeAdModal = () => {
    setIsAdModalOpen(false);
  };

  const completeAdReward = () => {
    if (adRewardType === 'unlock_episode' && targetEpisodeToUnlock) {
      const { drama, episode } = targetEpisodeToUnlock;
      const unlockKey = `${drama.id}:${episode.id}`;
      if (!unlockedEpisodes.includes(unlockKey)) {
        setUnlockedEpisodes((prev) => [...prev, unlockKey]);
        const newTx: CoinTransaction = {
          id: `tx-ad-${Date.now()}`,
          type: 'ad_reward',
          amount: 0,
          title: `Buka Episod ${episode.episodeNumber} (Tonton Iklan)`,
          description: `Episod ${episode.title} dibuka percuma selepas menonton iklan 5 saat D'Ayu Pictures (d.ayupictures.com).`,
          timestamp: Date.now(),
        };
        setTransactions((prev) => [newTx, ...prev]);
        showToast(
          `Tahniah! Episod ${episode.episodeNumber} berjaya dibuka percuma selepas menonton iklan D'Ayu Pictures!`,
          'success'
        );
      }
    } else {
      // Default: reward coins (+50 Ayu Syiling)
      const rewardCoins = 50;
      setCoinsBalance((prev) => prev + rewardCoins);
      const newTx: CoinTransaction = {
        id: `tx-ad-${Date.now()}`,
        type: 'ad_reward',
        amount: rewardCoins,
        title: "Ganjaran Iklan D'Ayu Pictures",
        description: 'Menerima 50 Ayu Syiling percuma dengan menonton iklan 5 saat di d.ayupictures.com.',
        timestamp: Date.now(),
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(
        `Tahniah! Anda menerima +${rewardCoins} Ayu Syiling percuma selepas menonton iklan!`,
        'success'
      );
    }
    setIsAdModalOpen(false);
  };

  // Parse route parameters
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

  const savedDramas = DRAMAS_DATA.filter((d) => savedIds.includes(d.id));

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
        userProfile,
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

        // 30% Free & Coins Paywall
        coinsBalance,
        unlockedEpisodes,
        transactions,
        getFreeEpisodeCount,
        isEpisodeFree,
        isEpisodeUnlocked,
        unlockEpisode,
        unlockAllEpisodes,
        rechargeCoins,
        claimDailyBonus,

        // Top up modal
        isTopUpOpen,
        openTopUp: () => setIsTopUpOpen(true),
        closeTopUp: () => setIsTopUpOpen(false),

        // 5-Second Ad Modal & Rewards
        isAdModalOpen,
        adRewardType,
        targetEpisodeToUnlock,
        openAdModal,
        closeAdModal,
        completeAdReward,

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
