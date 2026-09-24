export * from './clothing';
import { clothingSize } from './clothing';
import type { ClothingCategory, ClothingSystem, ClothingSizeResult } from './types';

export { clothingSize };
export type { ClothingCategory, ClothingSystem, ClothingSizeResult };

/**
 * Jeans & Denim Size Converter
 * Waist measurement in inches maps directly to denim waist sizing (e.g. W28, W30, W32)
 */
export interface JeansSizeResult {
  waist_in: number;
  waist_cm: number;
  us_alpha: string;
  us_numeric: string;
  eu_size: string;
  uk_size: string;
  br_size: string;
}

export function convertJeansSize(waistInches: number, gender: ClothingCategory = 'women'): JeansSizeResult {
  const waistCm = Math.round(waistInches * 2.54 * 10) / 10;
  let usAlpha = 'M';
  let usNumeric = '8';
  let eu = '38';
  let uk = '12';
  let br = '40';

  if (gender === 'women') {
    if (waistInches <= 24) { usAlpha = 'XXS'; usNumeric = '00'; eu = '30'; uk = '2'; br = '32'; }
    else if (waistInches <= 25) { usAlpha = 'XS'; usNumeric = '0'; eu = '32'; uk = '4'; br = '34'; }
    else if (waistInches <= 26) { usAlpha = 'XS'; usNumeric = '2'; eu = '34'; uk = '6'; br = '36'; }
    else if (waistInches <= 27) { usAlpha = 'S'; usNumeric = '4'; eu = '36'; uk = '8'; br = '36'; }
    else if (waistInches <= 28) { usAlpha = 'S'; usNumeric = '6'; eu = '38'; uk = '10'; br = '38'; }
    else if (waistInches <= 30) { usAlpha = 'M'; usNumeric = '8'; eu = '40'; uk = '12'; br = '40'; }
    else if (waistInches <= 32) { usAlpha = 'L'; usNumeric = '10-12'; eu = '42-44'; uk = '14-16'; br = '42-44'; }
    else if (waistInches <= 35) { usAlpha = 'XL'; usNumeric = '14-16'; eu = '46-48'; uk = '18-20'; br = '46-48'; }
    else { usAlpha = 'XXL+'; usNumeric = '18+'; eu = '50+'; uk = '22+'; br = '50+'; }
  } else {
    // Men
    if (waistInches <= 29) { usAlpha = 'XS'; usNumeric = '28-29'; eu = '44'; uk = '28'; br = '36'; }
    else if (waistInches <= 31) { usAlpha = 'S'; usNumeric = '30-31'; eu = '46'; uk = '30'; br = '38'; }
    else if (waistInches <= 33) { usAlpha = 'M'; usNumeric = '32-33'; eu = '48'; uk = '32'; br = '40'; }
    else if (waistInches <= 35) { usAlpha = 'L'; usNumeric = '34-35'; eu = '50'; uk = '34'; br = '42'; }
    else if (waistInches <= 37) { usAlpha = 'XL'; usNumeric = '36-37'; eu = '52'; uk = '36'; br = '44'; }
    else if (waistInches <= 40) { usAlpha = 'XXL'; usNumeric = '38-40'; eu = '54-56'; uk = '38-40'; br = '46-48'; }
    else { usAlpha = '3XL'; usNumeric = '42+'; eu = '58+'; uk = '42+'; br = '50+'; }
  }

  return {
    waist_in: waistInches,
    waist_cm: waistCm,
    us_alpha: usAlpha,
    us_numeric: usNumeric,
    eu_size: eu,
    uk_size: uk,
    br_size: br,
  };
}

/**
 * Bra Size Converter
 * Calculates Band Size (underbust + 4 for even or +5 for odd) and Cup Size (Bust - Band difference)
 */
export interface BraSizeResult {
  us: string;
  uk: string;
  eu: string;
  fr: string;
  band_in: number;
  cup: string;
  underbust_cm: number;
  bust_cm: number;
}

export function convertBraSize(underbustInches: number, bustInches: number): BraSizeResult {
  // Band calculation (traditional US method)
  const roundedUnderbust = Math.round(underbustInches);
  const band = roundedUnderbust % 2 === 0 ? roundedUnderbust + 4 : roundedUnderbust + 5;
  const diff = Math.max(0, Math.round(bustInches - band));

  const cups = ['AA', 'A', 'B', 'C', 'D', 'DD/E', 'DDD/F', 'G', 'H', 'I'];
  const cupIndex = Math.min(diff, cups.length - 1);
  const usCup = cups[cupIndex] || 'B';

  // UK cups
  const ukCups = ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF', 'G'];
  const ukCup = ukCups[cupIndex] || 'B';

  // EU band in cm (underbust in cm rounded to nearest 5)
  const underbustCm = Math.round(underbustInches * 2.54);
  const euBand = Math.round(underbustCm / 5) * 5;
  const frBand = euBand + 15;

  return {
    us: `${band}${usCup}`,
    uk: `${band}${ukCup}`,
    eu: `${euBand}${usCup === 'DD/E' ? 'E' : usCup === 'DDD/F' ? 'F' : usCup}`,
    fr: `${frBand}${usCup === 'DD/E' ? 'E' : usCup === 'DDD/F' ? 'F' : usCup}`,
    band_in: band,
    cup: usCup,
    underbust_cm: underbustCm,
    bust_cm: Math.round(bustInches * 2.54),
  };
}

/**
 * Men's Dress Shirt Size Converter
 * Neck circumference in inches maps to US/UK collar size and EU collar in cm
 */
export interface ShirtSizeResult {
  us_uk_collar_in: number;
  eu_collar_cm: number;
  alpha_size: string;
  chest_range_in: string;
}

export function convertShirtSize(neckInches: number): ShirtSizeResult {
  const euCm = Math.round(neckInches * 2.54 * 2) / 2;
  let alpha = 'M';
  let chest = '38-40';

  if (neckInches <= 14) { alpha = 'XS'; chest = '34-36'; }
  else if (neckInches <= 14.5) { alpha = 'S'; chest = '36-38'; }
  else if (neckInches <= 15.5) { alpha = 'M'; chest = '38-40'; }
  else if (neckInches <= 16.5) { alpha = 'L'; chest = '42-44'; }
  else if (neckInches <= 17.5) { alpha = 'XL'; chest = '46-48'; }
  else if (neckInches <= 18.5) { alpha = 'XXL'; chest = '50-52'; }
  else { alpha = '3XL'; chest = '54-56'; }

  return {
    us_uk_collar_in: neckInches,
    eu_collar_cm: euCm,
    alpha_size: alpha,
    chest_range_in: chest,
  };
}
