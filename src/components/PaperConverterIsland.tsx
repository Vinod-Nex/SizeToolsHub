import React, { useState, useMemo } from 'react';
import {
  paperSize,
  comparePaperSizes,
  getPaperPixelsAtDpi,
  PAPER_PRESET_GROUPS,
  PAPER_CATALOG,
} from '../lib/converters/paperSize';
import type { PaperSizeResult } from '../lib/converters/types';
import PaperComparisonSvg from './PaperComparisonSvg';
import { useShareableUrl } from '../lib/useShareableUrl';
import { showToast } from '../lib/toast';

interface Props {
  initialFromUnit?: string;
  initialToUnit?: string;
  primaryKeyword?: string;
}

export default function PaperConverterIsland({
  initialFromUnit = 'A4',
  initialToUnit = 'US Letter',
  primaryKeyword,
}: Props) {
  const [sizeAName, setSizeAName] = useState<string>(initialFromUnit);
  const [sizeBName, setSizeBName] = useState<string>(initialToUnit);
  const [unitMode, setUnitMode] = useState<'mm' | 'cm' | 'inches' | 'px300' | 'px150'>('mm');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedCard, setSavedCard] = useState<boolean>(false);

  // Sync state to shareable URL query parameters
  useShareableUrl(
    {
      a: sizeAName,
      b: sizeBName,
      unit: unitMode,
    },
    (params) => {
      const pA = params.get('a');
      const pB = params.get('b');
      const pUnit = params.get('unit');

      if (pA && PAPER_CATALOG[pA]) setSizeAName(pA);
      if (pB && PAPER_CATALOG[pB]) setSizeBName(pB);
      if (pUnit && ['mm', 'cm', 'inches', 'px300', 'px150'].includes(pUnit)) {
        setUnitMode(pUnit as any);
      }
    }
  );

  // Compute paper size models
  const sizeA = useMemo<PaperSizeResult>(() => paperSize(sizeAName), [sizeAName]);
  const sizeB = useMemo<PaperSizeResult>(() => paperSize(sizeBName), [sizeBName]);

  const comparison = useMemo(() => comparePaperSizes(sizeA, sizeB), [sizeA, sizeB]);

  const dpi300_A = useMemo(() => getPaperPixelsAtDpi(sizeA.width_in, sizeA.height_in, 300), [sizeA]);
  const dpi300_B = useMemo(() => getPaperPixelsAtDpi(sizeB.width_in, sizeB.height_in, 300), [sizeB]);
  const dpi150_A = useMemo(() => getPaperPixelsAtDpi(sizeA.width_in, sizeA.height_in, 150), [sizeA]);
  const dpi150_B = useMemo(() => getPaperPixelsAtDpi(sizeB.width_in, sizeB.height_in, 150), [sizeB]);

  // Formatter helpers
  const formatDim = (mm: number, inch: number, cm: number, px300: number, px150: number) => {
    switch (unitMode) {
      case 'inches':
        return `${inch}″`;
      case 'cm':
        return `${cm} cm`;
      case 'px300':
        return `${px300.toLocaleString()} px`;
      case 'px150':
        return `${px150.toLocaleString()} px`;
      case 'mm':
      default:
        return `${mm} mm`;
    }
  };

  const handleSwap = () => {
    const temp = sizeAName;
    setSizeAName(sizeBName);
    setSizeBName(temp);
  };

  const handleCopy = () => {
    const text = `${sizeA.name}: ${sizeA.width_mm} x ${sizeA.height_mm} mm (${sizeA.width_in} x ${sizeA.height_in} in) vs ${sizeB.name}: ${sizeB.width_mm} x ${sizeB.height_mm} mm (${sizeB.width_in} x ${sizeB.height_in} in) | SizeToolsHub`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    showToast('Paper size comparison copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCard = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('saved_size_cards') || '[]');
      const card = {
        id: `paper-${Date.now()}`,
        type: 'paper',
        title: `${sizeA.name} vs ${sizeB.name}`,
        details: `${sizeA.name} (${sizeA.width_mm}×${sizeA.height_mm}mm) | ${sizeB.name} (${sizeB.width_mm}×${sizeB.height_mm}mm)`,
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
      {/* Top Bar: Selector Cards and Swap Button */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-4 items-center mb-8">
        {/* Source Standard A */}
        <div className="p-4 sm:p-5 rounded-2xl bg-canvas-soft border border-hairline-soft">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="sizeA-select" className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Primary Standard (Sheet A)
            </label>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">
              {sizeA.series}
            </span>
          </div>

          <select
            id="sizeA-select"
            value={sizeAName}
            onChange={(e) => setSizeAName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-canvas text-ink font-semibold text-base sm:text-lg border border-hairline outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
          >
            {PAPER_PRESET_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.items.map((item) => (
                  <option key={`a-${item.name}`} value={item.name}>
                    {item.label} ({item.dims})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
            <span>Dimensions:</span>
            <span className="font-semibold text-ink">
              {sizeA.width_mm} × {sizeA.height_mm} mm ({sizeA.width_in} × {sizeA.height_in}″)
            </span>
          </div>
        </div>

        {/* Swap Action */}
        <div className="flex justify-center -my-2 lg:my-0">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap Sheet A and Sheet B paper sizes"
            className="p-3 rounded-full bg-canvas-soft border border-hairline hover:bg-canvas hover:border-ink/20 transition-all text-ink hover:rotate-180 duration-300 shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            title="Swap Primary & Target Standards"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        {/* Target Standard B */}
        <div className="p-4 sm:p-5 rounded-2xl bg-canvas-soft border border-hairline-soft">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="sizeB-select" className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Comparison Standard (Sheet B)
            </label>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold">
              {sizeB.series}
            </span>
          </div>

          <select
            id="sizeB-select"
            value={sizeBName}
            onChange={(e) => setSizeBName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-canvas text-ink font-semibold text-base sm:text-lg border border-hairline outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all cursor-pointer"
          >
            {PAPER_PRESET_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.items.map((item) => (
                  <option key={`b-${item.name}`} value={item.name}>
                    {item.label} ({item.dims})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
            <span>Dimensions:</span>
            <span className="font-semibold text-ink">
              {sizeB.width_mm} × {sizeB.height_mm} mm ({sizeB.width_in} × {sizeB.height_in}″)
            </span>
          </div>
        </div>
      </div>

      {/* Quick Comparison Presets Bar */}
      <div className="mb-8">
        <span className="text-xs font-semibold text-text-muted block mb-2">Quick Standard Comparisons:</span>
        <div className="flex flex-wrap gap-2">
          {[
            { a: 'A4', b: 'US Letter', label: 'A4 ⇄ US Letter' },
            { a: 'A3', b: 'A4', label: 'A3 ⇄ A4 (ISO 2× Ratio)' },
            { a: 'US Legal', b: 'US Letter', label: 'Legal vs Letter' },
            { a: 'DL', b: '#10 Commercial', label: 'DL ⇄ #10 Envelope' },
            { a: '18x24 Medium Poster', b: '24x36 Large Poster', label: '18×24″ ⇄ 24×36″ Poster' },
            { a: 'A4', b: 'A5', label: 'A4 ⇄ A5 (Folded Half)' },
          ].map((pair) => (
            <button
              key={`${pair.a}-${pair.b}`}
              type="button"
              onClick={() => {
                setSizeAName(pair.a);
                setSizeBName(pair.b);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                sizeAName === pair.a && sizeBName === pair.b
                  ? 'bg-ink text-canvas border-ink shadow-2xs'
                  : 'bg-canvas-soft border-hairline-soft text-text-muted hover:text-ink hover:border-hairline'
              }`}
            >
              {pair.label}
            </button>
          ))}
        </div>
      </div>

      {/* Unit Display Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-hairline-soft">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Display Units:</span>
          <div role="radiogroup" aria-label="Display units" className="flex items-center bg-canvas-soft p-1 rounded-full border border-hairline-soft">
            {(
              [
                { id: 'mm', label: 'Millimeters (mm)' },
                { id: 'inches', label: 'Inches (in)' },
                { id: 'cm', label: 'Centimeters (cm)' },
                { id: 'px300', label: 'Pixels @ 300 DPI' },
                { id: 'px150', label: 'Pixels @ 150 DPI' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={unitMode === item.id}
                onClick={() => setUnitMode(item.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  unitMode === item.id
                    ? 'bg-canvas text-ink shadow-2xs'
                    : 'text-text-muted hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            aria-live="polite"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-canvas-soft hover:bg-canvas border border-hairline-soft text-xs font-semibold text-ink transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>{copied ? '✓ Copied!' : 'Copy Dimensions'}</span>
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

      {/* Live Spec Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Spec Card A */}
        <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold text-ink flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
              {sizeA.name} Specifications
            </span>
            <span className="text-xs text-accent font-semibold">{sizeA.series}</span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between py-1 border-b border-hairline-soft">
              <span className="text-text-muted">Width:</span>
              <span className="font-bold text-ink">
                {formatDim(sizeA.width_mm, sizeA.width_in, sizeA.width_cm, dpi300_A.widthPx, dpi150_A.widthPx)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-hairline-soft">
              <span className="text-text-muted">Height:</span>
              <span className="font-bold text-ink">
                {formatDim(sizeA.height_mm, sizeA.height_in, sizeA.height_cm, dpi300_A.heightPx, dpi150_A.heightPx)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-hairline-soft">
              <span className="text-text-muted">Aspect Ratio:</span>
              <span className="font-semibold text-ink">{sizeA.aspect_ratio}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-hairline-soft">
              <span className="text-text-muted">Surface Area:</span>
              <span className="font-semibold text-ink">
                {sizeA.area_sq_m} m² ({sizeA.area_sq_in} sq in)
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-text-muted">300 DPI Megapixels:</span>
              <span className="font-semibold text-ink">{dpi300_A.megapixels} MP ({dpi300_A.widthPx} × {dpi300_A.heightPx})</span>
            </div>
          </div>
        </div>

        {/* Spec Card B */}
        <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold text-ink flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              {sizeB.name} Specifications
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">{sizeB.series}</span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between py-1 border-b border-hairline-soft">
              <span className="text-text-muted">Width:</span>
              <span className="font-bold text-ink">
                {formatDim(sizeB.width_mm, sizeB.width_in, sizeB.width_cm, dpi300_B.widthPx, dpi150_B.widthPx)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-hairline-soft">
              <span className="text-text-muted">Height:</span>
              <span className="font-bold text-ink">
                {formatDim(sizeB.height_mm, sizeB.height_in, sizeB.height_cm, dpi300_B.heightPx, dpi150_B.heightPx)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-hairline-soft">
              <span className="text-text-muted">Aspect Ratio:</span>
              <span className="font-semibold text-ink">{sizeB.aspect_ratio}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-hairline-soft">
              <span className="text-text-muted">Surface Area:</span>
              <span className="font-semibold text-ink">
                {sizeB.area_sq_m} m² ({sizeB.area_sq_in} sq in)
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-text-muted">300 DPI Megapixels:</span>
              <span className="font-semibold text-ink">{dpi300_B.megapixels} MP ({dpi300_B.widthPx} × {dpi300_B.heightPx})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Side-by-Side and Overlay SVG Component */}
      <PaperComparisonSvg sizeA={sizeA} sizeB={sizeB} initialMode="side-by-side" showControls={true} />

      {/* Scaling Advice & Document Preparation Tips */}
      <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-canvas-soft border border-hairline-soft">
        <h4 className="text-sm font-bold text-ink mb-2 flex items-center gap-2">
          <span>🖨️</span>
          <span>Scaling & Printing Guidance</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-muted leading-relaxed">
          <p>
            <strong>To print {sizeB.name} onto {sizeA.name}:</strong> Apply a scale factor of <strong>{comparison.scaleToFitPercent}%</strong> in your printer software or PDF driver (select <em>&ldquo;Fit to Printable Area&rdquo;</em>). This prevents accidental margin truncation on documents crossing regional boundaries.
          </p>
          <p>
            <strong>High-Resolution Printing (300 DPI):</strong> Create your raster artwork at <strong>{dpi300_A.widthPx} × {dpi300_A.heightPx} px</strong> for {sizeA.name}, or <strong>{dpi300_B.widthPx} × {dpi300_B.heightPx} px</strong> for {sizeB.name} for razor-sharp commercial print output.
          </p>
        </div>
      </div>
    </div>
  );
}
