import type { FuelUnit, FuelEconomyResult } from './types';

/**
 * Pure Fuel Economy & Mileage Consumption Function
 * Converts between US MPG, Imperial UK MPG, L/100km, and km/L.
 */
export function fuelEconomy(
  value: number,
  sourceUnit: FuelUnit = 'mpg_us'
): FuelEconomyResult {
  const safeVal = isNaN(value) || value <= 0 ? 30 : value;

  // Normalize to Liters per 100 Kilometers (L/100km)
  let l100km = 7.84;

  switch (sourceUnit) {
    case 'mpg_us':
      l100km = 235.214583 / safeVal;
      break;
    case 'mpg_uk':
      l100km = 282.480936 / safeVal;
      break;
    case 'l_100km':
      l100km = safeVal;
      break;
    case 'km_l':
      l100km = 100 / safeVal;
      break;
    default:
      l100km = 235.214583 / safeVal;
  }

  // Calculate all other targets from L/100km
  const mpgUs = 235.214583 / l100km;
  const mpgUk = 282.480936 / l100km;
  const kmL = 100 / l100km;

  // Efficiency Rating
  let rating: FuelEconomyResult['efficiency_rating'] = 'Average Passenger';
  if (l100km <= 4.5) {
    rating = 'Ultra High / EV-Hybrid';
  } else if (l100km <= 7.0) {
    rating = 'High Efficiency';
  } else if (l100km <= 10.5) {
    rating = 'Average Passenger';
  } else {
    rating = 'Low Economy / Heavy Duty';
  }

  return {
    mpg_us: Number(mpgUs.toFixed(2)),
    mpg_uk: Number(mpgUk.toFixed(2)),
    l_100km: Number(l100km.toFixed(2)),
    km_l: Number(kmL.toFixed(2)),
    formulas: {
      mpg_us_to_l_100km: '235.215 / MPG(US) = L/100km',
      mpg_uk_to_l_100km: '282.481 / MPG(UK) = L/100km',
    },
    efficiency_rating: rating,
  };
}
