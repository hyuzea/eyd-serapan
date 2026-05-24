export type BahasaAsal =
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

export const ModeSerapan = {
  KETAT: 'ketat',
  LONGGAR: 'longgar',
} as const;

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
