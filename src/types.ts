export enum BahasaAsal {
  ARAB,
  BELANDA,
  INGGRIS,
  PRANCIS,
  SANSKERTA,
  JAWA,
  BALI,
  ACEH,
  SUNDA,
  REJANG,
  KOREA,
  JEPANG,
  CINA,
  LATIN,
  YUNANI,
  WOLIO,
  UMUM,
}

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
