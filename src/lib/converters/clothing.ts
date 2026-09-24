import type { ClothingSystem, ClothingCategory, ClothingSizeResult } from './types';

interface ClothingMatrixEntry {
  us: string;
  uk: string;
  eu: string;
  intl: string;
  br: string;
  chest_in: string;
  chest_cm: string;
  waist_in: string;
  waist_cm: string;
  hips_in: string;
  hips_cm: string;
}

const WOMEN_CHART: ClothingMatrixEntry[] = [
  { us: '00', uk: '2', eu: '30', intl: 'XXS', br: '32 (PP)', chest_in: '30', chest_cm: '76', waist_in: '23', waist_cm: '58', hips_in: '32', hips_cm: '82' },
  { us: '0', uk: '4', eu: '32', intl: 'XXS', br: '34 (PP)', chest_in: '31', chest_cm: '79', waist_in: '24', waist_cm: '61', hips_in: '33', hips_cm: '84' },
  { us: '2', uk: '6', eu: '34', intl: 'XS', br: '36 (P)', chest_in: '32', chest_cm: '82', waist_in: '25', waist_cm: '64', hips_in: '35', hips_cm: '89' },
  { us: '4', uk: '8', eu: '36', intl: 'S', br: '38 (P)', chest_in: '34', chest_cm: '86', waist_in: '27', waist_cm: '69', hips_in: '37', hips_cm: '94' },
  { us: '6', uk: '10', eu: '38', intl: 'S', br: '40 (M)', chest_in: '35', chest_cm: '89', waist_in: '28', waist_cm: '71', hips_in: '38', hips_cm: '97' },
  { us: '8', uk: '12', eu: '40', intl: 'M', br: '42 (M)', chest_in: '37', chest_cm: '94', waist_in: '30', waist_cm: '76', hips_in: '40', hips_cm: '102' },
  { us: '10', uk: '14', eu: '42', intl: 'M', br: '44 (G)', chest_in: '38.5', chest_cm: '98', waist_in: '31.5', waist_cm: '80', hips_in: '41.5', hips_cm: '106' },
  { us: '12', uk: '16', eu: '44', intl: 'L', br: '46 (G)', chest_in: '40', chest_cm: '102', waist_in: '33', waist_cm: '84', hips_in: '43', hips_cm: '110' },
  { us: '14', uk: '18', eu: '46', intl: 'L', br: '48 (GG)', chest_in: '42', chest_cm: '107', waist_in: '35', waist_cm: '89', hips_in: '45', hips_cm: '115' },
  { us: '16', uk: '20', eu: '48', intl: 'XL', br: '50 (XG)', chest_in: '44', chest_cm: '112', waist_in: '37', waist_cm: '94', hips_in: '47', hips_cm: '120' },
  { us: '18', uk: '22', eu: '50', intl: 'XXL', br: '52 (XG)', chest_in: '46', chest_cm: '117', waist_in: '39', waist_cm: '99', hips_in: '49', hips_cm: '125' },
  { us: '20', uk: '24', eu: '52', intl: '3XL', br: '54 (Plus)', chest_in: '48', chest_cm: '122', waist_in: '41', waist_cm: '104', hips_in: '51', hips_cm: '130' },
];

const MEN_CHART: ClothingMatrixEntry[] = [
  { us: '34', uk: '34', eu: '44', intl: 'XS', br: '36 (PP)', chest_in: '34', chest_cm: '86', waist_in: '28', waist_cm: '71', hips_in: '34', hips_cm: '86' },
  { us: '36', uk: '36', eu: '46', intl: 'S', br: '38 (P)', chest_in: '36', chest_cm: '91', waist_in: '30', waist_cm: '76', hips_in: '36', hips_cm: '91' },
  { us: '38', uk: '38', eu: '48', intl: 'M', br: '40 (M)', chest_in: '38', chest_cm: '96', waist_in: '32', waist_cm: '81', hips_in: '38', hips_cm: '96' },
  { us: '40', uk: '40', eu: '50', intl: 'M', br: '42 (M)', chest_in: '40', chest_cm: '102', waist_in: '34', waist_cm: '86', hips_in: '40', hips_cm: '102' },
  { us: '42', uk: '42', eu: '52', intl: 'L', br: '44 (G)', chest_in: '42', chest_cm: '107', waist_in: '36', waist_cm: '91', hips_in: '42', hips_cm: '107' },
  { us: '44', uk: '44', eu: '54', intl: 'L', br: '46 (G)', chest_in: '44', chest_cm: '112', waist_in: '38', waist_cm: '97', hips_in: '44', hips_cm: '112' },
  { us: '46', uk: '46', eu: '56', intl: 'XL', br: '48 (GG)', chest_in: '46', chest_cm: '117', waist_in: '40', waist_cm: '102', hips_in: '46', hips_cm: '117' },
  { us: '48', uk: '48', eu: '58', intl: 'XXL', br: '50 (GG)', chest_in: '48', chest_cm: '122', waist_in: '42', waist_cm: '107', hips_in: '48', hips_cm: '122' },
  { us: '50', uk: '50', eu: '60', intl: '3XL', br: '52 (XG)', chest_in: '50', chest_cm: '127', waist_in: '44', waist_cm: '112', hips_in: '50', hips_cm: '127' },
];

/**
 * Pure Clothing Size Conversion Function
 */
export function clothingSize(
  value: number | string,
  sourceSystem: ClothingSystem = 'us',
  category: ClothingCategory = 'women'
): ClothingSizeResult {
  const chart = category === 'women' ? WOMEN_CHART : MEN_CHART;
  const strVal = String(value).trim().toUpperCase();

  // Find exact match in chart
  let match = chart.find((entry) => {
    if (sourceSystem === 'us') return entry.us === strVal;
    if (sourceSystem === 'uk') return entry.uk === strVal;
    if (sourceSystem === 'eu') return entry.eu === strVal;
    if (sourceSystem === 'intl') return entry.intl === strVal;
    if (sourceSystem === 'br') return entry.br.toUpperCase().startsWith(strVal) || entry.br.toUpperCase().includes(`(${strVal})`);
    return false;
  });

  // Fallback to nearest index if not matched directly
  if (!match) {
    const num = parseFloat(strVal);
    if (!isNaN(num)) {
      match = chart.reduce((prev, curr) => {
        const prevKey = sourceSystem === 'intl' ? 'us' : sourceSystem === 'br' ? 'eu' : sourceSystem;
        const prevDiff = Math.abs(parseFloat(prev[prevKey]) - num);
        const currDiff = Math.abs(parseFloat(curr[prevKey]) - num);
        return currDiff < prevDiff ? curr : prev;
      });
    } else {
      match = chart[Math.floor(chart.length / 2)];
    }
  }

  return {
    us: match.us,
    uk: match.uk,
    eu: match.eu,
    intl: match.intl,
    br: match.br,
    category,
    measurements: {
      chest_in: match.chest_in,
      chest_cm: match.chest_cm,
      waist_in: match.waist_in,
      waist_cm: match.waist_cm,
      hips_in: match.hips_in,
      hips_cm: match.hips_cm,
    },
  };
}
