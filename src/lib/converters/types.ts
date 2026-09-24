/**
 * SizeToolsHub Conversion Engine — Core Type Definitions
 * Framework-agnostic, zero DOM dependencies.
 */

// ─── 1. Shoe Size Types ───
export type ShoeSystem = 'us_m' | 'us_w' | 'us_k' | 'uk' | 'eu' | 'br' | 'jp_cm' | 'mondo';
export type ShoeCategory = 'men' | 'women' | 'kids';

export interface ShoeSizeResult {
  us_men: number;
  us_women: number;
  us_kids: number;
  uk: number;
  eu: number;
  br: number;
  jp_cm: number;
  mondo_mm: number;
  foot_length_in: number;
  foot_length_cm: number;
}

// ─── 2. Clothing Size Types ───
export type ClothingSystem = 'us' | 'uk' | 'eu' | 'intl' | 'br';
export type ClothingCategory = 'women' | 'men';
export type GarmentType = 'general' | 'tops' | 'bottoms' | 'dresses' | 'suits';

export interface ClothingSizeResult {
  us: string;
  uk: string;
  eu: string;
  intl: string;
  br: string;
  category: ClothingCategory;
  measurements: {
    chest_in: string;
    chest_cm: string;
    waist_in: string;
    waist_cm: string;
    hips_in: string;
    hips_cm: string;
  };
}

// ─── 3. Ring Size Types ───
export type RingSystem = 'us' | 'uk' | 'eu' | 'jp' | 'diameter_mm' | 'circumference_mm';

export interface RingSizeResult {
  us: number;
  uk: string;
  eu: number; // ISO 8653 circumference in mm
  jp: number;
  diameter_mm: number;
  diameter_in: number;
  circumference_mm: number;
  circumference_in: number;
}

// ─── 4. Cooking Units Types ───
export type CookingUnit = 'cups' | 'tbsp' | 'tsp' | 'ml' | 'floz' | 'g' | 'oz';

export interface CookingUnitsResult {
  cups: number;
  tablespoons: number;
  teaspoons: number;
  milliliters: number;
  fluid_ounces: number;
  grams: number;
  ounces_weight: number;
  ingredient: string;
  density_g_per_cup: number;
}

// ─── 5. Data Storage Types ───
export type DataUnit = 'b' | 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB';
export type DataStandard = 'decimal' | 'binary';

export interface DataStorageResult {
  bits: number;
  bytes: number;
  // Decimal (base 1000)
  kilobytes: number;
  megabytes: number;
  gigabytes: number;
  terabytes: number;
  petabytes: number;
  // Binary / IEC (base 1024)
  kibibytes: number;
  mebibytes: number;
  gibibytes: number;
  tebibytes: number;
  pebibytes: number;
  human_readable_decimal: string;
  human_readable_binary: string;
}

// ─── 6. Paper Size Types ───
export interface PaperSizeResult {
  name: string;
  series: 'ISO-A' | 'ISO-B' | 'ISO-C' | 'North-American' | 'ANSI' | 'Architectural' | 'Custom';
  width_mm: number;
  height_mm: number;
  width_in: number;
  height_in: number;
  width_cm: number;
  height_cm: number;
  aspect_ratio: string;
  area_sq_m: number;
  area_sq_in: number;
  equivalent_sizes: string[];
}

// ─── 7. Fuel Economy Types ───
export type FuelUnit = 'mpg_us' | 'mpg_uk' | 'l_100km' | 'km_l';

export interface FuelEconomyResult {
  mpg_us: number;
  mpg_uk: number;
  l_100km: number;
  km_l: number;
  formulas: {
    mpg_us_to_l_100km: string;
    mpg_uk_to_l_100km: string;
  };
  efficiency_rating: 'Ultra High / EV-Hybrid' | 'High Efficiency' | 'Average Passenger' | 'Low Economy / Heavy Duty';
}
