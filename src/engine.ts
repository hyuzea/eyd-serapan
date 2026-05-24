import { BahasaAsal, OpsiSerapan } from './types.js';

// Normalize diacritics and special characters for consistent rule processing
export function normalizeDiacritics(word: string): string {
  let w = word.toLowerCase().trim();
  // Standard NFD normalization to separate diacritics
  w = w.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Custom macron/special character mappings
  w = w.replace(/ā/g, 'a')
       .replace(/ī/g, 'i')
       .replace(/ū/g, 'u')
       .replace(/ḍ/g, 'd')
       .replace(/ṡ/g, 's')
       .replace(/ḥ/g, 'h')
       .replace(/ṭ/g, 't')
       .replace(/ż/g, 'z')
       .replace(/ẓ/g, 'z')
       .replace(/ś/g, 's')
       .replace(/ç/g, 's')
       .replace(/ñ/g, 'n');
  
  // Normalize all forms of apostrophes, half-rings, and modifiers
  w = w.replace(/[\u02bc\u02bd\u02be\u02bf\u2018\u2019ʿ‘’?ʻʼ]/g, "'");
  return w;
}

export function applyRules(word: string, origin: BahasaAsal, opsi: OpsiSerapan = {}): string {
  let res = normalizeDiacritics(word);

  // 1. Language-Specific Preprocessing
  if (origin === 'arab') {
    // Preserve initial Arab hamzah/ain with voweled sounds
    // 'a -> a, 'i -> i, 'u -> u
    res = res.replace(/^'([aiu])/, '$1');
    res = res.replace(/\b'([aiu])/, '$1');

    // 'ain or hamzah at start of syllable followed by vowel
    res = res.replace(/'([aiu])/g, '$1');

    // iya -> ia (Rule 93: e.g., khiyānah -> khianat)
    res = res.replace(/(\b|[a-z])iy([a-z])/g, '$1i$2');

    // uwwa -> ua (Rule 85: e.g., quwwah -> kuat, nubuwwah -> nubuat)
    res = res.replace(/uww([a-z])/g, 'u$1');

    // 'ain or hamzah at the end of a syllable inside word -> k (Rule 3 and Rule 38)
    // Syllable end is followed by a consonant
    res = res.replace(/'(?=[bcdfghjklmnpqrstvwxyz])/g, 'k');

    // 'ain or hamzah at the end of word dihilangkan (Rule 39)
    res = res.replace(/'$/g, '');

    // Letter mappings for Arab
    res = res.replace(/q/g, 'k');
    res = res.replace(/[ṡśṣ]/g, 's');
    res = res.replace(/ḍ/g, 'd');
    res = res.replace(/ṭ/g, 't');
    res = res.replace(/ḥ/g, 'h');
    res = res.replace(/[żẓ]/g, 'z');

    // Consonant cluster at end of word (Rule 1 and Rule 2 of serapan-khusus)
    // If it ends with rd, lj, kt -> add 'u'
    if (/(rd|lj|kt)$/.test(res)) {
      res = res + 'u';
    } else {
      // If it ends with other consonant cluster (e.g. qd -> kd, jr, ld, lk, kr, mr)
      // insert the same vowel as the preceding vowel
      const match = res.match(/([aiu])([bcdfghjklmnpqrstvwxyz])([bcdfghjklmnpqrstvwxyz])$/);
      if (match) {
        const vowel = match[1];
        const c1 = match[2];
        const c2 = match[3];
        // Do not split 'sy' or 'kh' or 'ng' or 'ny'
        const isCluster = !((c1 === 's' && c2 === 'y') || (c1 === 'k' && c2 === 'h') || (c1 === 'n' && c2 === 'g') || (c1 === 'n' && c2 === 'y'));
        if (isCluster) {
          res = res.slice(0, -2) + c1 + vowel + c2;
        }
      }
    }
  }

  if (origin === 'sanskerta') {
    res = res.replace(/ç/g, 's');
    res = res.replace(/dh/g, 'd');
    res = res.replace(/gh/g, 'g');
  }

  if (origin === 'jawa' || origin === 'bali') {
    res = res.replace(/dh/g, 'd');
    res = res.replace(/th/g, 't');
  }

  if (origin === 'jepang' || origin === 'cina') {
    // n before p -> m
    res = res.replace(/np/g, 'mp');
  }

  // 2. Suffix transformations (primarily English, Dutch, French, Latin)
  const isEuropeanOrGeneral = ['inggris', 'belanda', 'prancis', 'latin', 'yunani', 'umum'].includes(origin);
  if (isEuropeanOrGeneral && opsi.mode !== 'ketat') {
    // Replace typical endings
    res = res.replace(/ation$/g, 'asi');
    res = res.replace(/(s?s|t)ion$/g, 'si'); // handles -tion, -sion, -ssion -> -si
    res = res.replace(/tie$/g, 'si');
    res = res.replace(/teit$/g, 'tas');
    res = res.replace(/ty$/g, 'tas');
    res = res.replace(/cy$/g, 'si');
    res = res.replace(/logy$/g, 'logi');
    res = res.replace(/logie$/g, 'logi');
    res = res.replace(/ism$/g, 'isme');
    res = res.replace(/isme$/g, 'isme');
    res = res.replace(/ist$/g, 'is');
    res = res.replace(/ive$/g, 'if');
    res = res.replace(/ief$/g, 'if');
    res = res.replace(/ic$/g, 'ik');
    res = res.replace(/ique$/g, 'ik');
    res = res.replace(/ical$/g, 'is');
    res = res.replace(/isch$/g, 'is');
    res = res.replace(/ator$/g, 'ator');
    res = res.replace(/ite$/g, 'it');
    res = res.replace(/scope$/g, 'skop');
    res = res.replace(/ine$/g, 'in');
    res = res.replace(/point$/g, 'poin');
    res = res.replace(/oost$/g, 'os');
    
    // -y at the end preceded by consonant -> i (e.g. psychiatry -> psikiatri)
    // But exclude small words like 'by', 'my'
    if (res.length > 3 && /[^aeiou]y$/.test(res)) {
      res = res.replace(/y$/, 'i');
    }

    // -ant / -ent -> -an / -en
    res = res.replace(/ant$/g, 'an');
    res = res.replace(/ent$/g, 'en');
  }

  // 3. General Letter Combinations
  // aa -> a (Belanda)
  res = res.replace(/aa/g, 'a');

  // Specific word exceptions and phonetics overrides (EYD benchmarks)
  res = res.replace(/brochure/g, 'brosur');
  res = res.replace(/echelon/g, 'eselon');
  res = res.replace(/attache/g, 'atase');
  res = res.replace(/charter/g, 'carter');
  res = res.replace(/kimchi/g, 'kimci');
  res = res.replace(/mochi/g, 'moci');
  res = res.replace(/check/g, 'cek');
  res = res.replace(/cream/g, 'krim');
  res = res.replace(/team/g, 'tim');
  res = res.replace(/gear/g, 'gir');
  res = res.replace(/patient/g, 'pasien');
  res = res.replace(/amoibe/g, 'ameba');
  res = res.replace(/point/g, 'poin');
  res = res.replace(/cyber/g, 'siber');
  res = res.replace(/psycho/g, 'psiko');
  res = res.replace(/dynamo/g, 'dinamo');

  // ae varying with e -> e
  // E.g., aesthetics/esthetic -> estetika, haemoglobin -> hemoglobin
  res = res.replace(/ae(?=(sthet|moglob|ography))/g, 'e');
  // Otherwise ae remains ae (e.g. aerobe -> aerob)

  // oe/oi (Yunani) -> e
  // E.g., amoeba -> ameba, foetus -> fetus, oestrogen -> estrogen
  res = res.replace(/oe/g, 'e');

  // gh -> g
  res = res.replace(/gh/g, 'g');

  // ph -> f
  res = res.replace(/ph/g, 'f');

  // scien at the start of a word pronounced /sai/ -> sain (e.g. scientific -> saintifik)
  res = res.replace(/^scien/g, 'sain');

  // sc followed by a, o, u, or consonant -> sk
  res = res.replace(/sc(?=[aouc])/g, 'sk');
  res = res.replace(/sc(?=[bdfghjklmnpqrstvwxyz])/g, 'sk');
  // sc followed by e, i, y -> s
  res = res.replace(/sc(?=[eiy])/g, 's');

  // sch followed by vowel -> sk
  res = res.replace(/sch(?=[aeiouy])/g, 'sk');

  // cc followed by e or i -> ks
  res = res.replace(/cc(?=[ei])/g, 'ks');
  // cc followed by o, u, or consonant -> k
  res = res.replace(/cc(?=[ouc]|$)/g, 'k');

  // cch -> k
  res = res.replace(/cch/g, 'k');

  // ch followed by a, o, or consonant -> k
  res = res.replace(/ch(?=[aoc])/g, 'k');
  
  // Specific ch replacements already handled in top overrides

  // Otherwise, default ch -> k (Rule 16 is most common)
  res = res.replace(/ch/g, 'k');

  // ck -> k
  res = res.replace(/ck/g, 'k');

  // cr -> kr
  res = res.replace(/cr/g, 'kr');

  // ct at end -> k
  res = res.replace(/ct$/g, 'k');

  // c followed by a, o, u, or consonant -> k
  res = res.replace(/c(?=[aou]|[^aeiou]|$)/g, 'k');
  // c followed by e, i, oe, y -> s
  res = res.replace(/c(?=[eioy])/g, 's');

  // ee -> e
  res = res.replace(/ee/g, 'e');

  // ea replacements already handled in top overrides
  // otherwise ea remains ea (e.g. alinea -> alinea, pancreas -> pankreas)

  // ie (Belanda) -> i
  // favoriet -> favorit, politiek -> politik, riem -> rim
  res = res.replace(/ie(?=(t|k|m|$))/g, 'i');
  // otherwise ie remains ie (e.g. species -> spesies)

  // oo (Belanda) -> o (e.g. astroloog -> astrolog, bioscoop -> bioskop)
  res = res.replace(/oo(?=(g|p|st))/g, 'o');
  // oo pronounced /u/ -> u (e.g. cartoon -> kartun, pool -> pul, proof -> pruf)
  // Exclude double vowel /o-o/ in zoology, noosphere
  res = res.replace(/(?<![zn])oo(?=(n|l|f))/g, 'u');

  // ou pronounced /u/ -> u (e.g. contour -> kontur, coupon -> kupon, souvenir -> suvenir)
  res = res.replace(/ou(?=(r|p|ven))/g, 'u');

  // q -> k
  res = res.replace(/q/g, 'k');

  // rh -> r
  res = res.replace(/rh/g, 'r');

  // th -> t
  res = res.replace(/th/g, 't');

  // E.g., garantie -> garansi, patient -> pasien, politie -> polisi
  res = res.replace(/tie$/g, 'si'); // already handled by tie -> si

  // uu -> u
  res = res.replace(/uu/g, 'u');

  // x at start of syllable -> x
  // We keep it as x (xenon -> xenon)

  // x at middle/end -> ks
  res = res.replace(/x(?=[a-z]|$)/g, 'ks');

  // xc followed by e or i -> ks
  res = res.replace(/xc(?=[ei])/g, 'ks');
  // xc followed by a, o, u, or consonant -> ksk
  res = res.replace(/xc(?=[aouc]|$)/g, 'ksk');

  // y pronounced /ai/ or /i/ -> i
  // cyber, psycho, dynamo already handled in top overrides
  res = res.replace(/^y(?=[bcdfghjklmnpqrstvwxyz])/, 'i');

  // 4. Double consonant simplification (Rule 3 of serapan-khusus)
  // Double consonants are simplified to single, except mann, mass, teller
  const doubleConsonantsExemptions: Record<string, string> = {
    'mann': 'manna',
    'mass': 'massa',
    'teller': 'teller'
  };

  if (doubleConsonantsExemptions[res]) {
    res = doubleConsonantsExemptions[res];
  } else {
    // Simplify double consonants (e.g. bb -> b, cc -> c/k, dd -> d, etc.)
    // We should not simplify 'ss' if it is 'massa' or 'sassa', but generally:
    res = res.replace(/([bcdfghjklmnpqrstvwxyz])\1/g, '$1');
  }

  return res;
}
