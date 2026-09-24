export * from './fuel';
import { fuelEconomy } from './fuel';
import type { FuelUnit, FuelEconomyResult } from './types';

export { fuelEconomy };
export type { FuelUnit, FuelEconomyResult };

export interface DistanceResult {
  km: number;
  miles: number;
  meters: number;
  feet: number;
  formula: string;
}

/**
 * Pure Distance Conversion Function (Kilometers ⇄ Miles)
 */
export function distance(value: number, from: 'km' | 'miles'): DistanceResult {
  const safeVal = Math.max(0, isNaN(value) ? 0 : value);

  if (from === 'km') {
    const miles = safeVal * 0.621371192;
    return {
      km: safeVal,
      miles: Number(miles.toFixed(2)),
      meters: Number((safeVal * 1000).toFixed(1)),
      feet: Number((miles * 5280).toFixed(1)),
      formula: `${safeVal} km × 0.621371 = ${Number(miles.toFixed(2))} miles`,
    };
  } else {
    const km = safeVal * 1.609344;
    return {
      km: Number(km.toFixed(2)),
      miles: safeVal,
      meters: Number((km * 1000).toFixed(1)),
      feet: Number((safeVal * 5280).toFixed(1)),
      formula: `${safeVal} miles × 1.609344 = ${Number(km.toFixed(2))} km`,
    };
  }
}

export interface FuelCostResult {
  distance: number;
  distanceUnit: 'miles' | 'km';
  fuelEfficiency: number;
  efficiencyUnit: FuelUnit;
  fuelPrice: number;
  priceUnit: 'per_gallon' | 'per_liter';
  totalGallonsNeeded: number;
  totalLitersNeeded: number;
  totalTripCost: number;
  costPerMile: number;
  costPerKm: number;
  co2KgEstimate: number;
}

/**
 * Fuel & Trip Cost Calculator
 * Computes exact fuel volume required, total expedition expense, and per-mile/per-km costs.
 */
export function calculateFuelCost(
  distanceVal: number,
  distanceUnit: 'miles' | 'km' = 'miles',
  efficiencyVal: number = 30,
  efficiencyUnit: FuelUnit = 'mpg_us',
  fuelPrice: number = 3.50,
  priceUnit: 'per_gallon' | 'per_liter' = 'per_gallon'
): FuelCostResult {
  const safeDist = Math.max(0, isNaN(distanceVal) ? 0 : distanceVal);
  const safeEff = Math.max(0.1, isNaN(efficiencyVal) ? 30 : efficiencyVal);
  const safePrice = Math.max(0, isNaN(fuelPrice) ? 0 : fuelPrice);

  // Normalize distance to both miles and km
  const miles = distanceUnit === 'miles' ? safeDist : safeDist * 0.621371192;
  const km = distanceUnit === 'km' ? safeDist : safeDist * 1.609344;

  // Convert fuel economy to both US MPG and L/100km
  const economy = fuelEconomy(safeEff, efficiencyUnit);
  const mpgUs = economy.mpg_us;
  const l100km = economy.l_100km;

  // Total volume needed
  const totalGallons = mpgUs > 0 ? miles / mpgUs : 0;
  const totalLiters = (km / 100) * l100km;

  // Total cost
  let totalCost = 0;
  if (priceUnit === 'per_gallon') {
    totalCost = totalGallons * safePrice;
  } else {
    totalCost = totalLiters * safePrice;
  }

  const costPerMile = miles > 0 ? totalCost / miles : 0;
  const costPerKm = km > 0 ? totalCost / km : 0;

  // Average gasoline emission factor: ~8.887 kg CO2 per gallon (2.35 kg CO2 per liter)
  const co2Kg = totalGallons * 8.887;

  return {
    distance: safeDist,
    distanceUnit,
    fuelEfficiency: safeEff,
    efficiencyUnit,
    fuelPrice: safePrice,
    priceUnit,
    totalGallonsNeeded: Number(totalGallons.toFixed(2)),
    totalLitersNeeded: Number(totalLiters.toFixed(2)),
    totalTripCost: Number(totalCost.toFixed(2)),
    costPerMile: Number(costPerMile.toFixed(3)),
    costPerKm: Number(costPerKm.toFixed(3)),
    co2KgEstimate: Number(co2Kg.toFixed(1)),
  };
}

export interface VehicleBenchmark {
  category: string;
  exampleVehicle: string;
  mpgUs: number;
  l100km: number;
  mpgUk: number;
  rating: string;
}

export const VEHICLE_BENCHMARKS: VehicleBenchmark[] = [
  { category: 'Plug-in Hybrid (Electric + Gas)', exampleVehicle: 'Toyota Prius Prime / Hyundai Ioniq', mpgUs: 56, l100km: 4.2, mpgUk: 67.2, rating: 'Ultra High Efficiency' },
  { category: 'Standard Hybrid', exampleVehicle: 'Toyota Camry Hybrid / Honda Accord Hybrid', mpgUs: 52, l100km: 4.5, mpgUk: 62.4, rating: 'High Efficiency' },
  { category: 'Compact Sedan', exampleVehicle: 'Honda Civic / Toyota Corolla (2.0L)', mpgUs: 36, l100km: 6.5, mpgUk: 43.2, rating: 'High Efficiency' },
  { category: 'Midsize Crossover / Compact SUV', exampleVehicle: 'Toyota RAV4 / Honda CR-V (Gasoline)', mpgUs: 30, l100km: 7.8, mpgUk: 36.0, rating: 'Average Passenger' },
  { category: 'Midsize 3-Row SUV', exampleVehicle: 'Ford Explorer / Toyota Highlander V6', mpgUs: 23, l100km: 10.2, mpgUk: 27.6, rating: 'Average Passenger' },
  { category: 'Full-Size Pickup Truck', exampleVehicle: 'Ford F-150 / Chevrolet Silverado 1500', mpgUs: 19, l100km: 12.4, mpgUk: 22.8, rating: 'Low Economy' },
  { category: 'Performance Sports Car', exampleVehicle: 'Ford Mustang GT / Chevrolet Corvette V8', mpgUs: 18, l100km: 13.1, mpgUk: 21.6, rating: 'Low Economy' },
  { category: 'Heavy Duty Commercial Truck', exampleVehicle: 'RAM 2500 / Ford Super Duty (Towing)', mpgUs: 13, l100km: 18.1, mpgUk: 15.6, rating: 'Heavy Duty / Low Economy' },
];
