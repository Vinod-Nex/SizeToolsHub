export * from './ring';
import { ringSize } from './ring';
import type { RingSystem, RingSizeResult } from './types';

export { ringSize };
export type { RingSystem, RingSizeResult };

export interface StandardRingRow {
  us: string;
  uk: string;
  eu: number;
  jp: number;
  diameter_mm: number;
  circumference_mm: number;
  diameter_in: number;
}

export const STANDARD_RING_DATA: StandardRingRow[] = [
  { us: '3.0', uk: 'F', eu: 44, jp: 4, diameter_mm: 14.07, circumference_mm: 44.2, diameter_in: 0.554 },
  { us: '3.5', uk: 'G', eu: 45, jp: 5, diameter_mm: 14.48, circumference_mm: 45.5, diameter_in: 0.570 },
  { us: '4.0', uk: 'H', eu: 47, jp: 7, diameter_mm: 14.88, circumference_mm: 46.8, diameter_in: 0.586 },
  { us: '4.5', uk: 'I', eu: 48, jp: 8, diameter_mm: 15.29, circumference_mm: 48.0, diameter_in: 0.602 },
  { us: '5.0', uk: 'J 1/2', eu: 49, jp: 9, diameter_mm: 15.70, circumference_mm: 49.3, diameter_in: 0.618 },
  { us: '5.5', uk: 'K 1/2', eu: 51, jp: 10, diameter_mm: 16.10, circumference_mm: 50.6, diameter_in: 0.634 },
  { us: '6.0', uk: 'L 1/2', eu: 52, jp: 11, diameter_mm: 16.51, circumference_mm: 51.9, diameter_in: 0.650 },
  { us: '6.5', uk: 'M 1/2', eu: 53, jp: 13, diameter_mm: 16.92, circumference_mm: 53.1, diameter_in: 0.666 },
  { us: '7.0', uk: 'N 1/2', eu: 54, jp: 14, diameter_mm: 17.32, circumference_mm: 54.4, diameter_in: 0.682 },
  { us: '7.5', uk: 'O 1/2', eu: 56, jp: 15, diameter_mm: 17.73, circumference_mm: 55.7, diameter_in: 0.698 },
  { us: '8.0', uk: 'P 1/2', eu: 57, jp: 16, diameter_mm: 18.14, circumference_mm: 57.0, diameter_in: 0.714 },
  { us: '8.5', uk: 'Q 1/2', eu: 58, jp: 17, diameter_mm: 18.54, circumference_mm: 58.2, diameter_in: 0.730 },
  { us: '9.0', uk: 'R 1/2', eu: 60, jp: 18, diameter_mm: 18.95, circumference_mm: 59.5, diameter_in: 0.746 },
  { us: '9.5', uk: 'S 1/2', eu: 61, jp: 20, diameter_mm: 19.35, circumference_mm: 60.8, diameter_in: 0.762 },
  { us: '10.0', uk: 'T 1/2', eu: 62, jp: 21, diameter_mm: 19.76, circumference_mm: 62.1, diameter_in: 0.778 },
  { us: '10.5', uk: 'U 1/2', eu: 63, jp: 22, diameter_mm: 20.17, circumference_mm: 63.4, diameter_in: 0.794 },
  { us: '11.0', uk: 'V 1/2', eu: 65, jp: 23, diameter_mm: 20.57, circumference_mm: 64.6, diameter_in: 0.810 },
  { us: '11.5', uk: 'W 1/2', eu: 66, jp: 24, diameter_mm: 20.98, circumference_mm: 65.9, diameter_in: 0.826 },
  { us: '12.0', uk: 'X 1/2', eu: 67, jp: 25, diameter_mm: 21.39, circumference_mm: 67.2, diameter_in: 0.842 },
  { us: '12.5', uk: 'Y 1/2', eu: 69, jp: 26, diameter_mm: 21.79, circumference_mm: 68.5, diameter_in: 0.858 },
  { us: '13.0', uk: 'Z 1/2', eu: 70, jp: 27, diameter_mm: 22.20, circumference_mm: 69.7, diameter_in: 0.874 },
];
