<div align="center">

# 🚗 Erlangga Rental Mobil

**Sistem manajemen rental mobil berbasis web — dari booking sampai laporan keuangan, dalam satu aplikasi.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth%20%2B%20RLS-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![CI](https://github.com/ersetdigital-sudo/rentalmobil/actions/workflows/ci.yml/badge.svg)](https://github.com/ersetdigital-sudo/rentalmobil/actions/workflows/ci.yml)

[Fitur](#-fitur-unggulan) · [Tech Stack](#-tech-stack) · [Arsitektur](#-arsitektur) · [Memulai](#-memulai) · [Deploy](#-deploy) · [Struktur](#-struktur-project)

</div>

---

## 📖 Tentang Project

Aplikasi ini dibangun untuk menjalankan operasional harian sebuah usaha rental mobil: **booking & kontrak sewa, manajemen armada & pelanggan, blacklist otomatis, denda keterlambatan, pembayaran + nota cetak (80mm thermal & PDF), QRIS, pengeluaran operasional, hingga laporan keuangan bulanan/tahunan.**

Didesain **mobile-first** (dipakai dari HP Android/iPhone di lapangan) namun tetap nyaman dipakai di laptop — lengkap dengan **PWA** sehingga bisa di-*install* ke home screen seperti aplikasi native.

> 🇮🇩 UI dan dokumentasi dalam Bahasa Indonesia. Kode, commit, dan struktur project mengikuti konvensi umum agar mudah dikontribusikan.

**Developer:** ersetdigital-sudo · **Status:** Production — dipakai operasional harian

## ✨ Fitur Unggulan

| Fitur | Deskripsi |
|---|---|
| 🔐 **Autentikasi Admin** | Multi-user, password di-hash & dikelola Supabase Auth, semua route dilindungi middleware Next.js |
| 📊 **Dashboard** | Ringkasan real-time: armada tersedia/disesewa, booking aktif, pendapatan bulan berjalan |
| 🚘 **Manajemen Armada** | CRUD mobil + tarif harian, status ketersediaan, foto (upload/URL) |
| 👥 **Data Pelanggan** | CRUD dengan NIK unik; **scan KTP otomatis via OCR** — foto KTP di-upload, data NIK/nama/alamat terisi sendiri |
| ⛔ **Blacklist Otomatis** | Daftar pelanggan bermasalah; sistem **memperingatkan otomatis** saat NIK terdaftar muncul di form booking |
| 📅 **Booking & Kontrak** | Pilih mobil & pelanggan, durasi dan total biaya terhitung otomatis |
| ⏰ **Denda Keterlambatan** | Denda per jam dihitung otomatis saat pengembalian, tarif bisa diatur |
| 💳 **Pembayaran & Nota** | Status Lunas/Belum Bayar, cetak nota **thermal 80mm** & **PDF** |
| 📱 **QRIS** | Halaman QRIS untuk pembayaran cashless |
| 💸 **Pengeluaran** | Catat servis, pajak, oli, dll — untuk perhitungan laba bersih |
| 📈 **Laporan** | Bulanan, tahunan, pengeluaran, riwayat rental — siap cetak, filter zona waktu **Asia/Jakarta (WIB)** |

### Highlight Teknis

- **OCR KTP** — integrasi OCR.space + Cloudinary (kompresi gambar server-side sebelum dikirim ke OCR), parser custom untuk NIK, nama, dan alamat berlapis (RT/RW, kel/desa, kecamatan, kabupaten).
- **Multi-timezone safety** — filter laporan & dashboard dikunci ke `Asia/Jakarta` agar tidak terjadi *timezone drift* antara server UTC dan waktu lokal.
- **Keamanan berlapis** — Row Level Security (RLS) di semua tabel + middleware auth di level route.
- **Nota thermal** — pengalaman print 80mm via `window.open` + CSS `@page`, hasil uji coba iteratif dengan printer thermal fisik.

## 🛠 Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) + React 19 |
| Bahasa | TypeScript (strict) |
| Styling | Tailwind CSS 3.4 |
| Database | PostgreSQL (Supabase) dengan Row Level Security |
| Auth | Supabase Auth (`@supabase/ssr`, browser + server + middleware) |
| Media | Cloudinary (upload & transformasi gambar) |
| OCR | [OCR.space](https://ocr.space/ocrapi) API |
| Icon | lucide-react |
| CI | GitHub Actions — lint & build pada setiap push/PR |

## 🏗 Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (PWA)                        │
│     Next.js App Router · React 19 · Tailwind · lucide       │
└──────────────┬──────────────────────────────┬───────────────┘
               │ Server Components / Actions   │ Route Handlers
┌──────────────▼──────────────────────────────▼───────────────┐
│                      Next.js Server                         │
│  middleware.ts (auth guard) · /api/ocr-ktp · /api/upload-*  │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
     ┌─────────▼─────────┐         ┌──────────▼──────────┐
     │      Supabase     │         │      Cloudinary     │
     │  Postgres + RLS   │         │  upload + transform │
     │   Auth (admin)    │         └──────────┬──────────┘
     └───────────────────┘                    │
                                  ┌──────────▼──────────┐
                                  │      OCR.space      │
                                  │   ekstraksi KTP     │
                                  └─────────────────────┘
```

## 🚀 Memulai

**Prasyarat:** Node.js 18.18+ dan npm.

### 1 · Clone & install

```bash
git clone https://github.com/ersetdigital-sudo/rentalmobil.git
cd rentalmobil
npm install
```

### 2 · Siapkan layanan eksternal

| Layanan | Kegunaan | Tier gratis |
|---|---|---|
| [Supabase](https://supabase.com) | Database, auth, RLS | ✅ |
| [Cloudinary](https://cloudinary.com/console) | Upload foto KTP & mobil | ✅ |
| [OCR.space](https://ocr.space/ocrapi) | Ekstraksi teks KTP | ✅ |

### 3 · Setup database

1. Buat project Supabase (region **Singapore** untuk Indonesia)
2. Buka **SQL Editor → New query**, jalankan seluruh isi [`supabase/schema.sql`](supabase/schema.sql)
   → tabel, trigger, RLS, dan data awal dibuat otomatis

### 4 · Buat akun admin

**Authentication → Users → Add user** — setiap akun otomatis tercatat di tabel `admins` (via trigger).

### 5 · Konfigurasi environment

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

OCR_SPACE_API_KEY=your-ocr-space-api-key
```

### 6 · Jalankan

```bash
npm run dev        # http://localhost:3000
```

## ☁️ Deploy

Rekomendasi: **Vercel** (gratis).

1. Import repo di [vercel.com](https://vercel.com) → **New Project**
2. Tambahkan environment variables yang sama seperti `.env.local`
3. Deploy — selesai 🎉 Aplikasi bisa di-install ke home screen HP (PWA)

## 📁 Struktur Project

```
src/
├── app/
│   ├── (auth)/login/          # Halaman login
│   ├── (app)/                 # Halaman terproteksi (guard via middleware)
│   │   ├── dashboard/         #   Ringkasan operasional & keuangan
│   │   ├── mobil/             #   CRUD armada + tarif
│   │   ├── pelanggan/         #   CRUD pelanggan + scan KTP (OCR)
│   │   ├── blacklist/         #   Blacklist + peringatan otomatis
│   │   ├── booking/           #   Booking, denda, pembayaran, nota
│   │   ├── pengeluaran/       #   Pengeluaran operasional
│   │   ├── qris/              #   Pembayaran QRIS
│   │   ├── laporan/           #   Laporan bulanan/tahunan/pengeluaran/riwayat
│   │   └── pengaturan/        #   Tarif denda & akun admin
│   └── api/
│       ├── ocr-ktp/           # Proxy OCR.space + parser KTP
│       └── upload-image/, upload-ktp/   # Signed upload ke Cloudinary
├── components/
│   ├── ui/                    # Design system: Button, Card, Modal, Toast, DataTable, dst.
│   └── <fitur>/               # Client components per fitur
├── lib/
│   ├── supabase/              # Client browser/server + helper middleware
│   ├── queries.ts             # Server-side data fetchers
│   ├── types.ts               # Type definitions
│   └── utils.ts               # Format Rupiah, tanggal, hitung denda
└── middleware.ts              # Auth guard semua route /dashboard/*

supabase/
└── schema.sql                 # Skema lengkap: tabel, trigger, RLS, seed
```

## 🔐 Keamanan

- **Row Level Security (RLS)** aktif di semua tabel — hanya user ter-autentikasi yang bisa membaca/menulis data
- **Middleware Next.js** melindungi seluruh route privat
- Password di-hash & dikelola **Supabase Auth** (standar industri)
- Kredensial Cloudinary/OCR hanya di server (API routes), tidak pernah tampil di browser

## 🧪 Quality

- ✅ TypeScript strict — `tsc --noEmit` lolos tanpa error
- ✅ `next build` sukses (CI: lint + build via GitHub Actions)
- ✅ Zero secret di repository — semua kredensial via environment variables

## 🆘 Troubleshooting

| Masalah | Solusi |
|---|---|
| Login gagal | Pastikan akun dibuat di Authentication → Users dan email terverifikasi (atau matikan *Confirm email* di Auth settings) |
| Data tidak muncul | Pastikan `schema.sql` sudah dijalankan & env vars terisi benar |
| Tidak bisa tambah data | Cek RLS — pastikan `schema.sql` berjalan tanpa error |
| Scan KTP gagal | Cek `OCR_SPACE_API_KEY` & kredensial Cloudinary di `.env.local` |
| Mobil tidak kembali "Tersedia" | Pastikan booking diselesaikan + ditandai "Lunas" |

---

<div align="center">

© 2026 ersetdigital-sudo · Dibuat dengan Next.js, Supabase & Tailwind CSS

</div>
