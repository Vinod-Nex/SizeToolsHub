import React, { useState, useMemo } from 'react';
import {
  fuelEconomy,
  distance,
  calculateFuelCost,
  VEHICLE_BENCHMARKS,
  type FuelUnit,
} from '../lib/converters/fuelEconomy';
import { useShareableUrl } from '../lib/useShareableUrl';
import { showToast } from '../lib/toast';

interface Props {
  initialMode?: 'economy' | 'distance' | 'cost';
  initialValue?: number;
  initialFromUnit?: string;
  initialToUnit?: string;
  primaryKeyword?: string;
}

export default function FuelConverterIsland({
  initialMode = 'economy',
  initialValue = 30,
  initialFromUnit = 'mpg_us',
  initialToUnit = 'l_100km',
  primaryKeyword,
}: Props) {
  // Determine mode from initial props or defaults
  const normalizedInitialMode =
    initialMode ||
    (initialFromUnit.includes('km') && initialToUnit.includes('mile')
      ? 'distance'
      : initialFromUnit.includes('cost') || initialToUnit.includes('cost')
      ? 'cost'
      : 'economy');

  const [activeTab, setActiveTab] = useState<'economy' | 'cost' | 'distance'>(normalizedInitialMode);

  // ── 1. Fuel Economy State ──
  const [econVal, setEconVal] = useState<number>(initialValue || 30);
  const [econUnit, setEconUnit] = useState<FuelUnit>(
    initialFromUnit === 'l_100km' || initialFromUnit.toLowerCase().includes('l/100')
      ? 'l_100km'
      : initialFromUnit === 'mpg_uk'
      ? 'mpg_uk'
      : initialFromUnit === 'km_l'
      ? 'km_l'
      : 'mpg_us'
  );

  // ── 2. Trip Cost State ──
  const [tripDist, setTripDist] = useState<number>(250);
  const [tripDistUnit, setTripDistUnit] = useState<'miles' | 'km'>('miles');
  const [tripEff, setTripEff] = useState<number>(28);
  const [tripEffUnit, setTripEffUnit] = useState<FuelUnit>('mpg_us');
  const [fuelPrice, setFuelPrice] = useState<number>(3.65);
  const [priceUnit, setPriceUnit] = useState<'per_gallon' | 'per_liter'>('per_gallon');

  // ── 3. Distance State ──
  const [distVal, setDistVal] = useState<number>(100);
  const [distFrom, setDistFrom] = useState<'km' | 'miles'>('km');

  // ── Status feedback ──
  const [copied, setCopied] = useState<boolean>(false);
  const [savedCard, setSavedCard] = useState<boolean>(false);

  // Sync state to shareable URL query parameters
  useShareableUrl(
    {
      tab: activeTab,
      unit: activeTab === 'economy' ? econUnit : activeTab === 'cost' ? tripDistUnit : distFrom,
      val: activeTab === 'economy' ? econVal : activeTab === 'cost' ? tripDist : distVal,
      price: activeTab === 'cost' ? fuelPrice : undefined,
      eff: activeTab === 'cost' ? tripEff : undefined,
    },
    (params) => {
      const pTab = params.get('tab') as 'economy' | 'cost' | 'distance' | null;
      const pUnit = params.get('unit');
      const pVal = params.get('val');
      const pPrice = params.get('price');
      const pEff = params.get('eff');

      if (pTab && ['economy', 'cost', 'distance'].includes(pTab)) setActiveTab(pTab);
      if (pVal && !isNaN(Number(pVal))) {
        const num = Number(pVal);
        if (pTab === 'cost') setTripDist(num);
        else if (pTab === 'distance') setDistVal(num);
        else setEconVal(num);
      }
      if (pUnit) {
        if (pTab === 'economy' && ['mpg_us', 'mpg_uk', 'l_100km', 'km_l'].includes(pUnit)) {
          setEconUnit(pUnit as FuelUnit);
        } else if (pTab === 'distance' && ['km', 'miles'].includes(pUnit)) {
          setDistFrom(pUnit as any);
        } else if (pTab === 'cost' && ['miles', 'km'].includes(pUnit)) {
          setTripDistUnit(pUnit as any);
        }
      }
      if (pPrice && !isNaN(Number(pPrice))) setFuelPrice(Number(pPrice));
      if (pEff && !isNaN(Number(pEff))) setTripEff(Number(pEff));
    }
  );

  // Computations
  const economyResult = useMemo(() => fuelEconomy(econVal, econUnit), [econVal, econUnit]);
  const costResult = useMemo(
    () => calculateFuelCost(tripDist, tripDistUnit, tripEff, tripEffUnit, fuelPrice, priceUnit),
    [tripDist, tripDistUnit, tripEff, tripEffUnit, fuelPrice, priceUnit]
  );
  const distanceResult = useMemo(() => distance(distVal, distFrom), [distVal, distFrom]);

  // Handle Copy
  const handleCopy = () => {
    let text = '';
    if (activeTab === 'economy') {
      text = `${econVal} ${econUnit} = ${economyResult.l_100km} L/100km = ${economyResult.mpg_us} US MPG = ${economyResult.mpg_uk} UK MPG | SizeToolsHub`;
    } else if (activeTab === 'cost') {
      text = `Trip: ${costResult.distance} ${costResult.distanceUnit} | Total Fuel: ${costResult.totalGallonsNeeded} gal (${costResult.totalLitersNeeded} L) | Estimated Cost: $${costResult.totalTripCost} ($${costResult.costPerMile}/mi) | SizeToolsHub`;
    } else {
      text = `${distVal} ${distFrom} = ${distanceResult.miles} miles (${distanceResult.km} km) | SizeToolsHub`;
    }
    navigator.clipboard?.writeText(text);
    setCopied(true);
    showToast('Fuel economy calculation copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Save
  const handleSaveCard = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('saved_size_cards') || '[]');
      const card = {
        id: `fuel-${Date.now()}`,
        type: 'fuel',
        title: activeTab === 'cost' ? 'Trip Fuel Cost' : activeTab === 'distance' ? 'Distance Conversion' : 'Fuel Economy',
        details:
          activeTab === 'economy'
            ? `${econVal} ${econUnit} ⇄ ${economyResult.l_100km} L/100km / ${economyResult.mpg_us} MPG`
            : activeTab === 'cost'
            ? `${costResult.distance} ${costResult.distanceUnit} @ $${fuelPrice}/${priceUnit === 'per_gallon' ? 'gal' : 'L'} = $${costResult.totalTripCost}`
            : `${distVal} ${distFrom} ⇄ ${distFrom === 'km' ? distanceResult.miles + ' miles' : distanceResult.km + ' km'}`,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('saved_size_cards', JSON.stringify([card, ...existing]));
      setSavedCard(true);
      setTimeout(() => setSavedCard(false), 2500);
    } catch {
      setSavedCard(true);
      setTimeout(() => setSavedCard(false), 2500);
    }
  };

  return (
    <div className="rounded-3xl bg-canvas border border-hairline-soft p-6 sm:p-8 shadow-xs">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-hairline-soft">
        <div role="tablist" aria-label="Fuel converter modes" className="flex items-center bg-canvas-soft p-1 rounded-full border border-hairline-soft">
          <button
            type="button"
            role="tab"
            id="fuel-tab-economy"
            aria-controls="fuel-panel-economy"
            aria-selected={activeTab === 'economy'}
            tabIndex={activeTab === 'economy' ? 0 : -1}
            onClick={() => setActiveTab('economy')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === 'economy'
                ? 'bg-canvas text-ink shadow-2xs'
                : 'text-text-muted hover:text-ink'
            }`}
          >
            ⛽ Fuel Economy (MPG ⇄ L/100km)
          </button>
          <button
            type="button"
            role="tab"
            id="fuel-tab-cost"
            aria-controls="fuel-panel-cost"
            aria-selected={activeTab === 'cost'}
            tabIndex={activeTab === 'cost' ? 0 : -1}
            onClick={() => setActiveTab('cost')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === 'cost'
                ? 'bg-canvas text-ink shadow-2xs'
                : 'text-text-muted hover:text-ink'
            }`}
          >
            💵 Trip Cost Calculator
          </button>
          <button
            type="button"
            role="tab"
            id="fuel-tab-distance"
            aria-controls="fuel-panel-distance"
            aria-selected={activeTab === 'distance'}
            tabIndex={activeTab === 'distance' ? 0 : -1}
            onClick={() => setActiveTab('distance')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === 'distance'
                ? 'bg-canvas text-ink shadow-2xs'
                : 'text-text-muted hover:text-ink'
            }`}
          >
            🛣️ Distance (km ⇄ miles)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            aria-live="polite"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-canvas-soft hover:bg-canvas border border-hairline-soft text-xs font-semibold text-ink transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>{copied ? '✓ Copied!' : 'Copy Summary'}</span>
          </button>
          <button
            type="button"
            onClick={handleSaveCard}
            aria-live="polite"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 hover:bg-accent/20 text-accent text-xs font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>{savedCard ? '✓ Saved!' : '+ Save to Card'}</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: FUEL ECONOMY CONVERTER ── */}
      {activeTab === 'economy' && (
        <div role="tabpanel" id="fuel-panel-economy" aria-labelledby="fuel-tab-economy" tabIndex={0} className="mt-8 space-y-8 focus:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Input Card */}
            <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <label htmlFor="econ-input" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Enter Fuel Efficiency
              </label>
              <div className="flex gap-3">
                <input
                  id="econ-input"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={econVal}
                  onChange={(e) => setEconVal(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-4 py-3 rounded-xl bg-canvas text-ink text-2xl font-bold border border-hairline outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
                <select
                  id="econ-unit"
                  value={econUnit}
                  onChange={(e) => setEconUnit(e.target.value as FuelUnit)}
                  aria-label="Fuel efficiency unit"
                  className="px-3 py-3 rounded-xl bg-canvas text-ink font-semibold text-sm border border-hairline outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
                >
                  <option value="mpg_us">US MPG</option>
                  <option value="l_100km">L / 100km</option>
                  <option value="mpg_uk">UK MPG (Imperial)</option>
                  <option value="km_l">km / Liter</option>
                </select>
              </div>

              {/* Quick Presets */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {[
                  { val: 52, unit: 'mpg_us' as FuelUnit, label: '52 MPG (Hybrid)' },
                  { val: 30, unit: 'mpg_us' as FuelUnit, label: '30 MPG (Sedan)' },
                  { val: 20, unit: 'mpg_us' as FuelUnit, label: '20 MPG (SUV)' },
                  { val: 6.5, unit: 'l_100km' as FuelUnit, label: '6.5 L/100km' },
                  { val: 8.5, unit: 'l_100km' as FuelUnit, label: '8.5 L/100km' },
                ].map((item) => (
                  <button
                    key={`${item.val}-${item.unit}`}
                    type="button"
                    onClick={() => {
                      setEconVal(item.val);
                      setEconUnit(item.unit);
                    }}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-canvas border border-hairline text-text-muted hover:text-ink transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Conversion Hero */}
            <div className="p-6 rounded-2xl bg-canvas-soft/80 border border-hairline-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Primary Conversion
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    {economyResult.efficiency_rating}
                  </span>
                </div>

                <div className="my-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
                    {econUnit === 'l_100km' ? `${economyResult.mpg_us}` : `${economyResult.l_100km}`}
                  </span>
                  <span className="text-lg text-text-muted font-semibold ml-2">
                    {econUnit === 'l_100km' ? 'Miles Per Gallon (US MPG)' : 'Liters per 100km'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-hairline-soft text-xs text-text-muted flex items-center justify-between">
                <span>Calculation Formula:</span>
                <span className="font-mono font-medium text-ink">
                  {econUnit === 'l_100km' ? '235.215 / L/100km' : '235.215 / MPG'}
                </span>
              </div>
            </div>
          </div>

          {/* All Target Systems Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <span className="text-[11px] font-semibold text-text-muted block">US Gallon (MPG)</span>
              <span className="text-xl font-bold text-ink mt-1 block">{economyResult.mpg_us}</span>
              <span className="text-[11px] text-text-faint mt-0.5 block">Miles / US Gal (3.785 L)</span>
            </div>

            <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <span className="text-[11px] font-semibold text-text-muted block">Metric Standard</span>
              <span className="text-xl font-bold text-accent mt-1 block">{economyResult.l_100km} L</span>
              <span className="text-[11px] text-text-faint mt-0.5 block">Liters per 100 km</span>
            </div>

            <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <span className="text-[11px] font-semibold text-text-muted block">Imperial UK MPG</span>
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1 block">{economyResult.mpg_uk}</span>
              <span className="text-[11px] text-text-faint mt-0.5 block">Miles / Imperial Gal (4.546 L)</span>
            </div>

            <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <span className="text-[11px] font-semibold text-text-muted block">Kilometers / Liter</span>
              <span className="text-xl font-bold text-ink mt-1 block">{economyResult.km_l} km/L</span>
              <span className="text-[11px] text-text-faint mt-0.5 block">Distance per Liter</span>
            </div>
          </div>

          {/* Educational Note: Inverted Conversion */}
          <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline-soft flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div className="text-xs text-text-muted leading-relaxed">
              <strong className="text-ink">Why is MPG to L/100km an inverse conversion?</strong>{' '}
              Miles Per Gallon (MPG) is a <em>distance-per-volume</em> metric (higher is better). Liters per 100 km (L/100km) is a <em>consumption-over-distance</em> metric (lower is better). Cutting fuel consumption from 12 L/100km to 6 L/100km halves your fuel budget, but going from 20 MPG to 25 MPG yields much smaller savings than going from 15 MPG to 20 MPG.
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: TRIP FUEL COST CALCULATOR ── */}
      {activeTab === 'cost' && (
        <div role="tabpanel" id="fuel-panel-cost" aria-labelledby="fuel-tab-cost" tabIndex={0} className="mt-8 space-y-8 focus:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Distance Input */}
            <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <label htmlFor="trip-dist" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Trip Distance
              </label>
              <div className="flex gap-2">
                <input
                  id="trip-dist"
                  type="number"
                  min="1"
                  step="1"
                  value={tripDist}
                  onChange={(e) => setTripDist(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-canvas text-ink font-bold text-lg border border-hairline outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
                <select
                  id="trip-dist-unit"
                  value={tripDistUnit}
                  onChange={(e) => setTripDistUnit(e.target.value as 'miles' | 'km')}
                  aria-label="Trip distance unit"
                  className="px-2.5 py-2.5 rounded-xl bg-canvas text-ink font-semibold text-xs border border-hairline outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
                >
                  <option value="miles">Miles</option>
                  <option value="km">Kilometers</option>
                </select>
              </div>
            </div>

            {/* Vehicle Consumption Input */}
            <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <label htmlFor="trip-eff" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Vehicle Fuel Economy
              </label>
              <div className="flex gap-2">
                <input
                  id="trip-eff"
                  type="number"
                  min="1"
                  step="0.1"
                  value={tripEff}
                  onChange={(e) => setTripEff(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-canvas text-ink font-bold text-lg border border-hairline outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
                <select
                  id="trip-eff-unit"
                  value={tripEffUnit}
                  onChange={(e) => setTripEffUnit(e.target.value as FuelUnit)}
                  aria-label="Vehicle fuel efficiency unit"
                  className="px-2.5 py-2.5 rounded-xl bg-canvas text-ink font-semibold text-xs border border-hairline outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
                >
                  <option value="mpg_us">US MPG</option>
                  <option value="l_100km">L/100km</option>
                  <option value="mpg_uk">UK MPG</option>
                </select>
              </div>
            </div>

            {/* Fuel Price Input */}
            <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <label htmlFor="fuel-price" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Gas / Fuel Price
              </label>
              <div className="flex gap-2">
                <input
                  id="fuel-price"
                  type="number"
                  min="0.1"
                  step="0.01"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-canvas text-ink font-bold text-lg border border-hairline outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
                <select
                  id="fuel-price-unit"
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value as 'per_gallon' | 'per_liter')}
                  aria-label="Fuel price unit"
                  className="px-2.5 py-2.5 rounded-xl bg-canvas text-ink font-semibold text-xs border border-hairline outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
                >
                  <option value="per_gallon">$/Gallon</option>
                  <option value="per_liter">$/Liter</option>
                </select>
              </div>
            </div>
          </div>

          {/* Trip Cost Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-canvas border border-hairline-soft col-span-1 sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">
                Estimated Total Fuel Cost
              </span>
              <span className="text-4xl sm:text-5xl font-extrabold text-accent block">
                ${costResult.totalTripCost.toFixed(2)}
              </span>
              <span className="text-xs text-text-muted mt-2 block">
                For {costResult.distance} {costResult.distanceUnit} at {tripEff} {tripEffUnit}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">
                Fuel Needed
              </span>
              <span className="text-2xl font-bold text-ink block">
                {costResult.totalGallonsNeeded} gal
              </span>
              <span className="text-xs text-text-faint mt-1 block">
                ({costResult.totalLitersNeeded} Liters)
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">
                Cost Per Unit
              </span>
              <span className="text-2xl font-bold text-ink block">
                ${costResult.costPerMile}
              </span>
              <span className="text-xs text-text-faint mt-1 block">
                per mile (${costResult.costPerKm}/km)
              </span>
            </div>
          </div>

          {/* Environmental Carbon Metric */}
          <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <span>🌱</span>
              <span>Estimated Trip Carbon Footprint:</span>
            </span>
            <span className="font-bold text-ink">
              ~{costResult.co2KgEstimate} kg CO₂ emissions
            </span>
          </div>
        </div>
      )}

      {/* ── TAB 3: DISTANCE CONVERTER (KM ⇄ MILES) ── */}
      {activeTab === 'distance' && (
        <div role="tabpanel" id="fuel-panel-distance" aria-labelledby="fuel-tab-distance" tabIndex={0} className="mt-8 space-y-8 focus:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Input Card */}
            <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <label htmlFor="dist-input" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Enter Distance
              </label>
              <div className="flex gap-3">
                <input
                  id="dist-input"
                  type="number"
                  step="any"
                  min="0"
                  value={distVal}
                  onChange={(e) => setDistVal(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-4 py-3 rounded-xl bg-canvas text-ink text-2xl font-bold border border-hairline outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
                <select
                  id="dist-unit"
                  value={distFrom}
                  onChange={(e) => setDistFrom(e.target.value as 'km' | 'miles')}
                  aria-label="Distance unit"
                  className="px-4 py-3 rounded-xl bg-canvas text-ink font-semibold text-sm border border-hairline outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
                >
                  <option value="km">Kilometers (km)</option>
                  <option value="miles">Miles (mi)</option>
                </select>
              </div>

              {/* Quick Distance Presets */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {[
                  { val: 5, unit: 'km' as const, label: '5 km (3.1 mi - 5K Run)' },
                  { val: 10, unit: 'km' as const, label: '10 km (6.2 mi)' },
                  { val: 26.2, unit: 'miles' as const, label: '26.2 mi (Marathon)' },
                  { val: 100, unit: 'km' as const, label: '100 km (62.1 mi)' },
                  { val: 60, unit: 'miles' as const, label: '60 mph speed limit' },
                ].map((item) => (
                  <button
                    key={`${item.val}-${item.unit}`}
                    type="button"
                    onClick={() => {
                      setDistVal(item.val);
                      setDistFrom(item.unit);
                    }}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-canvas border border-hairline text-text-muted hover:text-ink transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Hero */}
            <div className="p-6 rounded-2xl bg-canvas-soft/80 border border-hairline-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
                Converted Distance
              </span>
              <div className="my-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
                  {distFrom === 'km' ? distanceResult.miles : distanceResult.km}
                </span>
                <span className="text-lg text-text-muted font-semibold ml-2">
                  {distFrom === 'km' ? 'Miles' : 'Kilometers'}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-hairline-soft text-xs text-text-muted">
                <span>Conversion Formula: </span>
                <span className="font-mono font-medium text-ink">{distanceResult.formula}</span>
              </div>
            </div>
          </div>

          {/* Distance Units Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <span className="text-[11px] font-semibold text-text-muted block">Kilometers</span>
              <span className="text-xl font-bold text-ink mt-1 block">{distanceResult.km} km</span>
              <span className="text-[11px] text-text-faint mt-0.5 block">{distanceResult.meters.toLocaleString()} meters</span>
            </div>

            <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <span className="text-[11px] font-semibold text-text-muted block">Statute Miles</span>
              <span className="text-xl font-bold text-accent mt-1 block">{distanceResult.miles} mi</span>
              <span className="text-[11px] text-text-faint mt-0.5 block">{distanceResult.feet.toLocaleString()} feet</span>
            </div>

            <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <span className="text-[11px] font-semibold text-text-muted block">Nautical Miles</span>
              <span className="text-xl font-bold text-ink mt-1 block">
                {Number((distanceResult.km / 1.852).toFixed(2))} NM
              </span>
              <span className="text-[11px] text-text-faint mt-0.5 block">1 NM = 1.852 km</span>
            </div>

            <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <span className="text-[11px] font-semibold text-text-muted block">Speed @ 1 Hour</span>
              <span className="text-xl font-bold text-ink mt-1 block">
                {distFrom === 'km' ? `${distVal} km/h` : `${distVal} mph`}
              </span>
              <span className="text-[11px] text-text-faint mt-0.5 block">
                {distFrom === 'km' ? `${distanceResult.miles} mph` : `${distanceResult.km} km/h`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
