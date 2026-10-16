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
