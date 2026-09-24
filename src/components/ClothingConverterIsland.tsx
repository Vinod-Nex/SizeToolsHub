import React, { useState } from 'react';
import {
  clothingSize,
  convertJeansSize,
  convertBraSize,
  convertShirtSize,
  type ClothingCategory,
  type ClothingSystem,
} from '../lib/converters/clothingSize';
import { useShareableUrl } from '../lib/useShareableUrl';
import { showToast } from '../lib/toast';

interface Props {
  initialFromUnit?: string;
  initialToUnit?: string;
  primaryKeyword?: string;
  defaultCategory?: ClothingCategory;
}

export default function ClothingConverterIsland({
  initialFromUnit = 'US Women',
  initialToUnit = 'EU Women',
  primaryKeyword = 'Clothing Size Converter',
  defaultCategory = 'women',
}: Props) {
  // Detect if the tool is specifically jeans, bra, shirt, or mens/womens
  const lowerKeyword = primaryKeyword.toLowerCase();
  const lowerFrom = initialFromUnit.toLowerCase();

  const isJeansMode = lowerKeyword.includes('jeans');
  const isBraMode = lowerKeyword.includes('bra');
  const isShirtMode = lowerKeyword.includes('shirt');
  const initialGender: ClothingCategory =
    lowerKeyword.includes('men') && !lowerKeyword.includes('women') ? 'men' : defaultCategory;

  const [mode, setMode] = useState<'standard' | 'jeans' | 'bra' | 'shirt'>(
    isJeansMode ? 'jeans' : isBraMode ? 'bra' : isShirtMode ? 'shirt' : 'standard'
  );

  const [category, setCategory] = useState<ClothingCategory>(initialGender);
  const [sourceSystem, setSourceSystem] = useState<ClothingSystem>(
    lowerFrom.includes('brasil') || lowerFrom.includes('br')
      ? 'br'
      : lowerFrom.includes('uk')
      ? 'uk'
      : lowerFrom.includes('eu')
      ? 'eu'
      : lowerFrom.includes('intl')
      ? 'intl'
      : 'us'
  );

  // Standard clothing state
  const [standardVal, setStandardVal] = useState<string>(category === 'women' ? '8' : '40');

  // Jeans state (waist in inches)
  const [waistInches, setWaistInches] = useState<number>(category === 'women' ? 28 : 32);

  // Bra state (inches)
  const [underbust, setUnderbust] = useState<number>(30);
  const [bust, setBust] = useState<number>(34);

  // Shirt state (neck in inches)
  const [neckInches, setNeckInches] = useState<number>(15.5);

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync state to shareable URL query parameters
  useShareableUrl(
    {
      mode,
      category,
      system: sourceSystem,
      val: mode === 'standard' ? standardVal : mode === 'jeans' ? waistInches : mode === 'bra' ? `${underbust}-${bust}` : neckInches,
    },
    (params) => {
      const pMode = params.get('mode') as 'standard' | 'jeans' | 'bra' | 'shirt' | null;
      const pCat = params.get('category') as ClothingCategory | null;
      const pSys = params.get('system') as ClothingSystem | null;
      const pVal = params.get('val');

      if (pMode && ['standard', 'jeans', 'bra', 'shirt'].includes(pMode)) setMode(pMode);
      if (pCat && ['women', 'men', 'kids'].includes(pCat)) setCategory(pCat);
      if (pSys && ['us', 'uk', 'eu', 'intl', 'br'].includes(pSys)) setSourceSystem(pSys);
      if (pVal) {
        if (pMode === 'jeans' && !isNaN(Number(pVal))) setWaistInches(Number(pVal));
        else if (pMode === 'shirt' && !isNaN(Number(pVal))) setNeckInches(Number(pVal));
        else if (pMode === 'bra' && pVal.includes('-')) {
          const [u, b] = pVal.split('-').map(Number);
          if (!isNaN(u) && !isNaN(b)) {
            setUnderbust(u);
            setBust(b);
          }
        } else {
          setStandardVal(pVal);
        }
      }
    }
  );

  // Calculate live results
  const standardResult = clothingSize(standardVal, sourceSystem, category);
  const jeansResult = convertJeansSize(waistInches, category);
  const braResult = convertBraSize(underbust, bust);
  const shirtResult = convertShirtSize(neckInches);

  const handleCopy = () => {
    let text = '';
    if (mode === 'standard') {
      text = `${primaryKeyword}: BR ${standardResult.br} = US ${standardResult.us} = UK ${standardResult.uk} = EU ${standardResult.eu} = Intl ${standardResult.intl} (Busto/Tórax: ${standardResult.measurements.chest_in}″ / ${standardResult.measurements.chest_cm} cm, Cintura: ${standardResult.measurements.waist_in}″ / ${standardResult.measurements.waist_cm} cm, Quadril: ${standardResult.measurements.hips_in}″ / ${standardResult.measurements.hips_cm} cm)`;
    } else if (mode === 'jeans') {
      text = `${primaryKeyword}: Cintura ${jeansResult.waist_in}″ (${jeansResult.waist_cm} cm) = BR ${jeansResult.br_size} = US W${jeansResult.waist_in} (Alpha ${jeansResult.us_alpha}) = EU ${jeansResult.eu_size} = UK ${jeansResult.uk_size}`;
    } else if (mode === 'bra') {
      text = `${primaryKeyword}: Underbust ${underbust}″, Bust ${bust}″ = US ${braResult.us} / UK ${braResult.uk} / EU ${braResult.eu}`;
    } else {
      text = `${primaryKeyword}: Collar ${neckInches}″ (${shirtResult.eu_collar_cm} cm) = Alpha ${shirtResult.alpha_size} (Chest: ${shirtResult.chest_range_in}″)`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Apparel conversion copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSize = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('my_size_card') || '[]');
      let summary = '';
      if (mode === 'standard') {
        summary = `${category.toUpperCase()} APPAREL: US ${standardResult.us} / UK ${standardResult.uk} / EU ${standardResult.eu} (${standardResult.intl})`;
      } else if (mode === 'jeans') {
        summary = `JEANS: W${jeansResult.waist_in}″ (EU ${jeansResult.eu_size}, US ${jeansResult.us_alpha})`;
      } else if (mode === 'bra') {
        summary = `BRA: US ${braResult.us} / UK ${braResult.uk} (EU ${braResult.eu})`;
      } else {
        summary = `SHIRT: ${neckInches}″ Collar (EU ${shirtResult.eu_collar_cm} cm, ${shirtResult.alpha_size})`;
      }
      const updated = [
        { category: 'Apparel', summary, date: new Date().toLocaleDateString() },
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
            <span>Live Interactive Island</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            {initialFromUnit} to {initialToUnit} Calculator
          </h2>
        </div>

        {/* Global Action Notifications */}
        <div className="flex items-center gap-2" aria-live="polite">
          {saved && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              ✓ Saved to Size Card
            </span>
          )}
          {copied && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
              ✓ Copied Summary
            </span>
          )}
        </div>
      </div>

      {/* Mode / Garment Sub-Selector */}
      <div role="tablist" aria-label="Garment Type" className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'standard'}
          onClick={() => setMode('standard')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            mode === 'standard'
              ? 'bg-ink text-canvas shadow-xs'
              : 'bg-field text-text-muted hover:text-ink'
          }`}
        >
          Standard Clothing
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'jeans'}
          onClick={() => setMode('jeans')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            mode === 'jeans'
              ? 'bg-ink text-canvas shadow-xs'
              : 'bg-field text-text-muted hover:text-ink'
          }`}
        >
          Jeans & Denim (Waist)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'bra'}
          onClick={() => setMode('bra')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            mode === 'bra'
              ? 'bg-ink text-canvas shadow-xs'
              : 'bg-field text-text-muted hover:text-ink'
          }`}
        >
          Bra Sizing
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'shirt'}
          onClick={() => setMode('shirt')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            mode === 'shirt'
              ? 'bg-ink text-canvas shadow-xs'
              : 'bg-field text-text-muted hover:text-ink'
          }`}
        >
          Dress Shirts (Collar)
        </button>
      </div>

      {/* Gender Toggle (for Standard and Jeans) */}
      {(mode === 'standard' || mode === 'jeans') && (
        <div className="mb-6">
          <label className="block text-xs font-semibold text-text-muted mb-2">
            Gender Department
          </label>
          <div role="radiogroup" aria-label="Gender Department" className="flex rounded-full bg-field p-1 max-w-xs">
            <button
              type="button"
              role="radio"
              aria-checked={category === 'women'}
              onClick={() => {
                setCategory('women');
                setStandardVal('8');
                setWaistInches(28);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-full capitalize transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                category === 'women' ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted hover:text-ink'
              }`}
            >
              Women's
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={category === 'men'}
              onClick={() => {
                setCategory('men');
                setStandardVal('40');
                setWaistInches(32);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-full capitalize transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                category === 'men' ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted hover:text-ink'
              }`}
            >
              Men's
            </button>
          </div>
        </div>
      )}

      {/* ─── Mode 1: Standard Clothing ─── */}
      {mode === 'standard' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <label htmlFor="clothing-origin-sys" className="block text-xs font-semibold text-text-muted mb-2">
                Origin System
              </label>
              <select
                id="clothing-origin-sys"
                value={sourceSystem}
                onChange={(e) => setSourceSystem(e.target.value as ClothingSystem)}
                className="w-full px-4 py-3 rounded-2xl bg-field text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
              >
                <option value="us">United States (US Sizing)</option>
                <option value="uk">United Kingdom (UK Sizing)</option>
                <option value="eu">European Union (EU Sizing)</option>
                <option value="br">Brasil (Tamanhos BR / PP - XG)</option>
                <option value="intl">International Alpha (XS - 3XL)</option>
              </select>
            </div>

            <div>
              <label htmlFor="clothing-size-select" className="block text-xs font-semibold text-text-muted mb-2">
                Select Your Size
              </label>
              <select
                id="clothing-size-select"
                value={standardVal}
                onChange={(e) => setStandardVal(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-field text-ink font-bold text-lg outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
              >
                {category === 'women' ? (
                  <>
                    <option value="00">US 00 / UK 2 / EU 30 / BR 32 (XXS)</option>
                    <option value="0">US 0 / UK 4 / EU 32 / BR 34 (XXS)</option>
                    <option value="2">US 2 / UK 6 / EU 34 / BR 36 (XS)</option>
                    <option value="4">US 4 / UK 8 / EU 36 / BR 38 (S)</option>
                    <option value="6">US 6 / UK 10 / EU 38 / BR 40 (S)</option>
                    <option value="8">US 8 / UK 12 / EU 40 / BR 42 (M)</option>
                    <option value="10">US 10 / UK 14 / EU 42 / BR 44 (M)</option>
                    <option value="12">US 12 / UK 16 / EU 44 / BR 46 (L)</option>
                    <option value="14">US 14 / UK 18 / EU 46 / BR 48 (L)</option>
                    <option value="16">US 16 / UK 20 / EU 48 / BR 50 (XL)</option>
                    <option value="18">US 18 / UK 22 / EU 50 / BR 52 (XXL)</option>
                    <option value="20">US 20 / UK 24 / EU 52 / BR 54 (3XL)</option>
                  </>
                ) : (
                  <>
                    <option value="34">US 34 / UK 34 / EU 44 / BR 36 (XS)</option>
                    <option value="36">US 36 / UK 36 / EU 46 / BR 38 (S)</option>
                    <option value="38">US 38 / UK 38 / EU 48 / BR 40 (M)</option>
                    <option value="40">US 40 / UK 40 / EU 50 / BR 42 (M)</option>
                    <option value="42">US 42 / UK 42 / EU 52 / BR 44 (L)</option>
                    <option value="44">US 44 / UK 44 / EU 54 / BR 46 (L)</option>
                    <option value="46">US 46 / UK 46 / EU 56 / BR 48 (XL)</option>
                    <option value="48">US 48 / UK 48 / EU 58 / BR 50 (XXL)</option>
                    <option value="50">US 50 / UK 50 / EU 60 / BR 52 (3XL)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Primary Result Banner */}
          <div className="p-6 rounded-2xl bg-canvas-soft border border-hairline mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                  Primary Converted Fit
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                    {initialToUnit.toLowerCase().includes('brasil') || initialToUnit.toLowerCase().includes('br')
                      ? `BR ${standardResult.br}`
                      : initialToUnit.toLowerCase().includes('eu')
                      ? `EU ${standardResult.eu}`
                      : initialToUnit.toLowerCase().includes('uk')
                      ? `UK ${standardResult.uk}`
                      : `US ${standardResult.us}`}
                  </span>
                  <span className="text-sm font-semibold text-accent">
                    {initialToUnit.toLowerCase().includes('brasil') || initialToUnit.toLowerCase().includes('br')
                      ? `Internacional: ${standardResult.intl}`
                      : `Brasil: ${standardResult.br}`}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-text-muted block">Anatomical Bust/Chest</span>
                <span className="text-lg font-bold text-ink">
                  {standardResult.measurements.chest_in}″ <span className="text-xs text-text-faint font-normal">({standardResult.measurements.chest_cm} cm)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Sizing Grid Across Systems */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-canvas border border-accent/30 text-center shadow-2xs">
              <span className="text-[10px] uppercase tracking-wider text-accent font-bold">Brasil (BR)</span>
              <p className="text-2xl font-bold text-ink mt-1">{standardResult.br}</p>
              <span className="text-[11px] text-text-faint">Padrão Nacional</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">US Size</span>
              <p className="text-2xl font-bold text-ink mt-1">{standardResult.us}</p>
              <span className="text-[11px] text-text-faint">{category === 'women' ? "Women's Numeric" : "Suit/Chest"}</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">UK Size</span>
              <p className="text-2xl font-bold text-ink mt-1">{standardResult.uk}</p>
              <span className="text-[11px] text-text-faint">British Standard</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">EU Size</span>
              <p className="text-2xl font-bold text-ink mt-1">{standardResult.eu}</p>
              <span className="text-[11px] text-text-faint">Continental Europe</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Alpha Scale</span>
              <p className="text-2xl font-bold text-ink mt-1">{standardResult.intl}</p>
              <span className="text-[11px] text-text-faint">Universal Alpha</span>
            </div>
          </div>

          {/* Measurements Breakdown Box */}
          <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline-soft mb-8">
            <span className="text-xs font-semibold text-ink block mb-3">Target Body Dimensions</span>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[10px] uppercase text-text-muted font-medium">Bust / Chest</span>
                <p className="text-sm font-bold text-ink mt-0.5">{standardResult.measurements.chest_in}″ ({standardResult.measurements.chest_cm} cm)</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-text-muted font-medium">Natural Waist</span>
                <p className="text-sm font-bold text-ink mt-0.5">{standardResult.measurements.waist_in}″ ({standardResult.measurements.waist_cm} cm)</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-text-muted font-medium">Full Hips</span>
                <p className="text-sm font-bold text-ink mt-0.5">{standardResult.measurements.hips_in}″ ({standardResult.measurements.hips_cm} cm)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mode 2: Jeans & Denim ─── */}
      {mode === 'jeans' && (
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="jeans-waist-range" className="text-xs font-semibold text-text-muted">
                Select Waist Measurement (Inches)
              </label>
              <span className="text-xs font-bold text-ink">{waistInches}″ ({jeansResult.waist_cm} cm)</span>
            </div>
            <input
              id="jeans-waist-range"
              type="range"
              min="24"
              max="44"
              step="1"
              value={waistInches}
              onChange={(e) => setWaistInches(parseInt(e.target.value))}
              aria-label="Waist measurement in inches"
              className="w-full accent-ink cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
            />
          </div>

          <div className="p-6 rounded-2xl bg-canvas-soft border border-hairline mb-6">
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
              Denim Tag Size
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                W{jeansResult.waist_in}
              </span>
              <span className="text-sm font-semibold text-accent">
                Alpha: {jeansResult.us_alpha}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-canvas border border-accent/30 text-center shadow-2xs">
              <span className="text-[10px] uppercase text-accent font-bold">Brasil (BR)</span>
              <p className="text-2xl font-bold text-ink mt-1">BR {jeansResult.br_size}</p>
              <span className="text-[11px] text-text-faint">Cintura Nacional</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">US Tag</span>
              <p className="text-2xl font-bold text-ink mt-1">W{jeansResult.waist_in}</p>
              <span className="text-[11px] text-text-faint">Waist In Inches</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">US Dress Eq.</span>
              <p className="text-2xl font-bold text-ink mt-1">{jeansResult.us_numeric}</p>
              <span className="text-[11px] text-text-faint">Standard Dress</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">EU Sizing</span>
              <p className="text-2xl font-bold text-ink mt-1">{jeansResult.eu_size}</p>
              <span className="text-[11px] text-text-faint">Continental</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase text-text-muted font-semibold">UK Sizing</span>
              <p className="text-2xl font-bold text-ink mt-1">{jeansResult.uk_size}</p>
              <span className="text-[11px] text-text-faint">British Standard</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mode 3: Bra Sizing ─── */}
      {mode === 'bra' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="bra-underbust-range" className="text-xs font-semibold text-text-muted">
                  Snug Underbust (Ribcage)
                </label>
                <span className="text-xs font-bold text-ink">{underbust}″ ({braResult.underbust_cm} cm)</span>
              </div>
              <input
                id="bra-underbust-range"
                type="range"
                min="26"
                max="46"
                step="1"
                value={underbust}
                onChange={(e) => setUnderbust(parseInt(e.target.value))}
                aria-label="Snug underbust in inches"
                className="w-full accent-ink cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="bra-bust-range" className="text-xs font-semibold text-text-muted">
                  Fullest Bust Circumference
                </label>
                <span className="text-xs font-bold text-ink">{bust}″ ({braResult.bust_cm} cm)</span>
              </div>
              <input
                id="bra-bust-range"
                type="range"
                min="28"
                max="54"
                step="1"
                value={bust}
                onChange={(e) => setBust(Math.max(underbust, parseInt(e.target.value)))}
                aria-label="Fullest bust circumference in inches"
                className="w-full accent-ink cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-canvas-soft border border-hairline mb-6">
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
              Calculated Bra Size
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                US {braResult.us}
              </span>
              <span className="text-sm font-semibold text-accent">
                Band: {braResult.band_in}″ | Cup: {braResult.cup}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">US / CA</span>
              <p className="text-2xl font-bold text-ink mt-1">{braResult.us}</p>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">UK Standard</span>
              <p className="text-2xl font-bold text-ink mt-1">{braResult.uk}</p>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">EU / Continental</span>
              <p className="text-2xl font-bold text-ink mt-1">{braResult.eu}</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mode 4: Men's Dress Shirt ─── */}
      {mode === 'shirt' && (
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="shirt-collar-range" className="text-xs font-semibold text-text-muted">
                Collar / Neck Measurement (Inches)
              </label>
              <span className="text-xs font-bold text-ink">{neckInches}″ ({shirtResult.eu_collar_cm} cm)</span>
            </div>
            <input
              id="shirt-collar-range"
              type="range"
              min="14"
              max="20"
              step="0.5"
              value={neckInches}
              onChange={(e) => setNeckInches(parseFloat(e.target.value))}
              aria-label="Collar neck measurement in inches"
              className="w-full accent-ink cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
            />
          </div>

          <div className="p-6 rounded-2xl bg-canvas-soft border border-hairline mb-6">
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
              Shirt Size Result
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                {neckInches}″ Collar
              </span>
              <span className="text-sm font-semibold text-accent">
                EU: {shirtResult.eu_collar_cm} cm ({shirtResult.alpha_size})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">US / UK Collar</span>
              <p className="text-2xl font-bold text-ink mt-1">{neckInches}″</p>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">EU Collar</span>
              <p className="text-2xl font-bold text-ink mt-1">{shirtResult.eu_collar_cm} cm</p>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Chest Estimate</span>
              <p className="text-2xl font-bold text-ink mt-1">{shirtResult.chest_range_in}″</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-hairline-soft">
        <p className="text-xs text-text-muted">
          ASTM D5585 & EN 13402 garment sizing standards with anatomical cross-grading.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveSize}
            aria-live="polite"
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {saved ? '✓ Saved to Card' : 'Save to My Size Card'}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            aria-live="polite"
            className="px-5 py-2.5 rounded-full bg-canvas-soft text-ink text-xs font-semibold hover:bg-hairline transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {copied ? '✓ Copied' : 'Copy Summary'}
          </button>
        </div>
      </div>
    </section>
  );
}
