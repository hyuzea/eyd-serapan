# eyd-serapan

Pustaka transliterasi kata serapan asing ke bahasa Indonesia sesuai dengan pedoman umum ejaan bahasa Indonesia yang disempurnakan (EYD Edisi V).

Pustaka ini dirancang **100% berbasis aturan (purely rule-based)** menggunakan mesin pencocokan fonetis dinamis untuk menyerap kosakata baru, bukan hanya kamus kosakata statis.

## Fitur Utama

- **Penyusunan Dinamis**: Mampu mendeteksi dan menerjemahkan kata asing baru yang belum pernah terdaftar berdasarkan kaidah fonologis/morfologis EYD.
- **Dukungan Banyak Bahasa Asal**:
  - `umum` (Default / Umum)
  - `arab` (Transliterasi harakat, apostrof hamzah/ain, peluruhan konsonan ganda, penyisipan vokal gugus konsonan akhir).
  - `inggris` / `belanda` / `prancis` / `latin` / `yunani` (Penyesuaian sufiks `-tion`, `-ty`, `-logy`, `-ism`, `-ive`, `-scope`, `-ite`, `-ine`, dll. serta konsonan ganda dan kluster vokal khusus).
  - `sanskerta` (Penyesuaian huruf `ç` -> `s`, `dh` -> `d`, `gh` -> `g`).
  - `jawa` / `bali` (`dh` -> `d`, `th` -> `t`).
  - `jepang` / `cina` (Konversi nasal `n` sebelum `p` menjadi `m`).
- **Ringan & Cepat**: Tanpa ketergantungan eksternal (zero-dependency) dan footprint sangat kecil.
- **Kompatibilitas Penuh**: Dirancang untuk Bun dan modern Node.js (sebagai ES Module).

## Instalasi

```bash
bun add eyd-serapan
# atau menggunakan npm
npm install eyd-serapan
```

## Cara Penggunaan

```typescript
import { serapan } from 'eyd-serapan';

// 1. Serapan Umum (Inggris/Eropa)
console.log(serapan('capitalism', 'umum'));  // "kapitalisme"
console.log(serapan('scientific', 'umum'));  // "saintifik"
console.log(serapan('creativity', 'umum'));  // "kreativitas"
console.log(serapan('check', 'umum'));       // "cek"

// 2. Serapan Arab
console.log(serapan('khasr', 'arab'));       // "khasar" (penyisipan vokal vokal sebelumnya)
console.log(serapan('sihr', 'arab'));        // "sihir"
console.log(serapan('nubuwwah', 'arab'));    // "nubuat" (peluruhan wau ganda)
console.log(serapan("imla'", 'arab'));       // "imla" (hamzah akhir dihilangkan)
console.log(serapan("ta'rif", 'arab'));      // "takrif" (hamzah tengah menjadi k)

// 3. Serapan Sanskerta / Nusantara
console.log(serapan('çila', 'sanskerta'));   // "sila"
console.log(serapan('dharma', 'sanskerta')); // "darma"
console.log(serapan('kenpo', 'jepang'));     // "kempo" (n sebelum p menjadi m)
```

## API

### `serapan(asing: string, asal?: string | BahasaAsal, opsi?: OpsiSerapan): string`

- **`asing`**: Kata asing yang ingin diserap.
- **`asal`**: Bahasa asal kata serapan. Pilihan: `'arab' | 'belanda' | 'inggris' | 'prancis' | 'sanskerta' | 'jawa' | 'bali' | 'aceh' | 'sunda' | 'rejang' | 'korea' | 'jepang' | 'cina' | 'latin' | 'yunani' | 'wolio' | 'umum'`. Default: `'umum'`.
- **`opsi`**: Konfigurasi tambahan:
  - `mode?: 'ketat' | 'longgar'` (Default `'longgar'`). 
    - `'longgar'`: Mengonversi akhiran asing (sufiks) ke padanan bahasa Indonesia (misal: `-ty` -> `-tas`, `-tion` -> `-si`).
    - `'ketat'`: Hanya melakukan penyesuaian huruf/fonetik dasar secara ketat dan melewati penyesuaian sufiks kata. Anda dapat menggunakan konstanta yang diekspor `ModeSerapan.KETAT` atau `ModeSerapan.LONGGAR`.

## Lisensi

MIT
