# Discord Bot Manager

Platform manajemen bot Discord yang komprehensif dengan control center, auto-posting, dan monitoring real-time. Dibangun menggunakan React, Express.js, dan PostgreSQL.

## 🚀 Fitur Utama

- **Dashboard Real-time** - Monitor status bot dan aktivitas secara langsung
- **Control Center** - Kontrol terpusat untuk start/stop semua bot
- **Bot Configuration** - Kelola konfigurasi bot Discord dengan mudah
- **Auto Poster** - Jadwalkan pesan otomatis dengan cron expressions
- **Auto Responder** - Atur respons otomatis berdasarkan trigger pesan
- **Analytics** - Statistik performa dan penggunaan bot
- **Template Manager** - Kelola template pesan yang dapat digunakan ulang

## 🛠️ Teknologi yang Digunakan

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui components
- TanStack Query (state management)
- Wouter (routing)

### Backend
- Node.js + Express.js
- PostgreSQL + Drizzle ORM
- Discord.js v14
- Cron (task scheduling)

## 📋 Prasyarat

Pastikan kamu sudah menginstall:
- Node.js 20 atau lebih baru
- PostgreSQL database
- Discord Bot Token (dari Discord Developer Portal)

## ⚡ Quick Start

### 1. Clone dan Install Dependencies

```bash
# Clone repository ini
git clone <repository-url>
cd discord-bot-manager

# Install dependencies
npm install
```

### 2. Setup Database

```bash
# Jalankan migrasi database
npm run db:push
```

### 3. Konfigurasi Environment

Environment variables sudah dikonfigurasi otomatis oleh Replit:
- `DATABASE_URL` - URL koneksi PostgreSQL
- `NODE_ENV` - Mode environment (development/production)

### 4. Jalankan Aplikasi

```bash
# Mode development (recommended)
npm run dev

# Mode production
npm run build
npm start
```

Aplikasi akan berjalan di `http://localhost:5000`

## 🎯 Cara Penggunaan

### 1. Mendapatkan Discord Bot Token

1. Buka [Discord Developer Portal](https://discord.com/developers/applications)
2. Klik "New Application" dan beri nama bot
3. Masuk ke tab "Bot" di sidebar kiri
4. Klik "Reset Token" dan copy token yang muncul
5. **Simpan token ini dengan aman!**

### 2. Mendapatkan Server ID

1. Buka Discord dan aktifkan Developer Mode:
   - Settings → Advanced → Developer Mode (ON)
2. Klik kanan pada server yang ingin dikelola
3. Pilih "Copy Server ID"
4. Paste ID ini saat menambahkan bot

### 3. Menambahkan Bot Baru

1. Buka aplikasi di browser
2. Klik tombol "Add Bot" di Dashboard
3. Isi form dengan informasi bot:
   - **Bot Name**: Nama untuk identifikasi bot
   - **Bot Token**: Token dari Discord Developer Portal
   - **Server ID**: ID server Discord target
   - **Server Name**: Nama server (opsional)
4. Klik "Create Bot"

### 4. Menjalankan Bot

1. Masuk ke halaman **Control Center**
2. Klik tombol "Start" pada bot yang ingin dijalankan
3. Bot akan otomatis connect ke Discord server
4. Status bot akan berubah menjadi "Online" dengan indikator hijau

### 5. Konfigurasi Auto Features

#### Auto Poster
- Masuk ke halaman **Auto Poster**
- Atur jadwal pesan otomatis menggunakan cron expressions
- Contoh: `0 9 * * *` (setiap hari jam 9 pagi)

#### Auto Responder  
- Masuk ke halaman **Auto Responder**
- Buat aturan respons otomatis berdasarkan:
  - Kata kunci exact match
  - Kata yang mengandung teks tertentu
  - Pattern regex

## 📊 Monitoring dan Analytics

### Dashboard Stats
- Total bots yang dikonfigurasi
- Jumlah bot yang aktif
- Total pesan yang dikirim
- Jumlah server yang terhubung

### Activity Logs
- Log semua aktivitas bot secara real-time
- Filter berdasarkan bot atau tipe aktivitas
- Tracking error dan status changes

### Real-time Updates
- Data diperbarui otomatis setiap 5 detik
- Indikator status real-time (hijau/merah/kuning)
- Auto-refresh untuk monitoring berkelanjutan

## 🔧 Scripts Available

```bash
# Development dengan hot reload
npm run dev

# Build untuk production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database migration
npm run db:push
```

## 📁 Struktur Project

```
discord-bot-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── services/          # Business logic
│   ├── routes.ts          # API endpoints
│   └── storage.ts         # Database layer
├── shared/                # Shared types & schema
└── migrations/            # Database migrations
```

## 🎨 UI Theme

Aplikasi menggunakan tema Discord dengan:
- **Dark theme** sebagai default
- **Color palette** yang konsisten dengan Discord
- **Glass effects** dan hover animations
- **Responsive design** untuk desktop dan mobile

## ⚠️ Troubleshooting

### Bot tidak bisa connect
1. Pastikan token Discord valid dan tidak expired
2. Cek apakah bot sudah diinvite ke server dengan permissions yang cukup
3. Verifikasi Server ID sudah benar

### Database connection error
1. Pastikan PostgreSQL service berjalan
2. Cek environment variable `DATABASE_URL`
3. Jalankan `npm run db:push` untuk migrasi

### Port already in use
1. Pastikan tidak ada aplikasi lain yang menggunakan port 5000
2. Atau ubah port di konfigurasi jika diperlukan

## 🔐 Security Notes

- **Jangan pernah share Discord Bot Token** di public repository
- Token disimpan di database, pastikan database secure
- Gunakan environment variables untuk konfigurasi sensitif

## 📞 Support

Jika mengalami masalah atau butuh bantuan:
1. Cek logs di console untuk error details
2. Pastikan semua dependencies terinstall dengan benar
3. Verifikasi konfigurasi Discord bot permissions

---

**Selamat menggunakan Discord Bot Manager!** 🤖✨