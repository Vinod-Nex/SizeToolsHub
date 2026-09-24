import type { CookingUnit, CookingUnitsResult } from './types';

const INGREDIENT_DENSITIES: Record<string, { name: string; gPerCup: number }> = {
  flour_all_purpose: { name: 'All-Purpose Flour', gPerCup: 125 },
  flour_bread: { name: 'Bread Flour', gPerCup: 127 },
  sugar_white: { name: 'Granulated White Sugar', gPerCup: 200 },
  sugar_brown: { name: 'Packed Brown Sugar', gPerCup: 220 },
  sugar_powdered: { name: 'Confectioners / Powdered Sugar', gPerCup: 120 },
  butter: { name: 'Butter', gPerCup: 227 },
  milk_whole: { name: 'Whole Milk', gPerCup: 244 },
  water: { name: 'Water', gPerCup: 236.6 },
  cocoa_powder: { name: 'Unsweetened Cocoa Powder', gPerCup: 100 },
  oats_rolled: { name: 'Rolled Oats', gPerCup: 90 },
  honey: { name: 'Honey / Maple Syrup', gPerCup: 340 },
  default: { name: 'Standard Liquid / Ingredient', gPerCup: 240 },
};

/**
 * Pure Culinary & Baking Measurement Conversion Function
 */
export function cookingUnits(
  value: number,
  sourceUnit: CookingUnit = 'cups',
  ingredientKey: string = 'flour_all_purpose'
): CookingUnitsResult {
  const safeVal = isNaN(value) ? 0 : Math.max(0, value);
  const density = INGREDIENT_DENSITIES[ingredientKey] || INGREDIENT_DENSITIES.default;

  // Step 1: Normalize input to Base Volume in US Cups
  let baseCups = 0;

  switch (sourceUnit) {
    case 'cups':
      baseCups = safeVal;
      break;
    case 'tbsp':
      baseCups = safeVal / 16;
      break;
    case 'tsp':
      baseCups = safeVal / 48;
      break;
    case 'ml':
      baseCups = safeVal / 236.588;
      break;
    case 'floz':
      baseCups = safeVal / 8;
      break;
    case 'g':
      baseCups = safeVal / density.gPerCup;
      break;
    case 'oz':
      baseCups = (safeVal * 28.3495) / density.gPerCup;
      break;
    default:
      baseCups = safeVal;
  }

  // Step 2: Compute all targets
  const tablespoons = baseCups * 16;
  const teaspoons = baseCups * 48;
  const milliliters = baseCups * 236.588;
  const fluidOunces = baseCups * 8;
  const grams = baseCups * density.gPerCup;
  const ouncesWeight = grams / 28.3495;

  return {
    cups: Number(baseCups.toFixed(3)),
    tablespoons: Number(tablespoons.toFixed(2)),
    teaspoons: Number(teaspoons.toFixed(2)),
    milliliters: Number(milliliters.toFixed(1)),
    fluid_ounces: Number(fluidOunces.toFixed(2)),
    grams: Math.round(grams * 10) / 10,
    ounces_weight: Number(ouncesWeight.toFixed(2)),
    ingredient: density.name,
    density_g_per_cup: density.gPerCup,
  };
}
