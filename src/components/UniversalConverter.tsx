import React, { useState } from 'react';
import {
  shoeSize,
  clothingSize,
  ringSize,
  cookingUnits,
  dataStorage,
} from '../lib/converters';

type TabType =
  | 'shoes'
  | 'clothing'
  | 'rings'
  | 'dimensions'
  | 'temperature'
  | 'data'
  | 'cooking';

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
}

const TABS: TabConfig[] = [
  { id: 'shoes', label: 'Shoe Size', icon: '👟' },
  { id: 'clothing', label: 'Clothing Size', icon: '👕' },
  { id: 'rings', label: 'Ring Size', icon: '💍' },
  { id: 'dimensions', label: 'Length / Weight / Vol', icon: '📐' },
  { id: 'temperature', label: 'Temperature', icon: '🌡️' },
  { id: 'data', label: 'Data Storage', icon: '💾' },
  { id: 'cooking', label: 'Cooking & Baking', icon: '🥣' },
];

export default function UniversalConverter() {
  const [activeTab, setActiveTab] = useState<TabType>('shoes');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // ─── 1. Shoe Size State ───
  const [shoeGender, setShoeGender] = useState<'men' | 'women' | 'kids'>('men');
  const [shoeSystem, setShoeSystem] = useState<'us' | 'uk' | 'eu' | 'cm'>('us');
  const [shoeVal, setShoeVal] = useState<number>(10);

  // ─── 2. Clothing Size State ───
  const [clothGender, setClothGender] = useState<'women' | 'men'>('women');
  const [clothSystem, setClothSystem] = useState<'us' | 'uk' | 'eu' | 'intl'>('us');
  const [clothSizeIndex, setClothSizeIndex] = useState<number>(3); // US 6 / M

  // ─── 3. Ring Size State ───
  const [ringStandard, setRingStandard] = useState<'us' | 'uk' | 'eu' | 'jp' | 'mm'>('us');
  const [ringVal, setRingVal] = useState<number>(7);

  // ─── 4. Length/Weight/Vol State ───
  const [dimCategory, setDimCategory] = useState<'length' | 'weight' | 'volume'>('length');
  const [dimVal, setDimVal] = useState<number>(100);
  const [dimFrom, setDimFrom] = useState<string>('cm');
  const [dimTo, setDimTo] = useState<string>('in');

  // ─── 5. Temperature State ───
  const [tempVal, setTempVal] = useState<number>(20);
  const [tempUnit, setTempUnit] = useState<'c' | 'f' | 'k'>('c');

  // ─── 6. Data Storage State ───
  const [dataVal, setDataVal] = useState<number>(100);
  const [dataFrom, setDataFrom] = useState<string>('gb');
  const [dataTo, setDataTo] = useState<string>('tb');
  const [dataBase, setDataBase] = useState<'decimal' | 'binary'>('decimal');

  // ─── 7. Cooking State ───
  const [cookIngredient, setCookIngredient] = useState<string>('flour');
  const [cookVal, setCookVal] = useState<number>(1);
  const [cookFrom, setCookFrom] = useState<string>('cups');
  const [cookTo, setCookTo] = useState<string>('g');

  // Copy to clipboard helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save to My Size Card helper
  const handleSaveSize = (category: string, summary: string) => {
    try {
      const existing = JSON.parse(localStorage.getItem('my_size_card') || '[]');
      const updated = [{ category, summary, date: new Date().toLocaleDateString() }, ...existing.filter((item: any) => item.category !== category)];
      localStorage.setItem('my_size_card', JSON.stringify(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // ─── Helper Calculations ───

  // Shoe Data mapping
  const calculateShoes = () => {
    const srcSys = shoeSystem === 'us'
      ? (shoeGender === 'women' ? 'us_w' : shoeGender === 'kids' ? 'us_k' : 'us_m')
      : shoeSystem === 'cm'
      ? 'jp_cm'
      : shoeSystem;
    const res = shoeSize(shoeVal, srcSys as any, shoeGender);
    return {
      us: shoeGender === 'women' ? res.us_women : shoeGender === 'kids' ? res.us_kids : res.us_men,
      uk: res.uk,
      eu: res.eu,
      cm: res.jp_cm,
      inches: res.foot_length_in,
      mondo: res.mondo_mm,
    };
  };

  // Clothing Data tables
  const womenClothingTable = [
    { us: '0', uk: '4', eu: '32', intl: 'XXS', chest: '31 in (78 cm)', waist: '24 in (60 cm)', hips: '33 in (84 cm)' },
    { us: '2', uk: '6', eu: '34', intl: 'XS', chest: '32 in (82 cm)', waist: '25 in (64 cm)', hips: '35 in (88 cm)' },
    { us: '4', uk: '8', eu: '36', intl: 'S', chest: '34 in (86 cm)', waist: '27 in (68 cm)', hips: '37 in (92 cm)' },
    { us: '6', uk: '10', eu: '38', intl: 'M', chest: '36 in (90 cm)', waist: '28 in (72 cm)', hips: '38 in (96 cm)' },
    { us: '8', uk: '12', eu: '40', intl: 'M', chest: '37 in (94 cm)', waist: '30 in (76 cm)', hips: '40 in (100 cm)' },
    { us: '10', uk: '14', eu: '42', intl: 'L', chest: '39 in (98 cm)', waist: '32 in (80 cm)', hips: '42 in (104 cm)' },
    { us: '12', uk: '16', eu: '44', intl: 'L', chest: '41 in (102 cm)', waist: '34 in (84 cm)', hips: '43 in (108 cm)' },
    { us: '14', uk: '18', eu: '46', intl: 'XL', chest: '43 in (107 cm)', waist: '36 in (90 cm)', hips: '45 in (114 cm)' },
    { us: '16', uk: '20', eu: '48', intl: 'XXL', chest: '45 in (113 cm)', waist: '38 in (96 cm)', hips: '48 in (120 cm)' },
  ];

  const menClothingTable = [
    { us: '34', uk: '34', eu: '44', intl: 'XS', chest: '34 in (86 cm)', waist: '28 in (71 cm)', hips: '34 in (86 cm)' },
    { us: '36', uk: '36', eu: '46', intl: 'S', chest: '36 in (91 cm)', waist: '30 in (76 cm)', hips: '36 in (91 cm)' },
    { us: '38', uk: '38', eu: '48', intl: 'M', chest: '38 in (96 cm)', waist: '32 in (81 cm)', hips: '38 in (96 cm)' },
    { us: '40', uk: '40', eu: '50', intl: 'L', chest: '40 in (102 cm)', waist: '34 in (86 cm)', hips: '40 in (102 cm)' },
    { us: '42', uk: '42', eu: '52', intl: 'L', chest: '42 in (107 cm)', waist: '36 in (91 cm)', hips: '42 in (107 cm)' },
    { us: '44', uk: '44', eu: '54', intl: 'XL', chest: '44 in (112 cm)', waist: '38 in (97 cm)', hips: '44 in (112 cm)' },
    { us: '46', uk: '46', eu: '56', intl: 'XXL', chest: '46 in (117 cm)', waist: '40 in (102 cm)', hips: '46 in (117 cm)' },
  ];

  // Ring Data mapping
  const ringTable = [
    { us: 4, uk: 'H', eu: 47, jp: 7, mm: 14.9, circ: 46.8 },
    { us: 5, uk: 'J 1/2', eu: 49, jp: 9, mm: 15.7, circ: 49.3 },
    { us: 6, uk: 'L 1/2', eu: 52, jp: 11, mm: 16.5, circ: 51.9 },
    { us: 7, uk: 'N 1/2', eu: 54, jp: 14, mm: 17.3, circ: 54.4 },
    { us: 8, uk: 'P 1/2', eu: 57, jp: 16, mm: 18.1, circ: 57.0 },
    { us: 9, uk: 'R 1/2', eu: 60, jp: 18, mm: 19.0, circ: 59.5 },
    { us: 10, uk: 'T 1/2', eu: 62, jp: 20, mm: 19.8, circ: 62.1 },
    { us: 11, uk: 'V 1/2', eu: 65, jp: 23, mm: 20.6, circ: 64.6 },
    { us: 12, uk: 'X 1/2', eu: 67, jp: 25, mm: 21.4, circ: 67.2 },
    { us: 13, uk: 'Z 1/2', eu: 70, jp: 27, mm: 22.2, circ: 69.7 },
  ];

  // Length/Weight/Vol conversion
  const lengthFactors: Record<string, number> = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
  };

  const weightFactors: Record<string, number> = {
    mg: 0.000001,
    g: 0.001,
    kg: 1,
    oz: 0.0283495,
    lb: 0.453592,
    st: 6.35029,
  };

  const volumeFactors: Record<string, number> = {
    ml: 0.001,
    l: 1,
    floz: 0.0295735,
    cup: 0.236588,
    pt: 0.473176,
    qt: 0.946353,
    gal: 3.78541,
  };

  const calculateDimension = () => {
    let factors = lengthFactors;
    if (dimCategory === 'weight') factors = weightFactors;
    if (dimCategory === 'volume') factors = volumeFactors;

    const fromFactor = factors[dimFrom] || 1;
    const toFactor = factors[dimTo] || 1;
    const inBase = dimVal * fromFactor;
    const result = inBase / toFactor;
    return result;
  };

  // Temperature conversion
  const calculateTemperature = () => {
    let c = tempVal;
    if (tempUnit === 'f') c = ((tempVal - 32) * 5) / 9;
    if (tempUnit === 'k') c = tempVal - 273.15;

    const f = (c * 9) / 5 + 32;
    const k = c + 273.15;
    return {
      c: c.toFixed(1),
      f: f.toFixed(1),
      k: k.toFixed(1),
    };
  };

  // Data storage conversion
  const calculateData = () => {
    const base = dataBase === 'binary' ? 1024 : 1000;
    const powerMap: Record<string, number> = {
      b: -1,
      B: 0,
      kb: 1,
      mb: 2,
      gb: 3,
      tb: 4,
      pb: 5,
    };
    const pFrom = powerMap[dataFrom] ?? 3;
    const pTo = powerMap[dataTo] ?? 4;
    const bytes = dataVal * Math.pow(base, pFrom);
    const converted = bytes / Math.pow(base, pTo);
    return converted;
  };

  // Cooking ingredient conversion
  const cookingDensities: Record<string, { gPerCup: number; name: string }> = {
    flour: { gPerCup: 125, name: 'All-Purpose Flour' },
    sugar: { gPerCup: 200, name: 'Granulated Sugar' },
    brownSugar: { gPerCup: 220, name: 'Packed Brown Sugar' },
    butter: { gPerCup: 227, name: 'Butter' },
    milk: { gPerCup: 244, name: 'Whole Milk' },
    water: { gPerCup: 237, name: 'Water' },
    cocoa: { gPerCup: 100, name: 'Cocoa Powder' },
    oats: { gPerCup: 90, name: 'Rolled Oats' },
  };

  const calculateCooking = () => {
    const density = cookingDensities[cookIngredient] || cookingDensities.flour;
    let inCups = cookVal;
    if (cookFrom === 'tbsp') inCups = cookVal / 16;
    if (cookFrom === 'tsp') inCups = cookVal / 48;
    if (cookFrom === 'g') inCups = cookVal / density.gPerCup;
    if (cookFrom === 'oz') inCups = (cookVal * 28.3495) / density.gPerCup;

    const grams = inCups * density.gPerCup;
    const oz = grams / 28.3495;
    const cups = inCups;
    const tbsp = inCups * 16;
    const tsp = inCups * 48;

    let res = grams;
    if (cookTo === 'g') res = grams;
    if (cookTo === 'oz') res = oz;
    if (cookTo === 'cups') res = cups;
    if (cookTo === 'tbsp') res = tbsp;
    if (cookTo === 'tsp') res = tsp;

    return {
      result: Number(res.toFixed(2)),
      grams: Math.round(grams),
      oz: Number(oz.toFixed(2)),
      cups: Number(cups.toFixed(2)),
      tbsp: Math.round(tbsp),
      densityName: density.name,
    };
  };

  const shoeResult = calculateShoes();
  const clothingTable = clothGender === 'women' ? womenClothingTable : menClothingTable;
  const currentCloth = clothingTable[clothSizeIndex] || clothingTable[0];
  const ringResult = ringTable.find((r) => r.us === ringVal) || ringTable[3];
  const dimResult = calculateDimension();
  const tempResult = calculateTemperature();
  const dataResult = calculateData();
  const cookResult = calculateCooking();

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % TABS.length;
      setActiveTab(TABS[nextIndex].id);
      document.getElementById(`univ-tab-${TABS[nextIndex].id}`)?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + TABS.length) % TABS.length;
      setActiveTab(TABS[prevIndex].id);
      document.getElementById(`univ-tab-${TABS[prevIndex].id}`)?.focus();
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto rounded-3xl bg-canvas border border-hairline-soft p-5 sm:p-8 md:p-10 shadow-xs transition-colors">
      {/* ─── Header & Badge ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline-soft">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            <span>Universal Master Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Size & Dimension Intelligence.
          </h2>
        </div>

        {/* Global Save/Copy Status Badges */}
        <div className="flex items-center gap-2" aria-live="polite">
          {saved && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-fade-in">
              ✓ Saved to My Size Card
            </span>
          )}
          {copied && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold animate-fade-in">
              ✓ Copied to Clipboard
            </span>
          )}
        </div>
      </div>

      {/* ─── Segmented Tabs (DESIGN.md segmented-control spec) ─── */}
      <div className="pt-6 pb-8">
        <div
          role="tablist"
          aria-label="Universal Converter Categories"
          className="bg-canvas-soft p-1.5 rounded-full flex flex-wrap gap-1 border border-hairline-soft overflow-x-auto"
        >
          {TABS.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`univ-tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`univ-panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? 'bg-canvas text-ink shadow-xs'
                    : 'text-text-muted hover:text-ink hover:bg-canvas/50'
                }`}
              >
                <span aria-hidden="true">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Tab Content Panels ─── */}
      <div className="space-y-6">
        {/* ─── TAB 1: SHOE SIZE ─── */}
        {activeTab === 'shoes' && (
          <div
            role="tabpanel"
            id="univ-panel-shoes"
            aria-labelledby="univ-tab-shoes"
            tabIndex={0}
            className="space-y-6 animate-fade-in focus:outline-none"
          >
            {/* Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-2">Category</label>
                <div role="radiogroup" aria-label="Footwear Category" className="flex rounded-full bg-field p-1">
                  {(['men', 'women', 'kids'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      role="radio"
                      aria-checked={shoeGender === g}
                      onClick={() => setShoeGender(g)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-full capitalize transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        shoeGender === g ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="univ-shoe-system" className="block text-xs font-semibold text-text-muted mb-2">Input Standard</label>
                <select
                  id="univ-shoe-system"
                  value={shoeSystem}
                  onChange={(e) => setShoeSystem(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <option value="us">United States (US)</option>
                  <option value="uk">United Kingdom (UK)</option>
                  <option value="eu">European Union (EU)</option>
                  <option value="cm">Japan / Mondopoint (cm)</option>
                </select>
              </div>

              <div>
                <label htmlFor="univ-shoe-val" className="block text-xs font-semibold text-text-muted mb-2">
                  Select {shoeSystem.toUpperCase()} Size
                </label>
                <input
                  id="univ-shoe-val"
                  type="number"
                  step="0.5"
                  min="1"
                  max="16"
                  value={shoeVal}
                  onChange={(e) => setShoeVal(parseFloat(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink text-sm font-bold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft text-center">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">US Size</span>
                <p className="text-2xl font-bold text-ink mt-1">{shoeResult.us}</p>
                <span className="text-[11px] text-text-faint">{shoeGender}</span>
              </div>
              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft text-center">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">UK Size</span>
                <p className="text-2xl font-bold text-ink mt-1">{shoeResult.uk}</p>
                <span className="text-[11px] text-text-faint">Standard</span>
              </div>
              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft text-center">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">EU Size</span>
                <p className="text-2xl font-bold text-ink mt-1">{shoeResult.eu}</p>
                <span className="text-[11px] text-text-faint">Paris Points</span>
              </div>
              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft text-center">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Japan (cm)</span>
                <p className="text-2xl font-bold text-ink mt-1">{shoeResult.cm} <span className="text-xs font-normal">cm</span></p>
                <span className="text-[11px] text-text-faint">{shoeResult.inches} in</span>
              </div>
              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft text-center">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Mondopoint</span>
                <p className="text-2xl font-bold text-ink mt-1">{shoeResult.mondo}</p>
                <span className="text-[11px] text-text-faint">ISO 9407 mm</span>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-hairline-soft">
              <span className="text-xs text-text-muted">
                Conversion verified against ISO 9407 and international footwear guidelines.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSaveSize(
                      'Shoe Size',
                      `${shoeGender.toUpperCase()} US ${shoeResult.us} / EU ${shoeResult.eu} (${shoeResult.cm} cm)`
                    )
                  }
                  className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
                >
                  Save to Size Card
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(`US ${shoeResult.us} = UK ${shoeResult.uk} = EU ${shoeResult.eu} = ${shoeResult.cm} cm`)
                  }
                  className="px-4 py-2 rounded-full bg-canvas-soft text-ink text-xs font-semibold hover:bg-hairline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
                >
                  Copy Summary
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: CLOTHING SIZE ─── */}
        {activeTab === 'clothing' && (
          <div
            role="tabpanel"
            id="univ-panel-clothing"
            aria-labelledby="univ-tab-clothing"
            tabIndex={0}
            className="space-y-6 animate-fade-in focus:outline-none"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div role="radiogroup" aria-label="Clothing Department" className="flex rounded-full bg-field p-1 max-w-xs">
                <button
                  type="button"
                  role="radio"
                  aria-checked={clothGender === 'women'}
                  onClick={() => setClothGender('women')}
                  className={`flex-1 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    clothGender === 'women' ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted'
                  }`}
                >
                  Women's Sizing
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={clothGender === 'men'}
                  onClick={() => setClothGender('men')}
                  className={`flex-1 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    clothGender === 'men' ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted'
                  }`}
                >
                  Men's Sizing
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="univ-cloth-size" className="text-xs font-semibold text-text-muted">Select Size Step:</label>
                <select
                  id="univ-cloth-size"
                  value={clothSizeIndex}
                  onChange={(e) => setClothSizeIndex(parseInt(e.target.value) || 0)}
                  className="px-4 py-2 rounded-2xl bg-field text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {clothingTable.map((item, idx) => (
                    <option key={idx} value={idx}>
                      US {item.us} — {item.intl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Standard Conversion Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft text-center">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">US Size</span>
                <p className="text-2xl font-bold text-ink mt-1">{currentCloth.us}</p>
                <span className="text-xs text-text-faint">{clothGender === 'women' ? 'Dress/Top' : 'Suit/Chest'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft text-center">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">UK Size</span>
                <p className="text-2xl font-bold text-ink mt-1">{currentCloth.uk}</p>
                <span className="text-xs text-text-faint">Standard UK/AU</span>
              </div>
              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft text-center">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">EU Size</span>
                <p className="text-2xl font-bold text-ink mt-1">{currentCloth.eu}</p>
                <span className="text-xs text-text-faint">Continental</span>
              </div>
              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft text-center">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">International</span>
                <p className="text-2xl font-bold text-accent mt-1">{currentCloth.intl}</p>
                <span className="text-xs text-text-faint">Global Standard</span>
              </div>
            </div>

            {/* Body Measurement Guide */}
            <div className="p-5 rounded-2xl bg-field border border-hairline-soft">
              <span className="text-xs uppercase tracking-wider text-text-muted font-semibold block mb-3">
                Estimated Body Measurements for this Size
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-xs text-text-muted block">Chest / Bust:</span>
                  <span className="font-semibold text-ink">{currentCloth.chest}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Natural Waist:</span>
                  <span className="font-semibold text-ink">{currentCloth.waist}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Hips:</span>
                  <span className="font-semibold text-ink">{currentCloth.hips}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-hairline-soft">
              <span className="text-xs text-text-muted">
                Measurements represent standard body fit dimensions before garment ease.
              </span>
              <button
                type="button"
                onClick={() =>
                  handleSaveSize(
                    'Clothing Size',
                    `${clothGender.toUpperCase()}: US ${currentCloth.us} / UK ${currentCloth.uk} / EU ${currentCloth.eu} (${currentCloth.intl})`
                  )
                }
                className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
              >
                Save to Size Card
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 3: RING SIZE ─── */}
        {activeTab === 'rings' && (
          <div
            role="tabpanel"
            id="univ-panel-rings"
            aria-labelledby="univ-tab-rings"
            tabIndex={0}
            className="space-y-6 animate-fade-in focus:outline-none"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="univ-ring-size" className="block text-xs font-semibold text-text-muted mb-2">Select US Ring Size</label>
                <select
                  id="univ-ring-size"
                  value={ringVal}
                  onChange={(e) => setRingVal(parseInt(e.target.value) || 7)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink text-sm font-bold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {ringTable.map((r) => (
                    <option key={r.us} value={r.us}>
                      US Size {r.us} ({r.mm} mm diameter)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-xs font-semibold text-text-muted mb-2">Direct Measurements</span>
                <div className="p-2.5 rounded-2xl bg-field flex items-center justify-around text-xs font-semibold text-ink">
                  <span>Inside Diameter: <strong>{ringResult.mm} mm</strong></span>
                  <span>•</span>
                  <span>Circumference: <strong>{ringResult.circ} mm</strong></span>
                </div>
              </div>
            </div>

            {/* Ring Scale & Visual Indicator */}
            <div className="p-6 rounded-2xl bg-canvas-soft border border-hairline-soft flex flex-col sm:flex-row items-center justify-around gap-6">
              {/* Scaled Ring SVG */}
              <div className="flex flex-col items-center">
                <div
                  className="rounded-full border-4 border-ink flex items-center justify-center transition-all duration-300"
                  style={{
                    width: `${Math.round(ringResult.mm * 3.8)}px`,
                    height: `${Math.round(ringResult.mm * 3.8)}px`,
                  }}
                >
                  <span className="text-[11px] font-bold text-text-muted">
                    {ringResult.mm} mm
                  </span>
                </div>
                <span className="text-[11px] text-text-faint mt-2 font-medium">Scaled Circle Guide</span>
              </div>

              {/* International Standards Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
                <div className="p-3 rounded-2xl bg-canvas border border-hairline-soft text-center">
                  <span className="text-[10px] uppercase text-text-muted font-semibold">US / Canada</span>
                  <p className="text-xl font-bold text-ink mt-0.5">{ringResult.us}</p>
                </div>
                <div className="p-3 rounded-2xl bg-canvas border border-hairline-soft text-center">
                  <span className="text-[10px] uppercase text-text-muted font-semibold">UK / Australia</span>
                  <p className="text-xl font-bold text-ink mt-0.5">{ringResult.uk}</p>
                </div>
                <div className="p-3 rounded-2xl bg-canvas border border-hairline-soft text-center">
                  <span className="text-[10px] uppercase text-text-muted font-semibold">Europe (ISO)</span>
                  <p className="text-xl font-bold text-ink mt-0.5">{ringResult.eu}</p>
                </div>
                <div className="p-3 rounded-2xl bg-canvas border border-hairline-soft text-center">
                  <span className="text-[10px] uppercase text-text-muted font-semibold">Japan / China</span>
                  <p className="text-xl font-bold text-ink mt-0.5">{ringResult.jp}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-hairline-soft">
              <span className="text-xs text-text-muted">
                Tip: If your knuckle is significantly larger than your finger base, measure both and choose the average.
              </span>
              <button
                type="button"
                onClick={() =>
                  handleSaveSize('Ring Size', `US ${ringResult.us} (UK ${ringResult.uk} / EU ${ringResult.eu})`)
                }
                className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
              >
                Save to Size Card
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 4: LENGTH / WEIGHT / VOLUME ─── */}
        {activeTab === 'dimensions' && (
          <div
            role="tabpanel"
            id="univ-panel-dimensions"
            aria-labelledby="univ-tab-dimensions"
            tabIndex={0}
            className="space-y-6 animate-fade-in focus:outline-none"
          >
            {/* Category Selector */}
            <div role="radiogroup" aria-label="Dimension Unit Type" className="flex rounded-full bg-field p-1 max-w-sm">
              {(['length', 'weight', 'volume'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="radio"
                  aria-checked={dimCategory === cat}
                  onClick={() => {
                    setDimCategory(cat);
                    if (cat === 'length') {
                      setDimFrom('cm');
                      setDimTo('in');
                    } else if (cat === 'weight') {
                      setDimFrom('kg');
                      setDimTo('lb');
                    } else {
                      setDimFrom('l');
                      setDimTo('gal');
                    }
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-full capitalize transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    dimCategory === cat ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Conversion Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="p-5 rounded-2xl bg-field space-y-3">
                <label htmlFor="univ-dim-val" className="text-xs font-semibold text-text-muted block uppercase tracking-wider">From Value</label>
                <div className="flex gap-2">
                  <input
                    id="univ-dim-val"
                    type="number"
                    value={dimVal}
                    onChange={(e) => setDimVal(parseFloat(e.target.value) || 0)}
                    aria-label="Input dimension value"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-canvas text-ink font-bold text-lg outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  />
                  <select
                    id="univ-dim-from"
                    value={dimFrom}
                    onChange={(e) => setDimFrom(e.target.value)}
                    aria-label="Source dimension unit"
                    className="px-3 py-2.5 rounded-xl bg-canvas text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {dimCategory === 'length' && (
                      <>
                        <option value="mm">Millimeters (mm)</option>
                        <option value="cm">Centimeters (cm)</option>
                        <option value="m">Meters (m)</option>
                        <option value="km">Kilometers (km)</option>
                        <option value="in">Inches (in)</option>
                        <option value="ft">Feet (ft)</option>
                        <option value="yd">Yards (yd)</option>
                        <option value="mi">Miles (mi)</option>
                      </>
                    )}
                    {dimCategory === 'weight' && (
                      <>
                        <option value="g">Grams (g)</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="oz">Ounces (oz)</option>
                        <option value="lb">Pounds (lb)</option>
                        <option value="st">Stones (st)</option>
                      </>
                    )}
                    {dimCategory === 'volume' && (
                      <>
                        <option value="ml">Milliliters (ml)</option>
                        <option value="l">Liters (L)</option>
                        <option value="floz">Fluid Ounces (fl oz)</option>
                        <option value="cup">Cups (US)</option>
                        <option value="pt">Pints (pt)</option>
                        <option value="qt">Quarts (qt)</option>
                        <option value="gal">Gallons (US)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline-soft space-y-3">
                <label htmlFor="univ-dim-to" className="text-xs font-semibold text-text-muted block uppercase tracking-wider">To (Result)</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-2.5 rounded-xl bg-canvas text-ink font-bold text-lg border border-hairline-soft flex items-center">
                    {dimResult.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                  </div>
                  <select
                    id="univ-dim-to"
                    value={dimTo}
                    onChange={(e) => setDimTo(e.target.value)}
                    aria-label="Target dimension unit"
                    className="px-3 py-2.5 rounded-xl bg-canvas text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {dimCategory === 'length' && (
                      <>
                        <option value="in">Inches (in)</option>
                        <option value="ft">Feet (ft)</option>
                        <option value="yd">Yards (yd)</option>
                        <option value="mi">Miles (mi)</option>
                        <option value="mm">Millimeters (mm)</option>
                        <option value="cm">Centimeters (cm)</option>
                        <option value="m">Meters (m)</option>
                        <option value="km">Kilometers (km)</option>
                      </>
                    )}
                    {dimCategory === 'weight' && (
                      <>
                        <option value="lb">Pounds (lb)</option>
                        <option value="oz">Ounces (oz)</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="st">Stones (st)</option>
                      </>
                    )}
                    {dimCategory === 'volume' && (
                      <>
                        <option value="gal">Gallons (US)</option>
                        <option value="l">Liters (L)</option>
                        <option value="floz">Fluid Ounces (fl oz)</option>
                        <option value="cup">Cups (US)</option>
                        <option value="ml">Milliliters (ml)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-hairline-soft">
              <button
                type="button"
                onClick={() =>
                  handleCopy(`${dimVal} ${dimFrom} = ${dimResult.toFixed(4)} ${dimTo}`)
                }
                className="px-4 py-2 rounded-full bg-canvas-soft text-ink text-xs font-semibold hover:bg-hairline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
              >
                Copy Value
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 5: TEMPERATURE ─── */}
        {activeTab === 'temperature' && (
          <div
            role="tabpanel"
            id="univ-panel-temperature"
            aria-labelledby="univ-tab-temperature"
            tabIndex={0}
            className="space-y-6 animate-fade-in focus:outline-none"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label htmlFor="univ-temp-val" className="block text-xs font-semibold text-text-muted mb-2">
                  Enter Temperature Value
                </label>
                <input
                  id="univ-temp-val"
                  type="number"
                  value={tempVal}
                  onChange={(e) => setTempVal(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-2xl bg-field text-ink text-xl font-bold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-2">Source Scale</label>
                <div role="radiogroup" aria-label="Temperature Source Scale" className="flex rounded-full bg-field p-1">
                  {(['c', 'f', 'k'] as const).map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      role="radio"
                      aria-checked={tempUnit === unit}
                      onClick={() => setTempUnit(unit)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-full uppercase transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        tempUnit === unit ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted'
                      }`}
                    >
                      {unit === 'c' ? 'Celsius (°C)' : unit === 'f' ? 'Fahrenheit (°F)' : 'Kelvin (K)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Three-way Temperature Output */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline-soft text-center">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Celsius</span>
                <p className="text-3xl font-bold text-ink mt-2">{tempResult.c}°C</p>
                <span className="text-xs text-text-faint">Water freezes at 0°C</span>
              </div>
              <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline-soft text-center">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Fahrenheit</span>
                <p className="text-3xl font-bold text-ink mt-2">{tempResult.f}°F</p>
                <span className="text-xs text-text-faint">Water freezes at 32°F</span>
              </div>
              <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline-soft text-center">
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Kelvin</span>
                <p className="text-3xl font-bold text-ink mt-2">{tempResult.k} K</p>
                <span className="text-xs text-text-faint">Absolute Zero at 0 K</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-hairline-soft">
              <button
                type="button"
                onClick={() =>
                  handleCopy(`${tempVal}°${tempUnit.toUpperCase()} = ${tempResult.c}°C / ${tempResult.f}°F / ${tempResult.k} K`)
                }
                className="px-4 py-2 rounded-full bg-canvas-soft text-ink text-xs font-semibold hover:bg-hairline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
              >
                Copy Temperature Breakdown
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 6: DATA STORAGE ─── */}
        {activeTab === 'data' && (
          <div
            role="tabpanel"
            id="univ-panel-data"
            aria-labelledby="univ-tab-data"
            tabIndex={0}
            className="space-y-6 animate-fade-in focus:outline-none"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div role="radiogroup" aria-label="Data Storage Base System" className="flex rounded-full bg-field p-1 max-w-xs">
                <button
                  type="button"
                  role="radio"
                  aria-checked={dataBase === 'decimal'}
                  onClick={() => setDataBase('decimal')}
                  className={`flex-1 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    dataBase === 'decimal' ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted'
                  }`}
                >
                  Decimal (1,000 Base)
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={dataBase === 'binary'}
                  onClick={() => setDataBase('binary')}
                  className={`flex-1 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    dataBase === 'binary' ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted'
                  }`}
                >
                  Binary (1,024 Base)
                </button>
              </div>

              <span className="text-xs text-text-muted">
                {dataBase === 'decimal' ? 'Standard for Storage Disks & Network Bandwidth' : 'Standard for Operating Systems & RAM'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="p-4 rounded-2xl bg-field space-y-2">
                <label htmlFor="univ-data-val" className="text-xs font-semibold text-text-muted block">Source Value</label>
                <div className="flex gap-2">
                  <input
                    id="univ-data-val"
                    type="number"
                    value={dataVal}
                    onChange={(e) => setDataVal(parseFloat(e.target.value) || 0)}
                    aria-label="Input data storage size"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-canvas text-ink font-bold text-lg outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  />
                  <select
                    id="univ-data-from"
                    value={dataFrom}
                    onChange={(e) => setDataFrom(e.target.value)}
                    aria-label="Source data unit"
                    className="px-3 py-2.5 rounded-xl bg-canvas text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <option value="B">Bytes (B)</option>
                    <option value="kb">Kilobytes (KB)</option>
                    <option value="mb">Megabytes (MB)</option>
                    <option value="gb">Gigabytes (GB)</option>
                    <option value="tb">Terabytes (TB)</option>
                    <option value="pb">Petabytes (PB)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft space-y-2">
                <label htmlFor="univ-data-to" className="text-xs font-semibold text-text-muted block">Target Unit (Result)</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-2.5 rounded-xl bg-canvas text-ink font-bold text-lg border border-hairline-soft flex items-center">
                    {dataResult.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </div>
                  <select
                    id="univ-data-to"
                    value={dataTo}
                    onChange={(e) => setDataTo(e.target.value)}
                    aria-label="Target data unit"
                    className="px-3 py-2.5 rounded-xl bg-canvas text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <option value="tb">Terabytes (TB)</option>
                    <option value="gb">Gigabytes (GB)</option>
                    <option value="mb">Megabytes (MB)</option>
                    <option value="kb">Kilobytes (KB)</option>
                    <option value="B">Bytes (B)</option>
                    <option value="pb">Petabytes (PB)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-hairline-soft">
              <button
                type="button"
                onClick={() =>
                  handleCopy(`${dataVal} ${dataFrom.toUpperCase()} = ${dataResult} ${dataTo.toUpperCase()}`)
                }
                className="px-4 py-2 rounded-full bg-canvas-soft text-ink text-xs font-semibold hover:bg-hairline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
              >
                Copy Data Conversion
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 7: COOKING & BAKING ─── */}
        {activeTab === 'cooking' && (
          <div
            role="tabpanel"
            id="univ-panel-cooking"
            aria-labelledby="univ-tab-cooking"
            tabIndex={0}
            className="space-y-6 animate-fade-in focus:outline-none"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="univ-cook-ingredient" className="block text-xs font-semibold text-text-muted mb-2">Select Ingredient</label>
                <select
                  id="univ-cook-ingredient"
                  value={cookIngredient}
                  onChange={(e) => setCookIngredient(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <option value="flour">All-Purpose Flour (125g / cup)</option>
                  <option value="sugar">Granulated Sugar (200g / cup)</option>
                  <option value="brownSugar">Packed Brown Sugar (220g / cup)</option>
                  <option value="butter">Butter (227g / cup)</option>
                  <option value="milk">Whole Milk (244g / cup)</option>
                  <option value="water">Water (237g / cup)</option>
                  <option value="cocoa">Cocoa Powder (100g / cup)</option>
                  <option value="oats">Rolled Oats (90g / cup)</option>
                </select>
              </div>

              <div>
                <label htmlFor="univ-cook-amount" className="block text-xs font-semibold text-text-muted mb-2">Amount</label>
                <input
                  id="univ-cook-amount"
                  type="number"
                  step="0.25"
                  value={cookVal}
                  onChange={(e) => setCookVal(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink text-sm font-bold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="univ-cook-unit" className="block text-xs font-semibold text-text-muted mb-2">Input Unit</label>
                <select
                  id="univ-cook-unit"
                  value={cookFrom}
                  onChange={(e) => setCookFrom(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <option value="cups">Cups (US)</option>
                  <option value="tbsp">Tablespoons (tbsp)</option>
                  <option value="tsp">Teaspoons (tsp)</option>
                  <option value="g">Grams (g)</option>
                  <option value="oz">Ounces (oz)</option>
                </select>
              </div>
            </div>

            {/* Baking Equivalents Matrix */}
            <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline-soft">
              <span className="text-xs uppercase tracking-wider text-text-muted font-semibold block mb-3">
                Calculated Equivalents for {cookResult.densityName}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-canvas">
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Exact Mass</span>
                  <p className="text-xl font-bold text-ink mt-0.5">{cookResult.grams} g</p>
                </div>
                <div className="p-3 rounded-2xl bg-canvas">
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Ounces</span>
                  <p className="text-xl font-bold text-ink mt-0.5">{cookResult.oz} oz</p>
                </div>
                <div className="p-3 rounded-2xl bg-canvas">
                  <span className="text-[10px] text-text-muted font-semibold uppercase">US Cups</span>
                  <p className="text-xl font-bold text-ink mt-0.5">{cookResult.cups} cups</p>
                </div>
                <div className="p-3 rounded-2xl bg-canvas">
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Tablespoons</span>
                  <p className="text-xl font-bold text-ink mt-0.5">{cookResult.tbsp} tbsp</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-hairline-soft">
              <button
                type="button"
                onClick={() =>
                  handleCopy(`${cookVal} ${cookFrom} of ${cookResult.densityName} = ${cookResult.grams}g (${cookResult.oz} oz)`)
                }
                className="px-4 py-2 rounded-full bg-canvas-soft text-ink text-xs font-semibold hover:bg-hairline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
              >
                Copy Recipe Measurement
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
