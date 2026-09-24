import {
  shoeSize,
  clothingSize,
  ringSize,
  cookingUnits,
  dataStorage,
  paperSize,
  comparePaperSizes,
  fuelEconomy,
  distance,
  calculateFuelCost,
} from './index';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('--- Running Conversion Engine Unit Tests ---');

// 1. Shoe Size Tests
const shoe = shoeSize(10, 'us_m', 'men');
assert(shoe.us_men === 10, 'Shoe US Men should be 10');
assert(shoe.uk === 9.5, 'Shoe UK Men should be 9.5');
assert(shoe.eu === 44, 'Shoe EU Men should be 44');
assert(shoe.foot_length_cm > 26 && shoe.foot_length_cm < 28, 'Shoe foot length should be ~27cm');
console.log('✓ Shoe Size conversion tests passed.');

// 2. Clothing Size Tests
const cloth = clothingSize('6', 'us', 'women');
assert(cloth.us === '6', 'Clothing US should be 6');
assert(cloth.uk === '10', 'Clothing UK should be 10');
assert(cloth.eu === '38', 'Clothing EU should be 38');
assert(cloth.intl === 'S', 'Clothing Intl should be S');
console.log('✓ Clothing Size conversion tests passed.');

// 3. Ring Size Tests
const ring = ringSize(7, 'us');
assert(ring.us === 7, 'Ring US should be 7');
assert(ring.uk.startsWith('N'), 'Ring UK should be N or N 1/2');
assert(ring.eu === 54 || ring.eu === 55, 'Ring EU ISO should be 54-55');
assert(ring.diameter_mm > 17 && ring.diameter_mm < 18, 'Ring diameter should be ~17.3mm');
console.log('✓ Ring Size conversion tests passed.');

// 4. Cooking Units Tests
const flour = cookingUnits(2, 'cups', 'flour_all_purpose');
assert(flour.cups === 2, 'Cooking cups should be 2');
assert(flour.grams === 250, '2 cups of AP flour should be 250g');
assert(flour.tablespoons === 32, '2 cups should be 32 tablespoons');
console.log('✓ Cooking Units conversion tests passed.');

// 5. Data Storage Tests
const dataDec = dataStorage(1, 'TB', 'decimal');
assert(dataDec.gigabytes === 1000, '1 TB decimal should be 1000 GB');
const dataBin = dataStorage(1, 'TiB', 'binary');
assert(dataBin.gibibytes === 1024, '1 TiB binary should be 1024 GiB');
console.log('✓ Data Storage conversion tests passed.');

// 6. Paper Size Tests
const a4 = paperSize('A4');
assert(a4.width_mm === 210, 'A4 width should be 210mm');
assert(a4.height_mm === 297, 'A4 height should be 297mm');
assert(a4.width_in > 8.2 && a4.width_in < 8.3, 'A4 width should be ~8.27in');

const comp = comparePaperSizes('A4', 'US Letter');
assert(comp.isATaller === true, 'A4 should be taller than US Letter');
assert(comp.isAWider === false, 'A4 should be narrower than US Letter');
assert(comp.heightDiffMm === 17.6, 'A4 is 17.6mm taller than Letter');
console.log('✓ Paper Size conversion and comparison tests passed.');

// 7. Fuel Economy Tests
const fuel = fuelEconomy(30, 'mpg_us');
assert(fuel.mpg_us === 30, 'Fuel US MPG should be 30');
assert(fuel.l_100km === 7.84, '30 US MPG should be ~7.84 L/100km');
assert(fuel.km_l > 12 && fuel.km_l < 13, '30 US MPG should be ~12.75 km/L');

// Fuel distance & trip cost tests
const dist = distance(100, 'km');
assert(dist.miles === 62.14, '100 km should be 62.14 miles');
const distMiles = distance(62.1371, 'miles');
assert(distMiles.km === 100, '62.1371 miles should be 100 km');

const trip = calculateFuelCost(300, 'miles', 30, 'mpg_us', 3.50, 'per_gallon');
assert(trip.totalGallonsNeeded === 10, '300 miles at 30 MPG needs 10 gallons');
assert(trip.totalTripCost === 35.00, '10 gallons at $3.50 costs $35.00');
assert(trip.costPerMile > 0.11 && trip.costPerMile < 0.12, 'Cost per mile should be ~$0.117');
console.log('✓ Fuel Economy, distance, and trip cost conversion tests passed.');

console.log('All 7 conversion engine unit tests passed successfully!');
