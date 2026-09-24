import type { ShoeSystem, ShoeCategory, ShoeSizeResult } from './types';

/**
 * Pure Shoe Size Conversion Function
 * Adheres to ISO 9407 (Mondopoint) and international shoe sizing formulas.
 */
export function shoeSize(
  value: number | string,
  sourceSystem: ShoeSystem = 'us_m',
  category: ShoeCategory = 'men'
): ShoeSizeResult {
  const numVal = typeof value === 'string' ? parseFloat(value) : value;
  const safeVal = isNaN(numVal) ? 10 : numVal;

  // Step 1: Normalize all inputs to Foot Length in Millimeters (Mondopoint ISO 9407)
  let footLengthMm = 270;

  switch (sourceSystem) {
    case 'us_m':
      // US Men formula: Foot length in inches ≈ (US + 22) / 3 -> mm ≈ inches * 25.4
      footLengthMm = ((safeVal + 22) / 3) * 25.4;
      break;
    case 'us_w':
      // US Women: ~1.5 sizes offset from US Men
      footLengthMm = ((safeVal - 1.5 + 22) / 3) * 25.4;
      break;
    case 'us_k':
      // US Kids
      footLengthMm = ((safeVal + 9.5) / 3) * 25.4;
      break;
    case 'uk':
      // UK Men: US Men - 0.5
      footLengthMm = ((safeVal + 0.5 + 22) / 3) * 25.4;
      break;
    case 'eu':
      // Paris Points: 1 point = 6.667 mm. Last length = Foot length + 20 mm
      // Foot length mm = (EU * 6.6667) - 20
      footLengthMm = safeVal * (20 / 3) - 20;
      break;
    case 'br':
      // Brazilian Standard: Ponto Francês offset by 2 sizes (BR = EU - 2)
      footLengthMm = (safeVal + 2) * (20 / 3) - 20;
      break;
    case 'jp_cm':
      footLengthMm = safeVal * 10;
      break;
    case 'mondo':
      footLengthMm = safeVal;
      break;
    default:
      footLengthMm = 270;
  }

  // Clamping foot length to realistic human foot bounds (80 mm to 340 mm)
  footLengthMm = Math.max(80, Math.min(340, footLengthMm));

  const footLengthIn = footLengthMm / 25.4;
  const footLengthCm = footLengthMm / 10;

  // Step 2: Compute all targets from normalized foot length
  const usMen = Math.max(1, (3 * footLengthIn) - 22);
  const usWomen = Math.max(2.5, usMen + 1.5);
  const usKids = Math.max(1, (3 * footLengthIn) - 9.5);
  const uk = Math.max(0.5, usMen - 0.5);
  // EU size = (Foot length mm + 20) / (20/3)
  const eu = (footLengthMm + 20) / (20 / 3);
  const br = Math.max(15, Math.round(eu - 2));
  const jpCm = footLengthCm;
  const mondoMm = footLengthMm;

  return {
    us_men: Number(usMen.toFixed(1)),
    us_women: Number(usWomen.toFixed(1)),
    us_kids: Number(usKids.toFixed(1)),
    uk: Number(uk.toFixed(1)),
    eu: Math.round(eu),
    br,
    jp_cm: Number(jpCm.toFixed(1)),
    mondo_mm: Math.round(mondoMm),
    foot_length_in: Number(footLengthIn.toFixed(2)),
    foot_length_cm: Number(footLengthCm.toFixed(2)),
  };
}
