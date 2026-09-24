import type { PaperSizeResult } from './types';

export interface PaperStandardRecord {
  name: string;
  series: PaperSizeResult['series'];
  wMm: number;
  hMm: number;
  equivalents: string[];
  aliases?: string[];
  category?: 'iso-a' | 'iso-b' | 'envelope' | 'north-american' | 'ansi' | 'poster' | 'architectural';
}

export const PAPER_CATALOG: PaperStandardRecord[] = [
  // ISO 216 A Series
  { name: 'A0', series: 'ISO-A', wMm: 841, hMm: 1189, equivalents: ['16x A4', 'Poster (1 m²)'], aliases: ['a0'], category: 'iso-a' },
  { name: 'A1', series: 'ISO-A', wMm: 594, hMm: 841, equivalents: ['8x A4', 'Large Blueprint / Poster'], aliases: ['a1'], category: 'iso-a' },
  { name: 'A2', series: 'ISO-A', wMm: 420, hMm: 594, equivalents: ['4x A4', 'Diagrams / Medium Poster'], aliases: ['a2'], category: 'iso-a' },
  { name: 'A3', series: 'ISO-A', wMm: 297, hMm: 420, equivalents: ['2x A4', 'Ledger Equivalent'], aliases: ['a3'], category: 'iso-a' },
  { name: 'A4', series: 'ISO-A', wMm: 210, hMm: 297, equivalents: ['Standard Global Document', 'Nearest US Letter'], aliases: ['a4', 'iso a4', 'standard a4'], category: 'iso-a' },
  { name: 'A5', series: 'ISO-A', wMm: 148, hMm: 210, equivalents: ['Notebook', 'Half A4', 'Flyer'], aliases: ['a5'], category: 'iso-a' },
  { name: 'A6', series: 'ISO-A', wMm: 105, hMm: 148, equivalents: ['Postcard', 'Pocket Flyer'], aliases: ['a6'], category: 'iso-a' },
  { name: 'A7', series: 'ISO-A', wMm: 74, hMm: 105, equivalents: ['Pocket Card', 'Mini Memo'], aliases: ['a7'], category: 'iso-a' },
  { name: 'A8', series: 'ISO-A', wMm: 52, hMm: 74, equivalents: ['Business Card Size', 'Sticker'], aliases: ['a8'], category: 'iso-a' },

  // ISO 216 B Series
  { name: 'B0', series: 'ISO-B', wMm: 1000, hMm: 1414, equivalents: ['Billboard / Large Poster'], aliases: ['b0'], category: 'iso-b' },
  { name: 'B1', series: 'ISO-B', wMm: 707, hMm: 1000, equivalents: ['European Event Poster'], aliases: ['b1', 'b1 poster'], category: 'iso-b' },
  { name: 'B2', series: 'ISO-B', wMm: 500, hMm: 707, equivalents: ['Standard Art Poster'], aliases: ['b2', 'b2 poster'], category: 'iso-b' },
  { name: 'B3', series: 'ISO-B', wMm: 353, hMm: 500, equivalents: ['Mini Poster / Legal+'], aliases: ['b3'], category: 'iso-b' },
  { name: 'B4', series: 'ISO-B', wMm: 250, hMm: 353, equivalents: ['Between A3 and A4', 'Music Score'], aliases: ['b4'], category: 'iso-b' },
  { name: 'B5', series: 'ISO-B', wMm: 176, hMm: 250, equivalents: ['Composition Book', 'Tablet Screen'], aliases: ['b5'], category: 'iso-b' },
  { name: 'B6', series: 'ISO-B', wMm: 125, hMm: 176, equivalents: ['Paperback Book'], aliases: ['b6'], category: 'iso-b' },

  // ISO 269 C Series & Envelopes
  { name: 'C4', series: 'ISO-C', wMm: 229, hMm: 324, equivalents: ['Fits unfolded A4 sheet'], aliases: ['c4', 'c4 envelope'], category: 'envelope' },
  { name: 'C5', series: 'ISO-C', wMm: 162, hMm: 229, equivalents: ['Fits folded A4 (half) / A5 flat'], aliases: ['c5', 'c5 envelope'], category: 'envelope' },
  { name: 'C6', series: 'ISO-C', wMm: 114, hMm: 162, equivalents: ['Fits folded A4 (quarters) / A6 flat'], aliases: ['c6', 'c6 envelope'], category: 'envelope' },
  { name: 'DL', series: 'ISO-C', wMm: 110, hMm: 220, equivalents: ['Fits A4 folded into 3rds (Standard Business)'], aliases: ['dl', 'dl envelope'], category: 'envelope' },
  { name: '#10 Commercial', series: 'North-American', wMm: 104.8, hMm: 241.3, equivalents: ['Standard US Business Envelope (fits Letter 3-fold)'], aliases: ['#10', '10', 'number 10', 'no 10', 'envelope 10', 'us #10'], category: 'envelope' },
  { name: '#9 Commercial', series: 'North-American', wMm: 98.4, hMm: 225.4, equivalents: ['US Business Return Envelope'], aliases: ['#9', '9', 'number 9'], category: 'envelope' },
  { name: 'Monarch', series: 'North-American', wMm: 98.4, hMm: 190.5, equivalents: ['Executive / Social Stationery'], aliases: ['monarch', 'monarch envelope'], category: 'envelope' },
  { name: 'A2 Invitation', series: 'North-American', wMm: 111.1, hMm: 146.1, equivalents: ['US Note Card Envelope (4.375 x 5.75 in)'], aliases: ['a2 envelope', 'a2 invitation'], category: 'envelope' },
  { name: 'A7 Announcement', series: 'North-American', wMm: 133.4, hMm: 184.2, equivalents: ['US Greeting / Wedding Card (5.25 x 7.25 in)'], aliases: ['a7 envelope', 'a7 announcement'], category: 'envelope' },

  // North American
  { name: 'US Letter', series: 'North-American', wMm: 215.9, hMm: 279.4, equivalents: ['ANSI A', '8.5 x 11 in'], aliases: ['letter', 'us letter', 'ansi a', 'us-letter'], category: 'north-american' },
  { name: 'US Legal', series: 'North-American', wMm: 215.9, hMm: 355.6, equivalents: ['8.5 x 14 in', 'Contracts & Pleadings'], aliases: ['legal', 'us legal', 'us-legal'], category: 'north-american' },
  { name: 'Tabloid', series: 'North-American', wMm: 279.4, hMm: 431.8, equivalents: ['ANSI B', '11 x 17 in', 'Ledger'], aliases: ['tabloid', 'ledger', 'ansi b', '11x17'], category: 'north-american' },
  { name: 'Executive', series: 'North-American', wMm: 184.2, hMm: 266.7, equivalents: ['7.25 x 10.5 in', 'Monarch Paper'], aliases: ['executive'], category: 'north-american' },
  { name: 'Half Letter', series: 'North-American', wMm: 139.7, hMm: 215.9, equivalents: ['5.5 x 8.5 in', 'Statement / Memo'], aliases: ['half letter', 'statement'], category: 'north-american' },

  // Standard Poster Sizes
  { name: '11x17 Mini Poster', series: 'North-American', wMm: 279.4, hMm: 431.8, equivalents: ['Small Promotional Flyer / Window Sign (11 x 17 in)'], aliases: ['11x17', '11x17 poster', 'mini poster'], category: 'poster' },
  { name: '18x24 Medium Poster', series: 'Architectural', wMm: 457.2, hMm: 609.6, equivalents: ['Standard Retail / Concert Display (18 x 24 in)'], aliases: ['18x24', '18x24 poster', 'medium poster'], category: 'poster' },
  { name: '24x36 Large Poster', series: 'Architectural', wMm: 609.6, hMm: 914.4, equivalents: ['Trade Show / Gallery Exhibition (24 x 36 in)'], aliases: ['24x36', '24x36 poster', 'large poster'], category: 'poster' },
  { name: '27x40 Movie One-Sheet', series: 'North-American', wMm: 685.8, hMm: 1016.0, equivalents: ['Cinema Bus Stop / Theatre One-Sheet (27 x 40 in)'], aliases: ['27x40', '27x40 poster', 'movie poster', 'one sheet'], category: 'poster' },

  // ANSI
  { name: 'ANSI C', series: 'ANSI', wMm: 431.8, hMm: 558.8, equivalents: ['17 x 22 in'], aliases: ['ansi c'], category: 'ansi' },
  { name: 'ANSI D', series: 'ANSI', wMm: 558.8, hMm: 863.6, equivalents: ['22 x 34 in'], aliases: ['ansi d'], category: 'ansi' },
  { name: 'ANSI E', series: 'ANSI', wMm: 863.6, hMm: 1117.6, equivalents: ['34 x 44 in'], aliases: ['ansi e'], category: 'ansi' },

  // Architectural
  { name: 'Arch A', series: 'Architectural', wMm: 228.6, hMm: 304.8, equivalents: ['9 x 12 in'], aliases: ['arch a'], category: 'architectural' },
  { name: 'Arch B', series: 'Architectural', wMm: 304.8, hMm: 457.2, equivalents: ['12 x 18 in'], aliases: ['arch b'], category: 'architectural' },
  { name: 'Arch C', series: 'Architectural', wMm: 457.2, hMm: 609.6, equivalents: ['18 x 24 in'], aliases: ['arch c'], category: 'architectural' },
  { name: 'Arch D', series: 'Architectural', wMm: 609.6, hMm: 914.4, equivalents: ['24 x 36 in (Common Blueprint)'], aliases: ['arch d'], category: 'architectural' },
  { name: 'Arch E', series: 'Architectural', wMm: 914.4, hMm: 1219.2, equivalents: ['36 x 48 in'], aliases: ['arch e'], category: 'architectural' },
];

