export * from './cooking';
import { cookingUnits } from './cooking';
import type { CookingUnit, CookingUnitsResult } from './types';

export { cookingUnits };
export type { CookingUnit, CookingUnitsResult };

export interface IngredientDensity {
  key: string;
  name: string;
  category: 'flour' | 'sugar' | 'dairy' | 'grains' | 'liquids' | 'other';
  gPerCup: number;
  gPerTbsp: number;
  gPerTsp: number;
}

export const CULINARY_INGREDIENTS: Record<string, IngredientDensity> = {
  flour_all_purpose: { key: 'flour_all_purpose', name: 'All-Purpose Flour', category: 'flour', gPerCup: 125, gPerTbsp: 7.8, gPerTsp: 2.6 },
  flour_bread: { key: 'flour_bread', name: 'Bread Flour', category: 'flour', gPerCup: 127, gPerTbsp: 7.9, gPerTsp: 2.6 },
  flour_cake: { key: 'flour_cake', name: 'Cake Flour', category: 'flour', gPerCup: 114, gPerTbsp: 7.1, gPerTsp: 2.4 },
  flour_whole_wheat: { key: 'flour_whole_wheat', name: 'Whole Wheat Flour', category: 'flour', gPerCup: 130, gPerTbsp: 8.1, gPerTsp: 2.7 },
  sugar_granulated: { key: 'sugar_granulated', name: 'Granulated White Sugar', category: 'sugar', gPerCup: 200, gPerTbsp: 12.5, gPerTsp: 4.2 },
  sugar_brown_packed: { key: 'sugar_brown_packed', name: 'Brown Sugar (Packed)', category: 'sugar', gPerCup: 220, gPerTbsp: 13.8, gPerTsp: 4.6 },
  sugar_powdered: { key: 'sugar_powdered', name: 'Confectioners / Powdered Sugar', category: 'sugar', gPerCup: 120, gPerTbsp: 7.5, gPerTsp: 2.5 },
  butter: { key: 'butter', name: 'Butter (Solid or Melted)', category: 'dairy', gPerCup: 227, gPerTbsp: 14.2, gPerTsp: 4.7 },
  rice_white: { key: 'rice_white', name: 'White Rice (Uncooked)', category: 'grains', gPerCup: 185, gPerTbsp: 11.6, gPerTsp: 3.9 },
  rice_brown: { key: 'rice_brown', name: 'Brown Rice (Uncooked)', category: 'grains', gPerCup: 190, gPerTbsp: 11.9, gPerTsp: 4.0 },
  oats_rolled: { key: 'oats_rolled', name: 'Rolled Oats', category: 'grains', gPerCup: 90, gPerTbsp: 5.6, gPerTsp: 1.9 },
  cocoa_powder: { key: 'cocoa_powder', name: 'Unsweetened Cocoa Powder', category: 'other', gPerCup: 100, gPerTbsp: 6.25, gPerTsp: 2.1 },
  honey: { key: 'honey', name: 'Honey / Maple Syrup', category: 'liquids', gPerCup: 340, gPerTbsp: 21.3, gPerTsp: 7.1 },
  water: { key: 'water', name: 'Water / Clear Broth', category: 'liquids', gPerCup: 236.6, gPerTbsp: 14.8, gPerTsp: 4.9 },
  milk_whole: { key: 'milk_whole', name: 'Whole Milk', category: 'dairy', gPerCup: 244, gPerTbsp: 15.3, gPerTsp: 5.1 },
  vegetable_oil: { key: 'vegetable_oil', name: 'Vegetable / Olive Oil', category: 'liquids', gPerCup: 215, gPerTbsp: 13.4, gPerTsp: 4.5 },
};

/**
 * Butter Converter Result
 */
export interface ButterResult {
  grams: number;
  ounces: number;
  cups: number;
  sticks: number;
  tablespoons: number;
  teaspoons: number;
}

export function convertButter(val: number, unit: 'sticks' | 'cups' | 'tbsp' | 'g' | 'oz'): ButterResult {
  let grams = 0;
  switch (unit) {
    case 'sticks': grams = val * 113.4; break;
    case 'cups': grams = val * 226.8; break;
    case 'tbsp': grams = val * 14.175; break;
    case 'oz': grams = val * 28.3495; break;
    case 'g': grams = val; break;
  }
  return {
    grams: Math.round(grams * 10) / 10,
    ounces: Number((grams / 28.3495).toFixed(2)),
    cups: Number((grams / 226.8).toFixed(3)),
    sticks: Number((grams / 113.4).toFixed(2)),
    tablespoons: Number((grams / 14.175).toFixed(1)),
    teaspoons: Number((grams / 4.725).toFixed(1)),
  };
}

/**
 * Oven Temperature Converter Result
 */
export interface OvenTempResult {
  fahrenheit: number;
  celsius: number;
  fan_celsius: number;
  gas_mark: string;
  description: string;
}

export const OVEN_TEMP_DATA = [
  { fahrenheit: 225, celsius: 110, fan: 90, gasMark: '1/4', desc: 'Very Cool' },
  { fahrenheit: 250, celsius: 120, fan: 100, gasMark: '1/2', desc: 'Very Cool' },
  { fahrenheit: 275, celsius: 140, fan: 120, gasMark: '1', desc: 'Cool' },
  { fahrenheit: 300, celsius: 150, fan: 130, gasMark: '2', desc: 'Cool' },
  { fahrenheit: 325, celsius: 165, fan: 145, gasMark: '3', desc: 'Warm' },
  { fahrenheit: 350, celsius: 177, fan: 160, gasMark: '4', desc: 'Moderate' },
  { fahrenheit: 375, celsius: 190, fan: 170, gasMark: '5', desc: 'Moderate' },
  { fahrenheit: 400, celsius: 200, fan: 180, gasMark: '6', desc: 'Moderately Hot' },
  { fahrenheit: 425, celsius: 220, fan: 200, gasMark: '7', desc: 'Hot' },
  { fahrenheit: 450, celsius: 230, fan: 210, gasMark: '8', desc: 'Hot' },
  { fahrenheit: 475, celsius: 245, fan: 225, gasMark: '9', desc: 'Very Hot' },
];

export function convertOvenTemperature(val: number, source: 'F' | 'C' | 'gas'): OvenTempResult {
  let f = 350;
  if (source === 'F') {
    f = val;
  } else if (source === 'C') {
    f = Math.round((val * 9) / 5 + 32);
  } else {
    // Gas Mark approximate lookup
    const closest = OVEN_TEMP_DATA.reduce((prev, curr) =>
      Math.abs(parseFloat(curr.gasMark) - val) < Math.abs(parseFloat(prev.gasMark) - val) ? curr : prev
    );
    f = closest.fahrenheit;
  }

  const c = Math.round(((f - 32) * 5) / 9);
  const fanC = Math.round(c - 20);

  // Find closest gas mark & description from table
  const closest = OVEN_TEMP_DATA.reduce((prev, curr) =>
    Math.abs(curr.fahrenheit - f) < Math.abs(prev.fahrenheit - f) ? curr : prev
  );

  return {
    fahrenheit: f,
    celsius: c,
    fan_celsius: fanC,
    gas_mark: closest.gasMark,
    description: closest.desc,
  };
}
