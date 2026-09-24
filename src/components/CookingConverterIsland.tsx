import React, { useState } from 'react';
import {
  cookingUnits,
  convertButter,
  convertOvenTemperature,
  CULINARY_INGREDIENTS,
  type CookingUnit,
} from '../lib/converters/cookingUnits';
import { useShareableUrl } from '../lib/useShareableUrl';
import { showToast } from '../lib/toast';

interface Props {
  initialFromUnit?: string;
  initialToUnit?: string;
  primaryKeyword?: string;
}

export default function CookingConverterIsland({
  initialFromUnit = 'Cups',
  initialToUnit = 'Grams',
  primaryKeyword = 'Cooking Measurement Converter',
}: Props) {
  const lowerKeyword = primaryKeyword.toLowerCase();
  const lowerFrom = initialFromUnit.toLowerCase();

  const isOven = lowerKeyword.includes('oven') || lowerKeyword.includes('temperature') || lowerKeyword.includes('fahrenheit');
  const isButter = lowerKeyword.includes('butter');
  const isFlour = lowerKeyword.includes('flour');
  const isSugar = lowerKeyword.includes('sugar');

  const defaultMode = isOven ? 'oven' : isButter ? 'butter' : 'ingredient';
  const [mode, setMode] = useState<'ingredient' | 'butter' | 'oven'>(defaultMode);

  // Ingredient Mode State
  const defaultIngredient = isFlour
    ? 'flour_all_purpose'
    : isSugar
    ? 'sugar_granulated'
    : isButter
    ? 'butter'
    : lowerKeyword.includes('rice')
    ? 'rice_white'
    : 'flour_all_purpose';

  const [ingredientKey, setIngredientKey] = useState<string>(defaultIngredient);
  const [sourceUnit, setSourceUnit] = useState<CookingUnit>(
    lowerFrom.includes('gram') ? 'g' : lowerFrom.includes('tbsp') || lowerFrom.includes('tablespoon') ? 'tbsp' : lowerFrom.includes('tsp') || lowerFrom.includes('teaspoon') ? 'tsp' : lowerFrom.includes('ml') ? 'ml' : 'cups'
  );
  const [val, setVal] = useState<number>(1);

  // Butter Mode State
  const [butterVal, setButterVal] = useState<number>(1);
  const [butterUnit, setButterUnit] = useState<'sticks' | 'cups' | 'tbsp' | 'g' | 'oz'>('sticks');

  // Oven Mode State
  const [tempVal, setTempVal] = useState<number>(350);
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F');

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync state to shareable URL query parameters
  useShareableUrl(
    {
      mode,
      ingredient: mode === 'ingredient' ? ingredientKey : undefined,
      unit: mode === 'ingredient' ? sourceUnit : mode === 'butter' ? butterUnit : tempUnit,
      val: mode === 'ingredient' ? val : mode === 'butter' ? butterVal : tempVal,
    },
    (params) => {
      const pMode = params.get('mode') as 'ingredient' | 'butter' | 'oven' | null;
      const pIng = params.get('ingredient');
      const pUnit = params.get('unit');
      const pVal = params.get('val');

      if (pMode && ['ingredient', 'butter', 'oven'].includes(pMode)) setMode(pMode);
      if (pIng && CULINARY_INGREDIENTS[pIng]) setIngredientKey(pIng);
      if (pVal && !isNaN(Number(pVal))) {
        const num = Number(pVal);
        if (pMode === 'butter') setButterVal(num);
        else if (pMode === 'oven') setTempVal(num);
        else setVal(num);
      }
      if (pUnit) {
        if (pMode === 'butter' && ['sticks', 'cups', 'tbsp', 'g', 'oz'].includes(pUnit)) {
          setButterUnit(pUnit as any);
        } else if (pMode === 'oven' && ['F', 'C'].includes(pUnit)) {
          setTempUnit(pUnit as any);
        } else if (['cups', 'tbsp', 'tsp', 'g', 'oz', 'ml', 'fl_oz'].includes(pUnit)) {
          setSourceUnit(pUnit as any);
        }
      }
    }
  );

  // Calculations
  const ingredientData = CULINARY_INGREDIENTS[ingredientKey] || CULINARY_INGREDIENTS.flour_all_purpose;
  const ingredientResult = cookingUnits(val, sourceUnit, ingredientKey);
  const butterResult = convertButter(butterVal, butterUnit);
  const ovenResult = convertOvenTemperature(tempVal, tempUnit);

  const handleCopy = () => {
    let text = '';
    if (mode === 'ingredient') {
      text = `${val} ${sourceUnit} of ${ingredientData.name} = ${ingredientResult.grams}g (${ingredientResult.cups} cups, ${ingredientResult.tablespoons} tbsp, ${ingredientResult.milliliters} ml)`;
    } else if (mode === 'butter') {
      text = `${butterVal} ${butterUnit} butter = ${butterResult.grams}g (${butterResult.sticks} sticks, ${butterResult.cups} cups, ${butterResult.tablespoons} tbsp, ${butterResult.ounces} oz)`;
    } else {
      text = `${tempVal}°${tempUnit} Oven = ${ovenResult.fahrenheit}°F / ${ovenResult.celsius}°C (Fan: ${ovenResult.fan_celsius}°C, Gas Mark ${ovenResult.gas_mark} - ${ovenResult.description})`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Culinary conversion copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('my_size_card') || '[]');
      let summary = '';
      if (mode === 'ingredient') {
        summary = `${val} ${sourceUnit.toUpperCase()} ${ingredientData.name.toUpperCase()} = ${ingredientResult.grams}G (${ingredientResult.cups} CUPS)`;
      } else if (mode === 'butter') {
        summary = `BUTTER: ${butterVal} ${butterUnit.toUpperCase()} = ${butterResult.grams}G (${butterResult.sticks} STICKS)`;
      } else {
        summary = `OVEN: ${ovenResult.fahrenheit}°F = ${ovenResult.celsius}°C (GAS MARK ${ovenResult.gas_mark})`;
      }
      const updated = [
        { category: 'Culinary', summary, date: new Date().toLocaleDateString() },
        ...existing.filter((item: any) => item.summary !== summary),
      ];
      localStorage.setItem('my_size_card', JSON.stringify(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="w-full rounded-3xl bg-canvas border border-hairline-soft p-6 sm:p-8 md:p-10 shadow-xs transition-colors">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline-soft mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            <span>Ingredient-Aware Culinary Engine</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            {initialFromUnit} to {initialToUnit} Calculator
          </h2>
        </div>

        {/* Action Alerts */}
        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              ✓ Saved to Recipe Card
            </span>
          )}
          {copied && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
              ✓ Copied Summary
            </span>
          )}
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div role="tablist" aria-label="Cooking conversion categories" className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          role="tab"
          id="cook-tab-ingredient"
          aria-controls="cook-panel-ingredient"
          aria-selected={mode === 'ingredient'}
          tabIndex={mode === 'ingredient' ? 0 : -1}
          onClick={() => setMode('ingredient')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            mode === 'ingredient'
              ? 'bg-ink text-canvas shadow-xs'
              : 'bg-field text-text-muted hover:text-ink'
          }`}
        >
          Ingredient Densities (Flour, Sugar, Rice)
        </button>
        <button
          type="button"
          role="tab"
          id="cook-tab-butter"
          aria-controls="cook-panel-butter"
          aria-selected={mode === 'butter'}
          tabIndex={mode === 'butter' ? 0 : -1}
          onClick={() => setMode('butter')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            mode === 'butter'
              ? 'bg-ink text-canvas shadow-xs'
              : 'bg-field text-text-muted hover:text-ink'
          }`}
        >
          Butter Sticks & Weight
        </button>
        <button
          type="button"
          role="tab"
          id="cook-tab-oven"
          aria-controls="cook-panel-oven"
          aria-selected={mode === 'oven'}
          tabIndex={mode === 'oven' ? 0 : -1}
          onClick={() => setMode('oven')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            mode === 'oven'
              ? 'bg-ink text-canvas shadow-xs'
              : 'bg-field text-text-muted hover:text-ink'
          }`}
        >
          Oven Temperature & Gas Mark
        </button>
      </div>

      {/* ─── Mode 1: Ingredient Aware Conversions ─── */}
      {mode === 'ingredient' && (
        <div role="tabpanel" id="cook-panel-ingredient" aria-labelledby="cook-tab-ingredient" tabIndex={0} className="focus:outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="sm:col-span-1">
              <label htmlFor="cook-ingredient-select" className="block text-xs font-semibold text-text-muted mb-2">
                Select Ingredient
              </label>
              <select
                id="cook-ingredient-select"
                value={ingredientKey}
                onChange={(e) => setIngredientKey(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-field text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
              >
                <optgroup label="Flours & Powders">
                  <option value="flour_all_purpose">All-Purpose Flour (125g/cup)</option>
                  <option value="flour_bread">Bread Flour (127g/cup)</option>
                  <option value="flour_cake">Cake Flour (114g/cup)</option>
                  <option value="flour_whole_wheat">Whole Wheat Flour (130g/cup)</option>
                  <option value="cocoa_powder">Cocoa Powder (100g/cup)</option>
                </optgroup>
                <optgroup label="Sugars">
                  <option value="sugar_granulated">Granulated White Sugar (200g/cup)</option>
                  <option value="sugar_brown_packed">Brown Sugar, Packed (220g/cup)</option>
                  <option value="sugar_powdered">Powdered Sugar (120g/cup)</option>
                </optgroup>
                <optgroup label="Grains & Rice">
                  <option value="rice_white">White Rice, Uncooked (185g/cup)</option>
                  <option value="rice_brown">Brown Rice, Uncooked (190g/cup)</option>
                  <option value="oats_rolled">Rolled Oats (90g/cup)</option>
                </optgroup>
                <optgroup label="Dairy & Liquids">
                  <option value="butter">Butter, Solid/Melted (227g/cup)</option>
                  <option value="milk_whole">Whole Milk (244g/cup)</option>
                  <option value="water">Water (237g/cup)</option>
                  <option value="vegetable_oil">Vegetable Oil (215g/cup)</option>
                  <option value="honey">Honey / Maple Syrup (340g/cup)</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label htmlFor="cook-source-unit" className="block text-xs font-semibold text-text-muted mb-2">
                Input Unit
              </label>
              <select
                id="cook-source-unit"
                value={sourceUnit}
                onChange={(e) => setSourceUnit(e.target.value as CookingUnit)}
                className="w-full px-4 py-3 rounded-2xl bg-field text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
              >
                <option value="cups">US Cups</option>
                <option value="g">Grams (g)</option>
                <option value="tbsp">Tablespoons (tbsp)</option>
                <option value="tsp">Teaspoons (tsp)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="oz">Ounces Weight (oz)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="cook-quantity-input" className="text-xs font-semibold text-text-muted">Quantity</label>
                <span className="text-[11px] text-text-faint">
                  Density: {ingredientData.gPerCup}g/cup
                </span>
              </div>
              <input
                id="cook-quantity-input"
                type="number"
                step="any"
                min="0"
                value={val}
                onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
                aria-label="Ingredient quantity"
                className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink font-bold text-center text-xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
              />
            </div>
          </div>

          {/* Primary High-Contrast Conversion Display */}
          <div className="p-6 rounded-2xl bg-canvas-soft border border-hairline mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                  Calculated Target Equivalent
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                    {sourceUnit === 'g'
                      ? `${ingredientResult.cups} Cups`
                      : `${ingredientResult.grams} Grams`}
                  </span>
                  <span className="text-sm font-semibold text-accent">
                    {ingredientData.name}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-text-muted block">Volume Equivalent</span>
                <span className="text-lg font-bold text-ink">
                  {ingredientResult.tablespoons} tbsp{' '}
                  <span className="text-xs text-text-faint font-normal">
                    ({ingredientResult.milliliters} ml)
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Multi-Unit Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Weight</span>
              <p className="text-2xl font-bold text-ink mt-1">{ingredientResult.grams} g</p>
              <span className="text-[11px] text-text-faint">{ingredientResult.ounces_weight} oz</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">US Cups</span>
              <p className="text-2xl font-bold text-ink mt-1">{ingredientResult.cups}</p>
              <span className="text-[11px] text-text-faint">Standard Measuring Cup</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Tablespoons</span>
              <p className="text-2xl font-bold text-ink mt-1">{ingredientResult.tablespoons}</p>
              <span className="text-[11px] text-text-faint">{ingredientResult.teaspoons} tsp</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Liquid Metric</span>
              <p className="text-2xl font-bold text-ink mt-1">{ingredientResult.milliliters} ml</p>
              <span className="text-[11px] text-text-faint">{ingredientResult.fluid_ounces} fl oz</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mode 2: Butter Converter ─── */}
      {mode === 'butter' && (
        <div role="tabpanel" id="cook-panel-butter" aria-labelledby="cook-tab-butter" tabIndex={0} className="focus:outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="cook-butter-unit" className="block text-xs font-semibold text-text-muted mb-2">Input Unit</label>
              <select
                id="cook-butter-unit"
                value={butterUnit}
                onChange={(e) => setButterUnit(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-field text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
              >
                <option value="sticks">US Butter Sticks</option>
                <option value="cups">US Cups</option>
                <option value="tbsp">Tablespoons (tbsp)</option>
                <option value="g">Grams (g)</option>
                <option value="oz">Ounces (oz)</option>
              </select>
            </div>

            <div>
              <label htmlFor="cook-butter-qty" className="block text-xs font-semibold text-text-muted mb-2">Quantity</label>
              <input
                id="cook-butter-qty"
                type="number"
                step="any"
                min="0"
                value={butterVal}
                onChange={(e) => setButterVal(parseFloat(e.target.value) || 0)}
                aria-label="Butter quantity"
                className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink font-bold text-center text-xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-canvas-soft border border-hairline mb-6">
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
              Butter Measurement
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                {butterResult.grams} Grams
              </span>
              <span className="text-sm font-semibold text-accent">
                {butterResult.sticks} US Sticks
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Sticks</span>
              <p className="text-2xl font-bold text-ink mt-1">{butterResult.sticks}</p>
              <span className="text-[11px] text-text-faint">US Standard</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Cups</span>
              <p className="text-2xl font-bold text-ink mt-1">{butterResult.cups}</p>
              <span className="text-[11px] text-text-faint">{butterResult.tablespoons} tbsp</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Weight (g)</span>
              <p className="text-2xl font-bold text-ink mt-1">{butterResult.grams} g</p>
              <span className="text-[11px] text-text-faint">Metric</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Weight (oz)</span>
              <p className="text-2xl font-bold text-ink mt-1">{butterResult.ounces} oz</p>
              <span className="text-[11px] text-text-faint">Avoirdupois</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mode 3: Oven Temperature ─── */}
      {mode === 'oven' && (
        <div role="tabpanel" id="cook-panel-oven" aria-labelledby="cook-tab-oven" tabIndex={0} className="focus:outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-2">Input Unit</label>
              <div role="radiogroup" aria-label="Temperature scale" className="flex rounded-full bg-field p-1">
                <button
                  type="button"
                  role="radio"
                  aria-checked={tempUnit === 'F'}
                  onClick={() => setTempUnit('F')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    tempUnit === 'F' ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted hover:text-ink'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={tempUnit === 'C'}
                  onClick={() => {
                    setTempUnit('C');
                    if (tempVal > 300) setTempVal(180);
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    tempUnit === 'C' ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted hover:text-ink'
                  }`}
                >
                  Celsius (°C)
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="cook-temp-input" className="text-xs font-semibold text-text-muted">Enter Temperature</label>
                <span className="text-xs font-bold text-ink">
                  {tempVal}°{tempUnit}
                </span>
              </div>
              <input
                id="cook-temp-input"
                type="number"
                step="5"
                min="100"
                max="600"
                value={tempVal}
                onChange={(e) => setTempVal(parseFloat(e.target.value) || 0)}
                aria-label="Oven temperature"
                className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink font-bold text-center text-xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-canvas-soft border border-hairline mb-6">
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
              Oven Setting Result
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                {tempUnit === 'F' ? `${ovenResult.celsius}°C` : `${ovenResult.fahrenheit}°F`}
              </span>
              <span className="text-sm font-semibold text-accent">
                Gas Mark: {ovenResult.gas_mark} ({ovenResult.description})
              </span>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Fan-Forced (Convection) setting: <span className="font-bold text-ink">{ovenResult.fan_celsius}°C</span> (reduce standard temp by ~20°C / 25°F)
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Standard °F</span>
              <p className="text-2xl font-bold text-ink mt-1">{ovenResult.fahrenheit}°F</p>
              <span className="text-[11px] text-text-faint">Conventional</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Standard °C</span>
              <p className="text-2xl font-bold text-ink mt-1">{ovenResult.celsius}°C</p>
              <span className="text-[11px] text-text-faint">Conventional</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Fan-Forced °C</span>
              <p className="text-2xl font-bold text-ink mt-1">{ovenResult.fan_celsius}°C</p>
              <span className="text-[11px] text-text-faint">Convection Oven</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Gas Mark</span>
              <p className="text-2xl font-bold text-ink mt-1">{ovenResult.gas_mark}</p>
              <span className="text-[11px] text-text-faint">UK Gas Setting</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-hairline-soft">
        <p className="text-xs text-text-muted">
          Calibrated to standard culinary volume-to-density formulas. Fluff flour before scooping.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            aria-live="polite"
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {saved ? '✓ Saved to Recipe Card' : 'Save to Recipe Card'}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            aria-live="polite"
            className="px-5 py-2.5 rounded-full bg-canvas-soft text-ink text-xs font-semibold hover:bg-hairline transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {copied ? '✓ Copied' : 'Copy Conversion'}
          </button>
        </div>
      </div>
    </section>
  );
}
