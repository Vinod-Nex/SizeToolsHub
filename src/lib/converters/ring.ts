import type { RingSystem, RingSizeResult } from './types';

const UK_LETTER_SCALE = [
  { letter: 'A', diam: 12.04 },
  { letter: 'B', diam: 12.45 },
  { letter: 'C', diam: 12.85 },
  { letter: 'D', diam: 13.26 },
  { letter: 'E', diam: 13.67 },
  { letter: 'F', diam: 14.07 },
  { letter: 'G', diam: 14.48 },
  { letter: 'H', diam: 14.88 },
  { letter: 'I', diam: 15.29 },
  { letter: 'J', diam: 15.49 },
  { letter: 'J 1/2', diam: 15.70 },
  { letter: 'K', diam: 15.90 },
  { letter: 'L', diam: 16.31 },
  { letter: 'L 1/2', diam: 16.51 },
  { letter: 'M', diam: 16.71 },
  { letter: 'N', diam: 17.12 },
  { letter: 'N 1/2', diam: 17.32 },
  { letter: 'O', diam: 17.53 },
  { letter: 'P', diam: 17.93 },
  { letter: 'P 1/2', diam: 18.14 },
  { letter: 'Q', diam: 18.34 },
  { letter: 'R', diam: 18.75 },
  { letter: 'R 1/2', diam: 18.95 },
  { letter: 'S', diam: 19.15 },
  { letter: 'T', diam: 19.56 },
  { letter: 'T 1/2', diam: 19.76 },
  { letter: 'U', diam: 19.96 },
  { letter: 'V', diam: 20.37 },
  { letter: 'V 1/2', diam: 20.57 },
  { letter: 'W', diam: 20.78 },
  { letter: 'X', diam: 21.18 },
  { letter: 'X 1/2', diam: 21.39 },
  { letter: 'Y', diam: 21.59 },
  { letter: 'Z', diam: 21.79 },
  { letter: 'Z 1/2', diam: 22.20 },
  { letter: 'Z+1', diam: 22.61 },
  { letter: 'Z+2', diam: 23.01 },
  { letter: 'Z+3', diam: 23.42 },
];

/**
 * Pure Ring Size Conversion Function
 * Converts between US/Canada, UK/Australia letters, EU (ISO 8653), Japan, and metric mm.
 */
export function ringSize(
  value: number | string,
  sourceSystem: RingSystem = 'us'
): RingSizeResult {
  let diameterMm = 17.32; // Default to US 7

  if (sourceSystem === 'diameter_mm') {
    diameterMm = typeof value === 'number' ? value : parseFloat(value) || 17.32;
  } else if (sourceSystem === 'circumference_mm') {
    const circ = typeof value === 'number' ? value : parseFloat(value) || 54.4;
    diameterMm = circ / Math.PI;
  } else if (sourceSystem === 'us') {
    const usNum = typeof value === 'number' ? value : parseFloat(value) || 7;
    diameterMm = 11.63 + usNum * 0.8128;
  } else if (sourceSystem === 'eu') {
    const euCirc = typeof value === 'number' ? value : parseFloat(value) || 54;
    diameterMm = euCirc / Math.PI;
  } else if (sourceSystem === 'jp') {
    const jpNum = typeof value === 'number' ? value : parseFloat(value) || 14;
    diameterMm = 12.67 + (jpNum - 1) * (1 / 3);
  } else if (sourceSystem === 'uk') {
    const str = String(value).trim().toUpperCase();
    const found = UK_LETTER_SCALE.find((item) => item.letter.toUpperCase() === str);
    if (found) {
      diameterMm = found.diam;
    }
  }

  // Clamping diameter to realistic human bounds (10 mm to 26 mm)
  diameterMm = Math.max(10, Math.min(26, diameterMm));

  const circumferenceMm = diameterMm * Math.PI;
  const diameterIn = diameterMm / 25.4;
  const circumferenceIn = circumferenceMm / 25.4;

  // Compute target values
  const us = (diameterMm - 11.63) / 0.8128;
  const eu = Math.round(circumferenceMm);
  const jp = Math.max(1, Math.round(((diameterMm - 12.67) / (1 / 3)) + 1));

  // Find closest UK letter
  let closestUk = UK_LETTER_SCALE[0].letter;
  let minDiff = Infinity;
  for (const item of UK_LETTER_SCALE) {
    const diff = Math.abs(item.diam - diameterMm);
    if (diff < minDiff) {
      minDiff = diff;
      closestUk = item.letter;
    }
  }

  return {
    us: Number(us.toFixed(2)),
    uk: closestUk,
    eu,
    jp,
    diameter_mm: Number(diameterMm.toFixed(2)),
    diameter_in: Number(diameterIn.toFixed(3)),
    circumference_mm: Number(circumferenceMm.toFixed(2)),
    circumference_in: Number(circumferenceIn.toFixed(3)),
  };
}
