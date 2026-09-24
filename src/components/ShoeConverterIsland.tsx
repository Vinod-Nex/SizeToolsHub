import React, { useState } from 'react';
import { shoeSize, type ShoeSystem, type ShoeCategory } from '../lib/converters/shoeSize';
import { useShareableUrl } from '../lib/useShareableUrl';
import { showToast } from '../lib/toast';

interface Props {
  initialFromUnit?: string;
  initialToUnit?: string;
  primaryKeyword?: string;
}

export default function ShoeConverterIsland({
  initialFromUnit = 'US Size',
  initialToUnit = 'EU Size',
  primaryKeyword = 'Shoe Size Converter',
}: Props) {
  // Determine initial system from initialFromUnit
  const getInitialSystem = (): ShoeSystem => {
    const lower = initialFromUnit.toLowerCase();
    if (lower.includes('brasil') || lower.includes('br')) return 'br';
    if (lower.includes('eu')) return 'eu';
    if (lower.includes('uk')) return 'uk';
    if (lower.includes('cm') || lower.includes('centimeter')) return 'jp_cm';
    if (lower.includes('women')) return 'us_w';
    return 'us_m';
  };

  const getInitialGender = (): ShoeCategory => {
    const lower = initialFromUnit.toLowerCase();
    if (lower.includes('women')) return 'women';
    if (lower.includes('kid')) return 'kids';
    return 'men';
  };

  const [category, setCategory] = useState<ShoeCategory>(getInitialGender());
  const [sourceSystem, setSourceSystem] = useState<ShoeSystem>(getInitialSystem());
  const [sizeVal, setSizeVal] = useState<number>(sourceSystem === 'br' ? 40 : sourceSystem === 'eu' ? 43 : 10);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync state to shareable URL query parameters
  useShareableUrl(
    {
      size: sizeVal,
      system: sourceSystem,
      category,
    },
    (params) => {
      const pSize = params.get('size');
      const pSys = params.get('system') as ShoeSystem | null;
      const pCat = params.get('category') as ShoeCategory | null;
      if (pSize && !isNaN(Number(pSize))) setSizeVal(Number(pSize));
      if (pSys && ['us_m', 'us_w', 'us_kids', 'uk', 'eu', 'br', 'jp_cm', 'mondo_mm'].includes(pSys)) setSourceSystem(pSys);
      if (pCat && ['men', 'women', 'kids'].includes(pCat)) setCategory(pCat);
    }
  );

  // Compute live conversion results using the pure engine
  const result = shoeSize(sizeVal, sourceSystem, category);

  const handleCopy = () => {
    const text = `${primaryKeyword}: BR ${result.br} = US ${result.us_men} (Masc) / US ${result.us_women} (Fem) = UK ${result.uk} = EU ${result.eu} = ${result.jp_cm} cm (${result.foot_length_in} in)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Shoe size conversion copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSize = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('my_size_card') || '[]');
      const summary = `${category.toUpperCase()}: US ${category === 'women' ? result.us_women : category === 'kids' ? result.us_kids : result.us_men} / EU ${result.eu} (${result.jp_cm} cm)`;
      const updated = [
        { category: 'Footwear', summary, date: new Date().toLocaleDateString() },
        ...existing.filter((item: any) => item.category !== 'Footwear'),
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
      {/* Header Bar */}
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

        {/* Global Save/Copy feedback */}
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

      {/* Category (Gender) Segmented Toggle */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-text-muted mb-2">
          Select Footwear Category
        </label>
        <div role="radiogroup" aria-label="Footwear Category" className="flex rounded-full bg-field p-1 max-w-sm">
          {(['men', 'women', 'kids'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              role="radio"
              aria-checked={category === cat}
              onClick={() => {
                setCategory(cat);
                if (sourceSystem === 'us_m' && cat === 'women') setSourceSystem('us_w');
                if (sourceSystem === 'us_w' && cat === 'men') setSourceSystem('us_m');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-full capitalize transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                category === cat ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted hover:text-ink'
              }`}
            >
              {cat === 'men' ? "Men's" : cat === 'women' ? "Women's" : "Kids'"}
            </button>
          ))}
        </div>
      </div>

      {/* Input Controls Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8">
        <div>
          <label htmlFor="shoe-source-system" className="block text-xs font-semibold text-text-muted mb-2">
            Input System
          </label>
          <select
            id="shoe-source-system"
            value={sourceSystem}
            onChange={(e) => {
              const sys = e.target.value as ShoeSystem;
              setSourceSystem(sys);
              if (sys === 'br') setSizeVal(40);
              else if (sys === 'eu') setSizeVal(43);
              else if (sys === 'jp_cm') setSizeVal(27);
              else if (sys === 'mondo') setSizeVal(270);
              else setSizeVal(10);
            }}
            className="w-full px-4 py-3 rounded-2xl bg-field text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
          >
            <option value="br">Brasil (BR / Tamanho Nacional)</option>
            <option value="us_m">United States Men (US)</option>
            <option value="us_w">United States Women (US)</option>
            <option value="us_k">United States Kids (US)</option>
            <option value="uk">United Kingdom (UK)</option>
            <option value="eu">European Union (EU / Paris Points)</option>
            <option value="jp_cm">Japanese Foot Length (cm)</option>
            <option value="mondo">Mondopoint (ISO 9407 mm)</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="shoe-size-input" className="text-xs font-semibold text-text-muted">
              Enter Size Value
            </label>
            <span className="text-xs text-text-faint">Step: 0.5</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSizeVal((prev) => Math.max(1, prev - 0.5))}
              className="w-11 h-11 rounded-2xl bg-field flex items-center justify-center text-ink text-lg font-bold hover:bg-hairline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors cursor-pointer"
              aria-label="Decrease size"
            >
              −
            </button>
            <input
              id="shoe-size-input"
              type="number"
              step="0.5"
              value={sizeVal}
              onChange={(e) => setSizeVal(parseFloat(e.target.value) || 0)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-field text-ink font-bold text-center text-xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
            />
            <button
              type="button"
              onClick={() => setSizeVal((prev) => prev + 0.5)}
              className="w-11 h-11 rounded-2xl bg-field flex items-center justify-center text-ink text-lg font-bold hover:bg-hairline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors cursor-pointer"
              aria-label="Increase size"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Primary Target Highlighted Card */}
      <div className="p-6 rounded-2xl bg-canvas-soft border border-hairline mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
              Converted Primary Standard
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                {initialToUnit.toLowerCase().includes('brasil') || initialToUnit.toLowerCase().includes('br')
                  ? `BR ${result.br}`
                  : initialToUnit.toLowerCase().includes('eu')
                  ? `EU ${result.eu}`
                  : initialToUnit.toLowerCase().includes('uk')
                  ? `UK ${result.uk}`
                  : initialToUnit.toLowerCase().includes('men')
                  ? `US Men ${result.us_men}`
                  : initialToUnit.toLowerCase().includes('women')
                  ? `US Women ${result.us_women}`
                  : `US ${category === 'women' ? result.us_women : result.us_men}`}
              </span>
              <span className="text-sm font-semibold text-accent">
                {initialToUnit.toLowerCase().includes('brasil') || initialToUnit.toLowerCase().includes('br')
                  ? `Padrão Brasileiro`
                  : `Exact Fit Match`}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-text-muted block">Measured Foot Length</span>
            <span className="text-lg font-bold text-ink">
              {result.jp_cm} cm <span className="text-xs text-text-faint font-normal">({result.foot_length_in} in)</span>
            </span>
          </div>
        </div>
      </div>

      {/* All Secondary Conversion Standards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        <div className="p-4 rounded-2xl bg-canvas border border-accent/30 text-center shadow-2xs">
          <span className="text-[10px] uppercase tracking-wider text-accent font-bold">Brasil (BR)</span>
          <p className="text-2xl font-bold text-ink mt-1">{result.br}</p>
          <span className="text-[11px] text-text-faint">Padrão Nacional</span>
        </div>
        <div className="p-4 rounded-2xl bg-field text-center">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">US Men</span>
          <p className="text-2xl font-bold text-ink mt-1">{result.us_men}</p>
          <span className="text-[11px] text-text-faint">Standard Width D</span>
        </div>
        <div className="p-4 rounded-2xl bg-field text-center">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">US Women</span>
          <p className="text-2xl font-bold text-ink mt-1">{result.us_women}</p>
          <span className="text-[11px] text-text-faint">Standard Width B</span>
        </div>
        <div className="p-4 rounded-2xl bg-field text-center">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">EU (Paris Pt)</span>
          <p className="text-2xl font-bold text-ink mt-1">{result.eu}</p>
          <span className="text-[11px] text-text-faint">Europa Continental</span>
        </div>
        <div className="p-4 rounded-2xl bg-field text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">UK Standard</span>
          <p className="text-2xl font-bold text-ink mt-1">{result.uk}</p>
          <span className="text-[11px] text-text-faint">British Imperial</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-hairline-soft">
        <p className="text-xs text-text-muted">
          Values calibrated via ISO 9407 standards with 20mm last allowance.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveSize}
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
          >
            Save to My Size Card
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-full bg-canvas-soft text-ink text-xs font-semibold hover:bg-hairline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
          >
            Copy Summary
          </button>
        </div>
      </div>
    </section>
  );
}