/**
 * Pure Paper Size Conversion Function
 */
export function paperSize(
  nameOrWidth: string | number,
  sourceSystem: string = 'iso',
  customHeight?: number
): PaperSizeResult {
  let wMm = 210;
  let hMm = 297;
  let name = 'A4';
  let series: PaperSizeResult['series'] = 'ISO-A';
  let equivalents: string[] = ['Standard Global Document'];

  if (typeof nameOrWidth === 'number' && typeof customHeight === 'number') {
    // Custom dimensions passed
    if (sourceSystem === 'inches') {
      wMm = nameOrWidth * 25.4;
      hMm = customHeight * 25.4;
    } else {
      wMm = nameOrWidth;
      hMm = customHeight;
    }
    name = `Custom (${Math.round(wMm)} x ${Math.round(hMm)} mm)`;
    series = 'Custom';
    equivalents = ['User-defined dimension'];
  } else {
    // Catalog lookup by name or alias
    const query = String(nameOrWidth).trim().toLowerCase().replace(/[-_]/g, ' ');
    const found = PAPER_CATALOG.find((p) => {
      if (p.name.toLowerCase() === query) return true;
      if (p.aliases && p.aliases.some((a) => a.toLowerCase() === query)) return true;
      // Also match without spaces or special characters
      const cleanP = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanQ = query.replace(/[^a-z0-9]/g, '');
      return cleanP === cleanQ;
    });

    if (found) {
      wMm = found.wMm;
      hMm = found.hMm;
      name = found.name;
      series = found.series;
      equivalents = found.equivalents;
    }
  }

  const widthIn = wMm / 25.4;
  const heightIn = hMm / 25.4;
  const widthCm = wMm / 10;
  const heightCm = hMm / 10;

  const areaSqM = (wMm * hMm) / 1_000_000;
  const areaSqIn = widthIn * heightIn;
  const ratio = (hMm / wMm).toFixed(3);

  return {
    name,
    series,
    width_mm: Number(wMm.toFixed(1)),
    height_mm: Number(hMm.toFixed(1)),
    width_in: Number(widthIn.toFixed(2)),
    height_in: Number(heightIn.toFixed(2)),
    width_cm: Number(widthCm.toFixed(2)),
    height_cm: Number(heightCm.toFixed(2)),
    aspect_ratio: `1 : ${ratio}`,
    area_sq_m: Number(areaSqM.toFixed(4)),
    area_sq_in: Number(areaSqIn.toFixed(2)),
    equivalent_sizes: equivalents,
  };
}
