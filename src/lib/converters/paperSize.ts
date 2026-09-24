export * from './paper';
import { paperSize, PAPER_CATALOG, type PaperStandardRecord } from './paper';
import type { PaperSizeResult } from './types';

export { paperSize, PAPER_CATALOG };
export type { PaperStandardRecord };

export interface PaperComparison {
  sizeA: PaperSizeResult;
  sizeB: PaperSizeResult;
  // Differences: A minus B
  widthDiffMm: number;
  heightDiffMm: number;
  widthDiffIn: number;
  heightDiffIn: number;
  areaDiffSqM: number;
  areaDiffSqIn: number;
  areaDiffPercent: number; // ((sizeA.area - sizeB.area) / sizeB.area) * 100
  // Relative dimensional summary
  isAWider: boolean;
  isATaller: boolean;
  isALargerArea: boolean;
  scaleToFitPercent: number; // Percent to scale B down/up so it fits entirely inside A
  scaleToFillPercent: number; // Percent to scale B so it covers A entirely
}

export interface PaperDpiPixels {
  dpi: number;
  widthPx: number;
  heightPx: number;
  megapixels: number;
}

/**
 * Compare two paper sizes side-by-side
 */
export function comparePaperSizes(
  nameOrSizeA: string | PaperSizeResult,
  nameOrSizeB: string | PaperSizeResult
): PaperComparison {
  const sizeA = typeof nameOrSizeA === 'string' ? paperSize(nameOrSizeA) : nameOrSizeA;
  const sizeB = typeof nameOrSizeB === 'string' ? paperSize(nameOrSizeB) : nameOrSizeB;

  const widthDiffMm = Number((sizeA.width_mm - sizeB.width_mm).toFixed(1));
  const heightDiffMm = Number((sizeA.height_mm - sizeB.height_mm).toFixed(1));
  const widthDiffIn = Number((sizeA.width_in - sizeB.width_in).toFixed(2));
  const heightDiffIn = Number((sizeA.height_in - sizeB.height_in).toFixed(2));
  const areaDiffSqM = Number((sizeA.area_sq_m - sizeB.area_sq_m).toFixed(4));
  const areaDiffSqIn = Number((sizeA.area_sq_in - sizeB.area_sq_in).toFixed(2));

  // Area percentage difference relative to B
  const areaDiffPercent = sizeB.area_sq_m > 0
    ? Number((((sizeA.area_sq_m - sizeB.area_sq_m) / sizeB.area_sq_m) * 100).toFixed(1))
    : 0;

  // Scale calculations (scale B to fit inside A)
  const widthRatio = sizeA.width_mm / sizeB.width_mm;
  const heightRatio = sizeA.height_mm / sizeB.height_mm;
  const scaleToFit = Math.min(widthRatio, heightRatio) * 100;
  const scaleToFill = Math.max(widthRatio, heightRatio) * 100;

  return {
    sizeA,
    sizeB,
    widthDiffMm,
    heightDiffMm,
    widthDiffIn,
    heightDiffIn,
    areaDiffSqM,
    areaDiffSqIn,
    areaDiffPercent,
    isAWider: widthDiffMm > 0,
    isATaller: heightDiffMm > 0,
    isALargerArea: areaDiffSqM > 0,
    scaleToFitPercent: Number(scaleToFit.toFixed(1)),
    scaleToFillPercent: Number(scaleToFill.toFixed(1)),
  };
}

/**
 * Calculate print resolution pixel requirements at a given DPI
 */
export function getPaperPixelsAtDpi(
  widthIn: number,
  heightIn: number,
  dpi: number = 300
): PaperDpiPixels {
  const widthPx = Math.round(widthIn * dpi);
  const heightPx = Math.round(heightIn * dpi);
  const megapixels = Number(((widthPx * heightPx) / 1_000_000).toFixed(2));

  return {
    dpi,
    widthPx,
    heightPx,
    megapixels,
  };
}

export interface PaperPresetGroup {
  label: string;
  items: { name: string; label: string; dims: string }[];
}

