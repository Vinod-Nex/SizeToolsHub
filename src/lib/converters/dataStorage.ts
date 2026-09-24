export * from './data';
import { dataStorage } from './data';
import type { DataUnit, DataStandard, DataStorageResult } from './types';

export { dataStorage };
export type { DataUnit, DataStandard, DataStorageResult };

export interface DownloadTimeResult {
  file_size_bytes: number;
  speed_mbps: number;
  total_seconds: number;
  formatted_time: string;
  hours: number;
  minutes: number;
  seconds: number;
  days: number;
}

/**
 * Download & Transfer Time Calculator
 * Calculates transfer duration given file size, unit, and network speed in Mbps
 */
export function calculateDownloadTime(
  fileSize: number,
  sizeUnit: DataUnit = 'GB',
  speedMbps: number = 100,
  standard: DataStandard = 'decimal'
): DownloadTimeResult {
  const safeSize = Math.max(0, fileSize);
  const safeSpeed = Math.max(0.1, speedMbps);

  // Convert file size to bits
  const storage = dataStorage(safeSize, sizeUnit, standard);
  const totalBits = storage.bits;

  // Network speed is in Megabits per second (1 Mbps = 1,000,000 bits/sec)
  const speedBitsPerSec = safeSpeed * 1_000_000;
  const totalSeconds = totalBits / speedBitsPerSec;

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  let formatted = '';
  if (days > 0) {
    formatted = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    formatted = `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    formatted = `${minutes}m ${seconds}s`;
  } else {
    formatted = `${seconds}s`;
  }

  return {
    file_size_bytes: storage.bytes,
    speed_mbps: safeSpeed,
    total_seconds: Math.round(totalSeconds * 10) / 10,
    formatted_time: formatted || '< 1s',
    hours,
    minutes,
    seconds,
    days,
  };
}

export interface StorageStandardRow {
  prefix: string;
  decimalUnit: string;
  decimalBytes: string;
  binaryUnit: string;
  binaryBytes: string;
  percentageDiff: string;
}

export const STORAGE_STANDARDS_TABLE: StorageStandardRow[] = [
  { prefix: 'Kilo / Kibi', decimalUnit: '1 KB = 1,000 B', decimalBytes: '1,000', binaryUnit: '1 KiB = 1,024 B', binaryBytes: '1,024', percentageDiff: '+2.4%' },
  { prefix: 'Mega / Mebi', decimalUnit: '1 MB = 1,000,000 B', decimalBytes: '1,000,000', binaryUnit: '1 MiB = 1,048,576 B', binaryBytes: '1,048,576', percentageDiff: '+4.86%' },
  { prefix: 'Giga / Gibi', decimalUnit: '1 GB = 1,000,000,000 B', decimalBytes: '1,000,000,000', binaryUnit: '1 GiB = 1,073,741,824 B', binaryBytes: '1,073,741,824', percentageDiff: '+7.37%' },
  { prefix: 'Tera / Tebi', decimalUnit: '1 TB = 10¹² B', decimalBytes: '1,000,000,000,000', binaryUnit: '1 TiB = 2⁴⁰ B', binaryBytes: '1,099,511,627,776', percentageDiff: '+9.95%' },
  { prefix: 'Peta / Pebi', decimalUnit: '1 PB = 10¹⁵ B', decimalBytes: '1,000,000,000,000,000', binaryUnit: '1 PiB = 2⁵⁰ B', binaryBytes: '1,125,899,906,842,624', percentageDiff: '+12.59%' },
];
