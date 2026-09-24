import type { DataUnit, DataStandard, DataStorageResult } from './types';

/**
 * Pure Data Storage & Bandwidth Conversion Function
 * Calculates both Decimal (SI standard, base 1,000) and Binary (IEC standard, base 1,024).
 */
export function dataStorage(
  value: number,
  sourceUnit: DataUnit = 'GB',
  standard: DataStandard = 'decimal'
): DataStorageResult {
  const safeVal = isNaN(value) ? 0 : Math.max(0, value);

  // Normalize input to raw Bytes (B)
  let bytes = 0;
  const decBase = 1000;
  const binBase = 1024;

  const unitLower = sourceUnit.toLowerCase();

  if (sourceUnit === 'b') {
    bytes = safeVal / 8;
  } else if (sourceUnit === 'B') {
    bytes = safeVal;
  } else if (unitLower === 'kb') {
    bytes = safeVal * (standard === 'binary' ? binBase : decBase);
  } else if (unitLower === 'mb') {
    bytes = safeVal * Math.pow(standard === 'binary' ? binBase : decBase, 2);
  } else if (unitLower === 'gb') {
    bytes = safeVal * Math.pow(standard === 'binary' ? binBase : decBase, 3);
  } else if (unitLower === 'tb') {
    bytes = safeVal * Math.pow(standard === 'binary' ? binBase : decBase, 4);
  } else if (unitLower === 'pb') {
    bytes = safeVal * Math.pow(standard === 'binary' ? binBase : decBase, 5);
  } else if (sourceUnit === 'KiB') {
    bytes = safeVal * binBase;
  } else if (sourceUnit === 'MiB') {
    bytes = safeVal * Math.pow(binBase, 2);
  } else if (sourceUnit === 'GiB') {
    bytes = safeVal * Math.pow(binBase, 3);
  } else if (sourceUnit === 'TiB') {
    bytes = safeVal * Math.pow(binBase, 4);
  } else if (sourceUnit === 'PiB') {
    bytes = safeVal * Math.pow(binBase, 5);
  } else {
    bytes = safeVal;
  }

  const bits = bytes * 8;

  // Decimal calculations (base 1,000)
  const kilobytes = bytes / decBase;
  const megabytes = bytes / Math.pow(decBase, 2);
  const gigabytes = bytes / Math.pow(decBase, 3);
  const terabytes = bytes / Math.pow(decBase, 4);
  const petabytes = bytes / Math.pow(decBase, 5);

  // Binary calculations (base 1,024)
  const kibibytes = bytes / binBase;
  const mebibytes = bytes / Math.pow(binBase, 2);
  const gibibytes = bytes / Math.pow(binBase, 3);
  const tebibytes = bytes / Math.pow(binBase, 4);
  const pebibytes = bytes / Math.pow(binBase, 5);

  // Human readable representations
  const formatNum = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  let humanDec = `${formatNum(bytes)} B`;
  if (petabytes >= 1) humanDec = `${formatNum(petabytes)} PB`;
  else if (terabytes >= 1) humanDec = `${formatNum(terabytes)} TB`;
  else if (gigabytes >= 1) humanDec = `${formatNum(gigabytes)} GB`;
  else if (megabytes >= 1) humanDec = `${formatNum(megabytes)} MB`;
  else if (kilobytes >= 1) humanDec = `${formatNum(kilobytes)} KB`;

  let humanBin = `${formatNum(bytes)} B`;
  if (pebibytes >= 1) humanBin = `${formatNum(pebibytes)} PiB`;
  else if (tebibytes >= 1) humanBin = `${formatNum(tebibytes)} TiB`;
  else if (gibibytes >= 1) humanBin = `${formatNum(gibibytes)} GiB`;
  else if (mebibytes >= 1) humanBin = `${formatNum(mebibytes)} MiB`;
  else if (kibibytes >= 1) humanBin = `${formatNum(kibibytes)} KiB`;

  return {
    bits: Math.round(bits),
    bytes: Math.round(bytes),
    kilobytes: Number(kilobytes.toFixed(4)),
    megabytes: Number(megabytes.toFixed(4)),
    gigabytes: Number(gigabytes.toFixed(4)),
    terabytes: Number(terabytes.toFixed(6)),
    petabytes: Number(petabytes.toFixed(8)),
    kibibytes: Number(kibibytes.toFixed(4)),
    mebibytes: Number(mebibytes.toFixed(4)),
    gibibytes: Number(gibibytes.toFixed(4)),
    tebibytes: Number(tebibytes.toFixed(6)),
    pebibytes: Number(pebibytes.toFixed(8)),
    human_readable_decimal: humanDec,
    human_readable_binary: humanBin,
  };
}
