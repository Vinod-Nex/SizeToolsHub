import React, { useState } from 'react';
import { ringSize, type RingSystem } from '../lib/converters/ringSize';
import { useShareableUrl } from '../lib/useShareableUrl';
import { showToast } from '../lib/toast';

interface Props {
  initialFromUnit?: string;
  initialToUnit?: string;
  primaryKeyword?: string;
}

export default function RingConverterIsland({
  initialFromUnit = 'US Ring Size',
  initialToUnit = 'UK Letter / EU Size',
  primaryKeyword = 'Ring Size Converter',
}: Props) {
  const lowerFrom = initialFromUnit.toLowerCase();
  const defaultSystem: RingSystem = lowerFrom.includes('uk')
    ? 'uk'
    : lowerFrom.includes('eu')
    ? 'eu'
    : lowerFrom.includes('diameter') || lowerFrom.includes('mm')
    ? 'diameter_mm'
    : lowerFrom.includes('circumference')
    ? 'circumference_mm'
    : 'us';

  const [sourceSystem, setSourceSystem] = useState<RingSystem>(defaultSystem);
  const [usVal, setUsVal] = useState<number>(7);
  const [ukVal, setUkVal] = useState<string>('N 1/2');
  const [euVal, setEuVal] = useState<number>(54);
  const [diamVal, setDiamVal] = useState<number>(17.32);
  const [circVal, setCircVal] = useState<number>(54.4);

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Compute live conversion results using pure engine
  let currentVal: number | string = usVal;
  if (sourceSystem === 'uk') currentVal = ukVal;
  else if (sourceSystem === 'eu') currentVal = euVal;
  else if (sourceSystem === 'diameter_mm') currentVal = diamVal;
  else if (sourceSystem === 'circumference_mm') currentVal = circVal;

  // Sync state to shareable URL query parameters
  useShareableUrl(
    {
      system: sourceSystem,
      val: currentVal,
    },
    (params) => {
      const pSys = params.get('system') as RingSystem | null;
      const pVal = params.get('val');
      if (pSys && ['us', 'uk', 'eu', 'diameter_mm', 'circumference_mm'].includes(pSys)) {
        setSourceSystem(pSys);
      }
      if (pVal) {
        if (pSys === 'uk') setUkVal(pVal);
        else if (pSys === 'eu' && !isNaN(Number(pVal))) setEuVal(Number(pVal));
        else if (pSys === 'diameter_mm' && !isNaN(Number(pVal))) setDiamVal(Number(pVal));
        else if (pSys === 'circumference_mm' && !isNaN(Number(pVal))) setCircVal(Number(pVal));
        else if (!isNaN(Number(pVal))) setUsVal(Number(pVal));
      }
    }
  );

  const result = ringSize(currentVal, sourceSystem);

  const handleCopy = () => {
    const text = `${primaryKeyword}: US ${result.us} = UK ${result.uk} = EU ${result.eu} = Inside Diameter ${result.diameter_mm} mm (${result.diameter_in}″), Circumference ${result.circumference_mm} mm`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Ring size conversion copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSize = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('my_size_card') || '[]');
      const summary = `RING: US ${result.us} / UK ${result.uk} / EU ${result.eu} (Ø ${result.diameter_mm} mm)`;
      const updated = [
        { category: 'Jewelry', summary, date: new Date().toLocaleDateString() },
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

        {/* Status Alerts */}
        <div className="flex items-center gap-2">
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

      {/* Input Configuration Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8">
        <div>
          <label htmlFor="ring-standard-select" className="block text-xs font-semibold text-text-muted mb-2">
            Input Measurement Standard
          </label>
          <select
            id="ring-standard-select"
            value={sourceSystem}
            onChange={(e) => {
              const sys = e.target.value as RingSystem;
              setSourceSystem(sys);
            }}
            className="w-full px-4 py-3 rounded-2xl bg-field text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
          >
            <option value="us">United States / Canada Numeric (US 3 - 14)</option>
            <option value="uk">United Kingdom / Australia Letters (A - Z+3)</option>
            <option value="eu">European Union ISO 8653 (Circumference mm)</option>
            <option value="diameter_mm">Inside Diameter (Millimeters)</option>
            <option value="circumference_mm">Inside Circumference (Millimeters)</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="ring-value-input" className="text-xs font-semibold text-text-muted">
              Select or Enter Value
            </label>
            <span className="text-xs text-text-faint">Continuous Gauge</span>
          </div>

          {sourceSystem === 'us' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUsVal((prev) => Math.max(3, Number((prev - 0.25).toFixed(2))))}
                className="w-11 h-11 rounded-2xl bg-field flex items-center justify-center text-ink text-lg font-bold hover:bg-hairline transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Decrease US size"
              >
                −
              </button>
              <input
                id="ring-value-input"
                type="number"
                step="0.25"
                min="3"
                max="14"
                value={usVal}
                onChange={(e) => setUsVal(parseFloat(e.target.value) || 3)}
                aria-label="US Ring Size"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-field text-ink font-bold text-center text-xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
              />
              <button
                type="button"
                onClick={() => setUsVal((prev) => Math.min(14, Number((prev + 0.25).toFixed(2))))}
                className="w-11 h-11 rounded-2xl bg-field flex items-center justify-center text-ink text-lg font-bold hover:bg-hairline transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Increase US size"
              >
                +
              </button>
            </div>
          )}

          {sourceSystem === 'uk' && (
            <select
              id="ring-value-input"
              value={ukVal}
              onChange={(e) => setUkVal(e.target.value)}
              aria-label="UK Ring Size Letter"
              className="w-full px-4 py-3 rounded-2xl bg-field text-ink font-bold text-lg outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
            >
              {['F', 'G', 'H', 'I', 'J', 'J 1/2', 'K', 'K 1/2', 'L', 'L 1/2', 'M', 'N', 'N 1/2', 'O', 'P', 'P 1/2', 'Q', 'R', 'R 1/2', 'S', 'T', 'T 1/2', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Z+1'].map((lettr) => (
                <option key={lettr} value={lettr}>
                  UK Size {lettr}
                </option>
              ))}
            </select>
          )}

          {sourceSystem === 'eu' && (
            <input
              id="ring-value-input"
              type="number"
              step="1"
              min="40"
              max="76"
              value={euVal}
              onChange={(e) => setEuVal(parseInt(e.target.value) || 54)}
              aria-label="EU Ring Size Circumference in millimeters"
              className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink font-bold text-center text-xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
              placeholder="e.g. 54"
            />
          )}

          {sourceSystem === 'diameter_mm' && (
            <input
              id="ring-value-input"
              type="number"
              step="0.1"
              min="12"
              max="24"
              value={diamVal}
              onChange={(e) => setDiamVal(parseFloat(e.target.value) || 17.3)}
              aria-label="Inside Diameter in millimeters"
              className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink font-bold text-center text-xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
              placeholder="e.g. 17.32 mm"
            />
          )}

          {sourceSystem === 'circumference_mm' && (
            <input
              id="ring-value-input"
              type="number"
              step="0.5"
              min="38"
              max="78"
              value={circVal}
              onChange={(e) => setCircVal(parseFloat(e.target.value) || 54.4)}
              aria-label="Inside Circumference in millimeters"
              className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink font-bold text-center text-xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
              placeholder="e.g. 54.4 mm"
            />
          )}
        </div>
      </div>

      {/* Primary Highlighted Result Banner with Visual Ring Indicator */}
      <div className="p-6 rounded-2xl bg-canvas-soft border border-hairline mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
              Primary Converted Standard
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                US {result.us} / UK {result.uk}
              </span>
              <span className="text-sm font-semibold text-accent">
                EU: {result.eu} mm
              </span>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Inside Diameter: <span className="font-bold text-ink">{result.diameter_mm} mm</span> ({result.diameter_in}″) | Circumference: <span className="font-bold text-ink">{result.circumference_mm} mm</span>
            </p>
          </div>

          {/* Scaled Ring Visual Indicator */}
          <div aria-hidden="true" className="flex flex-col items-center justify-center p-3 rounded-2xl bg-field">
            <span className="text-[10px] uppercase font-semibold text-text-muted mb-2">Simulated Profile</span>
            <div
              className="rounded-full border-2 border-accent flex items-center justify-center transition-all duration-300"
              style={{
                width: `${Math.min(90, Math.max(48, result.diameter_mm * 3.5))}px`,
                height: `${Math.min(90, Math.max(48, result.diameter_mm * 3.5))}px`,
              }}
            >
              <span className="text-[10px] font-mono font-bold text-accent">
                {result.diameter_mm}mm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Standards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="p-4 rounded-2xl bg-field text-center">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">US / Canada</span>
          <p className="text-2xl font-bold text-ink mt-1">{result.us}</p>
          <span className="text-[11px] text-text-faint">Quarter Steps</span>
        </div>
        <div className="p-4 rounded-2xl bg-field text-center">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">UK / Australia</span>
          <p className="text-2xl font-bold text-ink mt-1">{result.uk}</p>
          <span className="text-[11px] text-text-faint">Imperial Letter Scale</span>
        </div>
        <div className="p-4 rounded-2xl bg-field text-center">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">EU (ISO 8653)</span>
          <p className="text-2xl font-bold text-ink mt-1">{result.eu}</p>
          <span className="text-[11px] text-text-faint">Circumference mm</span>
        </div>
        <div className="p-4 rounded-2xl bg-field text-center">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Japan / Asia</span>
          <p className="text-2xl font-bold text-ink mt-1">{result.jp}</p>
          <span className="text-[11px] text-text-faint">JIS Standard</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-hairline-soft">
        <p className="text-xs text-text-muted">
          ISO 8653 jewelry sizing calibration. Temperature and knuckle width can cause variation.
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
