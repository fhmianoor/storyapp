# Dicoding Story App SPA (Single Page Application)

Proyek ini merupakan aplikasi Single Page Application (SPA) yang memanfaatkan [Story API Dicoding](https://story-api.dicoding.dev/v1/#/) sebagai sumber data utama. Aplikasi dibangun menggunakan arsitektur **Model-View-Presenter (MVP)** dan mendukung fitur-fitur interaktif seperti menampilkan daftar story, menambahkan story baru dengan kamera dan lokasi, serta navigasi halus dengan View Transition API.

---

## Fitur Utama

### Kriteria Wajib:

1. **Menggunakan API**: Story API dari Dicoding ([https://story-api.dicoding.dev/v1](https://story-api.dicoding.dev/v1))
2. **SPA + Routing Hash**: Navigasi menggunakan hash routing (`/#/home`, `/#/add`)
3. **Tampilkan Data**:

   * Setiap item memiliki gambar, 3 teks, dan lokasi pada peta digital.
   * Marker dan popup lokasi ditampilkan menggunakan [Leaflet](https://leafletjs.com).
4. **Tambah Data Baru**:

   * Gunakan kamera device (via MediaDevices API).
   * Ambil koordinat peta dari event klik di Leaflet.
5. **Aksesibilitas**:

   * `skip to content`, label terhubung, teks alternatif gambar, dan semantic HTML.
6. **Transisi Halaman Halus**:

   * Menggunakan View Transition API untuk pengalaman UX yang baik.

---

## Struktur Folder

```
📦 project-root/
├── 📁 dist/
├── 📁 scripts/
│   ├── 📁 models/
│   ├── 📁 presenters/
│   ├── 📁 utils/
│   ├── 📁 views/
│   ├── main.js
│   └── routes.js
├── 📁 styles/
│   └── main.css
├── 📁 assets/
├── index.html
├── STUDENT.txt
├── .babelrc
├── package.json
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
└── README.md
```

---

## Cara Instalasi dan Menjalankan

### 1. Clone repository ini

```bash
git clone <URL_PROJECT>
cd nama-folder-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Jalankan di mode development

```bash
npx webpack serve --config webpack.dev.js
```

### 4. Build untuk production

```bash
npx webpack --config webpack.prod.js
```

### 5. Jalankan hasil production

```bash
npx http-server dist
```

---

## STUDENT.txt

Letakkan API key Maps Anda jika menggunakan layanan yang memerlukan key (misalnya Mapbox, Google Maps). Contoh:

```
MAPBOX_API_KEY=your_mapbox_key_here
```

Jika menggunakan **Leaflet OpenStreetMap** saja, file ini bisa tetap kosong atau hanya berisi catatan.

---

## Dependencies

### Runtime:

* leaflet

### Dev:

* @babel/preset-env
* babel-loader
* clean-webpack-plugin
* copy-webpack-plugin
* css-loader
* html-webpack-plugin
* http-server
* mini-css-extract-plugin
* style-loader
* webpack
* webpack-cli
* webpack-dev-server
* webpack-merge

---

## 📄 Lisensi

Proyek ini dibuat untuk pemenuhan submission 1 kelas Front-End Web Intermediate Dicoding.

---

> Dibuat dengan oleh \[MUHAMAD FAHMI AULIA NOOR]