export const PAPER_PRESET_GROUPS: PaperPresetGroup[] = [
  {
    label: 'Standard Office & Documents',
    items: [
      { name: 'A4', label: 'ISO A4', dims: '210 × 297 mm' },
      { name: 'US Letter', label: 'US Letter', dims: '8.5 × 11.0 in (215.9 × 279.4 mm)' },
      { name: 'US Legal', label: 'US Legal', dims: '8.5 × 14.0 in (215.9 × 355.6 mm)' },
      { name: 'A5', label: 'ISO A5', dims: '148 × 210 mm' },
      { name: 'Half Letter', label: 'Half Letter (Statement)', dims: '5.5 × 8.5 in' },
      { name: 'Executive', label: 'US Executive', dims: '7.25 × 10.5 in' },
    ],
  },
  {
    label: 'ISO 216 A-Series (Global)',
    items: [
      { name: 'A0', label: 'A0 (1 m² Sheet)', dims: '841 × 1189 mm' },
      { name: 'A1', label: 'A1', dims: '594 × 841 mm' },
      { name: 'A2', label: 'A2', dims: '420 × 594 mm' },
      { name: 'A3', label: 'A3', dims: '297 × 420 mm' },
      { name: 'A4', label: 'A4 (Document Standard)', dims: '210 × 297 mm' },
      { name: 'A5', label: 'A5 (Notebook)', dims: '148 × 210 mm' },
      { name: 'A6', label: 'A6 (Postcard)', dims: '105 × 148 mm' },
      { name: 'A7', label: 'A7', dims: '74 × 105 mm' },
      { name: 'A8', label: 'A8 (Business Card)', dims: '52 × 74 mm' },
    ],
  },
  {
    label: 'North American & ANSI',
    items: [
      { name: 'US Letter', label: 'US Letter (ANSI A)', dims: '8.5 × 11 in' },
      { name: 'US Legal', label: 'US Legal', dims: '8.5 × 14 in' },
      { name: 'Tabloid', label: 'Tabloid / Ledger (ANSI B)', dims: '11 × 17 in' },
      { name: 'ANSI C', label: 'ANSI C', dims: '17 × 22 in' },
      { name: 'ANSI D', label: 'ANSI D', dims: '22 × 34 in' },
      { name: 'ANSI E', label: 'ANSI E', dims: '34 × 44 in' },
    ],
  },
  {
    label: 'Envelopes (Mailing & Stationery)',
    items: [
      { name: 'DL', label: 'DL Envelope (A4 3-fold)', dims: '110 × 220 mm' },
      { name: '#10 Commercial', label: '#10 Business Envelope (Letter 3-fold)', dims: '4.125 × 9.5 in' },
      { name: 'C4', label: 'C4 Envelope (Flat A4)', dims: '229 × 324 mm' },
      { name: 'C5', label: 'C5 Envelope (Folded A4 / Flat A5)', dims: '162 × 229 mm' },
      { name: 'C6', label: 'C6 Envelope (Folded A4)', dims: '114 × 162 mm' },
      { name: 'A2 Invitation', label: 'A2 Note Card Envelope', dims: '4.375 × 5.75 in' },
      { name: 'A7 Announcement', label: 'A7 Greeting Card Envelope', dims: '5.25 × 7.25 in' },
      { name: '#9 Commercial', label: '#9 Return Envelope', dims: '3.875 × 8.875 in' },
      { name: 'Monarch', label: 'Monarch Executive Envelope', dims: '3.875 × 7.5 in' },
    ],
  },
  {
    label: 'Posters & Architectural Formats',
    items: [
      { name: '11x17 Mini Poster', label: '11 × 17″ Mini Poster', dims: '279 × 432 mm' },
      { name: '18x24 Medium Poster', label: '18 × 24″ Retail / Art Poster (Arch C)', dims: '457 × 610 mm' },
      { name: '24x36 Large Poster', label: '24 × 36″ Exhibition / Blueprint (Arch D)', dims: '610 × 914 mm' },
      { name: '27x40 Movie One-Sheet', label: '27 × 40″ Movie Poster (One Sheet)', dims: '686 × 1016 mm' },
      { name: 'B1', label: 'B1 European Poster', dims: '707 × 1000 mm' },
      { name: 'B2', label: 'B2 Art Poster', dims: '500 × 707 mm' },
      { name: 'Arch E', label: '36 × 48″ Master Blueprint (Arch E)', dims: '914 × 1219 mm' },
    ],
  },
];
