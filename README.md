# Ayu Drama (MVP)
> **"Cerita dekat di hati."**  
> Platform penstriman drama pendek (9:16) dan filem (16:9) bercirikan budaya serta cita rasa masyarakat Malaysia.

---

## 🌟 Ciri-Ciri Utama Yang Telah Disiapkan

### 1. Rekaan Visual & Identiti Jenama (Ayu Drama)
- **Warna Jenama**: Latar belakang hitam pawagam sinematik (`#0A0C10`), lapisan *charcoal* mendalam, warna aksen merah karang (*Coral Red* `#FF4154`), dan sentuhan emas hangat (`#E5A93C`).
- **Logo & Tipografi**: Wordmark moden **ayu drama** dipadankan dengan fon *Plus Jakarta Sans*.
- **Sentuhan Tempatan**: Kandungan berlatarkan Kuala Lumpur, Bukit Bintang, Chow Kit, kampung halaman di Perak, dan Terengganu dengan lakonan watak dan bahasa Melayu yang asli serta bersahaja.

### 2. Pemain Drama Pendek Menegak (9:16 Immersive Player)
- **Navigasi Leret (Swipe Gestures)**: Leret ke atas atau ke bawah pada telefon pintar atau tatal tetikus (*wheel*) di komputer untuk bertukar episod.
- **Papan Kekunci Mesra Desktop**:
  - `↑` / `↓` : Tukar episod sebelum / seterusnya.
  - `Spasi` : Mainkan atau jeda video (*Play / Pause*).
  - `M` : Buka atau matikan audio (*Mute / Unmute*).
  - `F` : Mod skrin penuh (*Fullscreen*).
- **Laci Pilihan Episod (*Episode Drawer*)**: Senarai episod lengkap dengan durasi, sinopsis pendek, dan status `Akan Datang`.
- **Sambung Episod Automatik (*Autoplay*)**: Bertukar secara automatik ke episod seterusnya apabila video tamat, dengan pilihan togol buka/tutup.
- **Pencegahan Pertindihan Audio**: Audio dan strim episod lama dihentikan sepenuhnya sebelum video baharu dimulakan.
- **Keselamatan Rangkaian**: Sokongan butang `Cuba Lagi` jika video gagal dimuatkan serta mod pratonton apabila pelayar menyekat automain berbunyi.

### 3. Pemain Filem Layar Lebar (16:9 Cinema Player)
- Pemain video moden 16:9 dengan kawalan penuh: palang kemajuan (*scrubber*), tetapan kelantangan, skrin penuh, dan pilihan sari kata Bahasa Melayu (*subtitles track*).

### 4. Navigasi & Pengurusan Storan Tempatan (localStorage)
- **Utama (`/`)**: Paparan sepanduk wira (*Hero Banner*), baris *Sambung Menonton*, *Trending*, *Ayu Originals*, dan pelbagai genre.
- **Drama Pendek (`/drama-pendek`)**: Hab penemuan drama menegak 9:16 dengan penapis kategori pantas.
- **Filem (`/filem`)**: Koleksi filem 16:9 dengan penapis genre.
- **Butiran Drama (`/butiran/:slug`)**: Sinopsis penuh, barisan pelakon, pengarah, senarai episod berstatus tontonan, serta cadangan karya serupa.
- **Carian Pintar (`/cari`)**: Carian masa nyata (*real-time*) mengikut tajuk, sinopsis, watak, dan cadangan *Carian Hangat*.
- **Senarai Saya (`/senarai-saya`)**: Pengasingan tab antara **Simpanan Saya** (drama yang disimpan) dan **Sejarah Tontonan** (dengan peratusan tontonan dan butang kosongkan rekod).
- **Penolakan Telus & Ketelusan MVP**: Rekod peranti disimpan secara selamat pada pelayar pengguna tanpa mengelirukan penonton dengan butang pembayaran atau akaun palsu.

---

## 🚀 Panduan Menjalankan Projek

```bash
# Pasang pakej kebergantungan (Node.js v20+)
npm install

# Jalankan pelayan pembangunan tempatan
npm run dev

# Bina fail pengeluaran
npm run build
```

Aplikasi sedia dibuka di pelayar melalui:  
👉 `http://localhost:5173/`
