import React from 'react';
import { DRAMAS_DATA } from '../data/dramas';
import { useApp } from '../context/AppContext';
import { HeroBanner } from '../components/home/HeroBanner';
import { ContentRow } from '../components/home/ContentRow';
import { AdBanner } from '../components/common/AdBanner';

export const UtamaPage: React.FC = () => {
  const { watchHistory, navigate } = useApp();

  const featuredDrama = DRAMAS_DATA.find((d) => d.isFeatured) || DRAMAS_DATA[0];

  // Continue Watching dramas (if in history)
  const continueWatchingDramas = Object.keys(watchHistory)
    .map((id) => DRAMAS_DATA.find((d) => d.id === id))
    .filter((d): d is typeof DRAMAS_DATA[0] => d !== undefined);

  // Grouped rows
  const trendingDramas = DRAMAS_DATA.filter((d) => d.isTrending);
  const shortDramasPilihan = DRAMAS_DATA.filter((d) => d.format === 'short_drama');
  const cintaKonflikDramas = DRAMAS_DATA.filter((d) => d.category === 'Cinta & Konflik' || d.genres.includes('Cinta'));
  const misteriDebaranDramas = DRAMAS_DATA.filter((d) => d.category === 'Misteri & Debaran' || d.genres.includes('Misteri') || d.genres.includes('Aksi'));
  const ayuOriginalsDramas = DRAMAS_DATA.filter((d) => d.isAyuOriginal);
  const filemDramas = DRAMAS_DATA.filter((d) => d.format === 'movie');

  return (
    <div className="min-h-screen pb-24 md:pb-16 animate-fade-in">
      {/* Hero Showcase */}
      <HeroBanner drama={featuredDrama} />

      {/* Rows of Content */}
      <div className="space-y-4 sm:space-y-8 -mt-6 sm:-mt-10 relative z-20">
        {/* Sambung Menonton (Continue Watching) */}
        {continueWatchingDramas.length > 0 && (
          <ContentRow
            title="Sambung Menonton"
            subtitle="Teruskan episod dari mana anda berhenti"
            dramas={continueWatchingDramas}
            progressMap={watchHistory}
            aspect="9/16"
            onViewAll={() => navigate('/senarai-saya')}
          />
        )}

        {/* Trending Minggu Ini */}
        <ContentRow
          title="Trending Minggu Ini"
          subtitle="Drama paling hangat dibualkan di Malaysia"
          dramas={trendingDramas}
          progressMap={watchHistory}
          aspect="9/16"
          onViewAll={() => navigate('/drama-pendek')}
        />

        {/* Drama Pendek Pilihan */}
        <ContentRow
          title="Drama Pendek Pilihan"
          subtitle="Kisah padat beremosi, tonton episod bila-bila masa"
          dramas={shortDramasPilihan}
          progressMap={watchHistory}
          aspect="9/16"
          onViewAll={() => navigate('/drama-pendek')}
        />

        {/* Sponsor Banner: D'Ayu Pictures (https://d.ayupictures.com) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <AdBanner />
        </div>

        {/* Cinta & Konflik */}
        <ContentRow
          title="Cinta & Konflik"
          subtitle="Getaran rasa, rahsia hati dan dendam membara"
          dramas={cintaKonflikDramas}
          progressMap={watchHistory}
          aspect="9/16"
        />

        {/* Ayu Originals */}
        <ContentRow
          title="Ayu Originals"
          subtitle="Karya eksklusif diterbitkan khusus untuk penonton setia Ayu Drama"
          dramas={ayuOriginalsDramas}
          progressMap={watchHistory}
          aspect="9/16"
        />

        {/* Misteri & Debaran */}
        <ContentRow
          title="Misteri & Debaran"
          subtitle="Detik mendebarkan yang meremang bulu roma"
          dramas={misteriDebaranDramas}
          progressMap={watchHistory}
          aspect="9/16"
        />

        {/* Koleksi Filem D'Ayu Pictures */}
        <ContentRow
          title="Koleksi Filem Rasmi D'Ayu Pictures"
          subtitle="Naskhah layar perak terhebat termasuk Sheriff, Daddyku Gangster & Harum Malam"
          dramas={filemDramas}
          progressMap={watchHistory}
          aspect="16/9"
          onViewAll={() => navigate('/filem')}
        />
      </div>
    </div>
  );
};
