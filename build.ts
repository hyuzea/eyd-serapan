import { writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';

console.log('Building package purely with Bun.build...');

// 1. Clean the output directory
try {
  execSync('rm -rf dist');
} catch (e) {
  // Ignore Windows clean errors
}

// Ensure dist folder exists
try {
  mkdirSync('dist');
} catch (e) {}

// 2. Build using Bun.build
const result = await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  naming: 'index.js',
  format: 'esm',
  target: 'node',
});

if (!result.success) {
  console.error('Compilation failed:', result.logs);
  process.exit(1);
}

console.log('ESM bundle built successfully: dist/index.js');

// 3. Write manual typings (.d.ts) for absolute lightweight zero-dependency types
const typesContent = `export type BahasaAsal =
  | 'arab'
  | 'belanda'
  | 'inggris'
  | 'prancis'
  | 'sanskerta'
  | 'jawa'
  | 'bali'
  | 'aceh'
  | 'sunda'
  | 'rejang'
  | 'korea'
  | 'jepang'
  | 'cina'
  | 'latin'
  | 'yunani'
  | 'wolio'
  | 'umum';

export const ModeSerapan: {
  readonly KETAT: 'ketat';
  readonly LONGGAR: 'longgar';
};

export type TipeModeSerapan = typeof ModeSerapan[keyof typeof ModeSerapan];

export interface OpsiSerapan {
  /**
   * Mode transliterasi kata serapan.
   * - 'ketat': Hanya menerapkan aturan fonetis dasar tanpa konversi sufiks Eropa.
   * - 'longgar': Mengonversi sufiks asing ke padanan Indonesia (seperti -tion -> -si).
   * @default 'longgar'
   */
  mode?: TipeModeSerapan;
}

/**
 * Transliterasi kata serapan asing ke bahasa Indonesia sesuai pedoman EYD.
 * 
 * @param asing Kata asing asal yang ingin diserap
 * @param asal Bahasa asal / asal kata (misalnya: 'arab', 'belanda', 'inggris', dll.)
 * @param opsi Opsi penyesuaian penyusunan serapan
 * @returns Kata dalam ejaan bahasa Indonesia yang sesuai
 */
export function serapan(
  asing: string,
  asal?: string | BahasaAsal,
  opsi?: OpsiSerapan
): string;
`;

writeFileSync('dist/index.d.ts', typesContent, 'utf8');
console.log('Type declarations written successfully: dist/index.d.ts');
console.log('Build completed successfully purely using bun build!');

