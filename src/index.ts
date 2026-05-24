import { BahasaAsal, OpsiSerapan } from './types.js';
import { applyRules } from './engine.js';

export * from './types.js';

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
  asal: string | BahasaAsal = BahasaAsal.UMUM,
  opsi: OpsiSerapan = {}
): string {
  if (!asing) return '';

  let cleanAsal: string;
  if (typeof asal === 'number') {
    cleanAsal = BahasaAsal[asal] ? BahasaAsal[asal].toLowerCase() : 'umum';
  } else {
    cleanAsal = asal.toLowerCase().trim();
  }

  // Dynamic phonetic/morphological conversion using rule engine
  return applyRules(asing, cleanAsal, opsi);
}
