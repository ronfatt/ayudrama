import type { TopUpPackage } from '../types/drama';

export const EPISODE_UNLOCK_COST = 50; // Syiling setiap episod

export const TOP_UP_PACKAGES: TopUpPackage[] = [
  {
    id: 'pkg-rm5',
    priceRM: 5,
    coins: 500,
    bonusCoins: 0,
    tag: 'Permulaan',
  },
  {
    id: 'pkg-rm10',
    priceRM: 10,
    coins: 1000,
    bonusCoins: 100,
    tag: 'Paling Hangat',
    isPopular: true,
  },
  {
    id: 'pkg-rm20',
    priceRM: 20,
    coins: 2000,
    bonusCoins: 400,
    tag: 'Paling Berbaloi',
  },
  {
    id: 'pkg-rm50',
    priceRM: 50,
    coins: 5000,
    bonusCoins: 1500,
    tag: 'Nilai Maksimum',
  },
];

export const PAYMENT_METHODS = [
  {
    id: 'tng',
    name: "Touch 'n Go eWallet",
    description: 'Imbas & bayar melalui aplikasi eWallet TNG',
    icon: 'tng',
    badge: 'Disyorkan',
  },
  {
    id: 'duitnow',
    name: 'DuitNow QR',
    description: 'Semua bank tempatan & e-dompet Malaysia',
    icon: 'qr',
    badge: 'Pantas',
  },
  {
    id: 'fpx',
    name: 'FPX Online Banking',
    description: 'Maybank2u, CIMB Clicks, Bank Islam, RHB, Public Bank',
    icon: 'bank',
  },
  {
    id: 'grabpay',
    name: 'GrabPay',
    description: 'Bayar menggunakan baki akaun GrabPay anda',
    icon: 'grab',
  },
];
