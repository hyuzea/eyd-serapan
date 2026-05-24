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
import { serapan, BahasaAsal, ModeSerapan } from 'eyd-serapan';

// 1. Serapan Umum (Inggris/Eropa) - Bisa menggunakan String biasa
console.log(serapan('capitalism', 'inggris'));  // "kapitalisme"
console.log(serapan('scientific', 'inggris'));  // "saintifik"
console.log(serapan('creativity', 'inggris'));  // "kreativitas"
console.log(serapan('check', 'umum'));          // "cek"

// 2. Menggunakan Enum "BahasaAsal" untuk kode yang self-documenting & terstruktur
console.log(serapan('khasr', BahasaAsal.ARAB));         // "khasar" (penyisipan vokal)
console.log(serapan('sihr', BahasaAsal.ARAB));          // "sihir"
console.log(serapan('nubuwwah', BahasaAsal.ARAB));      // "nubuat" (peluruhan wau ganda)
console.log(serapan("imla'", BahasaAsal.ARAB));       // "imla" (hamzah akhir dihilangkan)
console.log(serapan("ta'rif", BahasaAsal.ARAB));        // "takrif" (hamzah tengah menjadi k)

// 3. Serapan Sanskerta / Nusantara / Asia Timur
console.log(serapan('çila', BahasaAsal.SANSKERTA));     // "sila"
console.log(serapan('dharma', BahasaAsal.SANSKERTA));   // "darma"
console.log(serapan('kenpo', BahasaAsal.JEPANG));       // "kempo" (n sebelum p menjadi m)

// 4. Menggunakan Mode Penyerapan dengan Opsi
console.log(serapan('communication', BahasaAsal.INGGRIS, { mode: ModeSerapan.KETAT })); 
// "komunikation" (hanya penyesuaian huruf dasar tanpa konversi sufiks -tion)
```

## API

### `serapan(asing: string, asal?: string | BahasaAsal, opsi?: OpsiSerapan): string`

- **`asing`**: Kata asing yang ingin diserap.
- **`asal`**: Bahasa asal kata serapan. Dapat menerima nilai dari **`enum BahasaAsal`** atau nilai `string` mentah berikut:
  * `BahasaAsal.ARAB` atau `'arab'`
  * `BahasaAsal.BELANDA` atau `'belanda'`
  * `BahasaAsal.INGGRIS` atau `'inggris'`
  * `BahasaAsal.PRANCIS` atau `'prancis'`
  * `BahasaAsal.SANSKERTA` atau `'sanskerta'`
  * `BahasaAsal.JAWA` atau `'jawa'`
  * `BahasaAsal.BALI` atau `'bali'`
  * `BahasaAsal.ACEH` atau `'aceh'`
  * `BahasaAsal.SUNDA` atau `'sunda'`
  * `BahasaAsal.REJANG` or `'rejang'`
  * `BahasaAsal.KOREA` atau `'korea'`
  * `BahasaAsal.JEPANG` atau `'jepang'`
  * `BahasaAsal.CINA` atau `'cina'`
  * `BahasaAsal.LATIN` atau `'latin'`
  * `BahasaAsal.YUNANI` atau `'yunani'`
  * `BahasaAsal.WOLIO` atau `'wolio'`
  * `BahasaAsal.UMUM` atau `'umum'` (Default)
- **`opsi`**: Konfigurasi tambahan:
  - `mode?: TipeModeSerapan` (Default `ModeSerapan.LONGGAR` / `'longgar'`). 
    - `ModeSerapan.LONGGAR` atau `'longgar'`: Mengonversi akhiran asing (sufiks) ke padanan bahasa Indonesia (misal: `-ty` -> `-tas`, `-tion` -> `-si`).
    - `ModeSerapan.KETAT` atau `'ketat'`: Hanya melakukan penyesuaian huruf/fonetik dasar secara ketat dan melewati penyesuaian sufiks kata.

## Lisensi

MIT
