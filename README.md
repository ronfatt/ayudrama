# Ayu Drama (MVP)
> **"Cerita dekat di hati."**  
> Platform penstriman drama pendek (9:16) dan filem (16:9) bercirikan budaya serta cita rasa masyarakat Malaysia.

---

## 🌟 Ciri-Ciri Utama Yang Telah Disiapkan

### 1. Rekaan Visual & Identiti Jenama (Ayu Drama)
- **Warna Jenama**: Latar belakang hitam pawagam sinematik (`#0A0C10`), lapisan *charcoal* mendalam, warna aksen merah karang (*Coral Red* `#FF4154`), dan sentuhan emas hangat (`#E5A93C`).
- **Logo & Tipografi**: Wordmark moden **ayu drama** dipadankan dengan fon *Plus Jakarta Sans*.
- **Sentuhan Tempatan**: Kandungan berlatarkan Kuala Lumpur, Bukit Bintang, Chow Kit, kampung halaman di Perak, dan Terengganu dengan lakonan watak dan bahasa Melayu yang asli serta bersahaja.

### 2. Dasar Tontonan: 30% Episod Percuma & Sistem Titik / Syiling
- **Dasar Percuma 30%**: Setiap siri drama secara automatik menyediakan 30% episod pertama secara percuma (contoh: episod 1 hingga 4 bagi siri 12 episod, episod 1 hingga 3 bagi siri 10 episod).
- **Episod Terkunci (Paywall)**: Episod melebihi had 30% dikunci dengan paparan visual elegan yang menyatakan status baki pengguna dan pilihan tebusan.
- **Tebusan Fleksibel**:
  - Buka episod tunggal: **50 Ayu Syiling** setiap episod.
  - Buka Pakej Penuh Siri: diskaun istimewa 20% bagi baki keseluruhan episod.
- **Ganjaran Harian**: Butang tebus 100 Syiling percuma setiap hari untuk penonton setia.

### 3. Pusat Pengguna Lengkap (Profil & Dompet Syiling)
- **Kad Pengguna & VIP**: Paparan nama, ID Pengguna, taraf keahlian (*VIP Ayu*), dan tarikh pendaftaran.
- **Baki Syiling Masa Nyata**: Terpapar pada palang navigasi atas (*Navbar*), pemain video, dan halaman profil.
- **4 Tab Pengurusan Utama**:
  1. **Sejarah Tontonan**: Senarai semua drama yang ditonton dengan peratusan kemajuan dan sambung tonton serta butang padam.
  2. **Simpanan Saya**: Koleksi siri dan filem yang ditanda buku.
  3. **Episod Dibuka**: Senarai episod yang telah berjaya ditebus menggunakan Syiling.
  4. **Rekod Transaksi**: Penyata terperinci bagi penambahan nilai dan penolakan syiling dengan cap waktu rasmi.
- **Modal Tambah Nilai (*Top Up*)**:
  - Pakej Syiling Malaysia: RM5 (500), RM10 (1,100 + bonus), RM20 (2,400 + bonus), RM50 (6,500 + bonus).
  - Kaedah pembayaran tempatan: **Touch 'n Go eWallet**, **DuitNow QR**, **FPX Online Banking**, dan **GrabPay**.

### 4. Pemain Drama Pendek Menegak (9:16 Immersive Player)
- **Navigasi Leret (Swipe Gestures)**: Leret ke atas atau ke bawah pada telefon pintar atau tatal tetikus (*wheel*) di komputer untuk bertukar episod.
- **Papan Kekunci Mesra Desktop**:
  - `↑` / `↓` : Tukar episod sebelum / seterusnya.
  - `Spasi` : Mainkan atau jeda video (*Play / Pause*).
  - `M` : Buka atau matikan audio (*Mute / Unmute*).
  - `F` : Mod skrin penuh (*Fullscreen*).
- **Laci Pilihan Episod (*Episode Drawer*)**: Senarai episod lengkap dengan durasi, penanda `Percuma`, `Dibuka` atau `50 Syiling 🔒`, dan status `Akan Datang`.
- **Sambung Episod Automatik (*Autoplay*)**: Bertukar secara automatik ke episod seterusnya apabila video tamat.
- **Pencegahan Pertindihan Audio**: Audio dan strim episod lama dihentikan sepenuhnya sebelum video baharu dimulakan.
- **Keselamatan Rangkaian**: Sokongan butang `Cuba Lagi` jika video gagal dimuatkan.

### 5. Pemain Filem Layar Lebar (16:9 Cinema Player)
- Pemain video moden 16:9 dengan kawalan penuh: palang kemajuan (*scrubber*), tetapan kelantangan, skrin penuh, dan pilihan sari kata Bahasa Melayu (*subtitles track*).

### 6. Navigasi & Pengurusan Storan Tempatan (localStorage)
- **Utama (`/`)**: Hero Banner sinematik, baris Sambung Menonton, Trending, Ayu Originals, dan pelbagai genre.
- **Drama Pendek (`/drama-pendek`)**: Hab penemuan drama menegak 9:16 dengan penapis kategori pantas.
- **Filem (`/filem`)**: Koleksi filem 16:9 dengan penapis genre.
- **Butiran Drama (`/butiran/:slug`)**: Sinopsis penuh, pelakon, pengarah, status episod (Percuma / Terkunci), dan cadangan karya serupa.
- **Carian Pintar (`/cari`)**: Carian masa nyata mengikut tajuk, sinopsis, watak, dan cadangan Carian Hangat.
- **Profil (`/profil`)**: Pusat akaun sehenti untuk baki syiling, tambah nilai, rekod transaksi, dan sejarah tontonan.
- **Navigasi Mudah Alih**: 5 tab utama (Utama, Drama, Cari, Senarai, Profil) yang menyembunyi secara automatik ketika mod penstriman imersif.

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
