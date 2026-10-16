export type DramaFormat = 'short_drama' | 'movie';

export interface SubtitleTrack {
  label: string;
  lang: string;
  src: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: string;
  synopsis: string;
  videoUrl: string;
  thumbnail: string;
  status: 'available' | 'coming_soon';
  subtitles?: SubtitleTrack[];
}

export interface Drama {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  synopsis: string;
  genres: string[];
  year: number;
  rating: 'U' | 'P13' | '16' | '18';
  format: DramaFormat;
  aspectRatio: '9/16' | '16/9';
  poster: string;
  banner: string;
  totalEpisodes: number;
  isAyuOriginal?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  category: 'Cinta & Konflik' | 'Misteri & Debaran' | 'Ayu Originals' | 'Drama Pendek Pilihan' | 'Filem Popular';
  cast: string[];
  director?: string;
  episodes: Episode[];
}

export interface WatchProgress {
  dramaId: string;
  episodeId: string;
  episodeNumber: number;
  progressSeconds: number;
  totalSeconds: number;
  updatedAt: number;
}

export interface CoinTransaction {
  id: string;
  type: 'recharge' | 'unlock_episode' | 'unlock_bundle' | 'bonus';
  amount: number; // positive for recharge/bonus, negative for unlock
  title: string;
  description: string;
  timestamp: number;
  paymentMethod?: string;
}

export interface TopUpPackage {
  id: string;
  priceRM: number;
  coins: number;
  bonusCoins: number;
  tag?: string;
  isPopular?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  memberTier: 'Ahli Biasa' | 'VIP Ayu' | 'VIP Premium';
  joinDate: string;
}
