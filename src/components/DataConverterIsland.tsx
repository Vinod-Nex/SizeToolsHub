import React, { useState } from 'react';
import {
  dataStorage,
  calculateDownloadTime,
  type DataUnit,
  type DataStandard,
} from '../lib/converters/dataStorage';
import { useShareableUrl } from '../lib/useShareableUrl';
import { showToast } from '../lib/toast';

interface Props {
  initialFromUnit?: string;
  initialToUnit?: string;
  primaryKeyword?: string;
}

export default function DataConverterIsland({
  initialFromUnit = 'MB',
  initialToUnit = 'GB',
  primaryKeyword = 'Data Storage Converter',
}: Props) {
  const lowerKeyword = primaryKeyword.toLowerCase();
  const lowerFrom = initialFromUnit.toLowerCase();

  const isDownload = lowerKeyword.includes('download') || lowerKeyword.includes('time');

  const [mode, setMode] = useState<'storage' | 'download'>(isDownload ? 'download' : 'storage');
  const [standard, setStandard] = useState<DataStandard>('decimal');

  // Storage state
  const detectUnit = (str: string): DataUnit => {
    const s = str.toUpperCase();
    if (s.includes('TB')) return 'TB';
    if (s.includes('GB')) return 'GB';
    if (s.includes('MB')) return 'MB';
    if (s.includes('KB')) return 'KB';
    if (s.includes('PB')) return 'PB';
    if (s.includes('BYTE')) return 'B';
    return 'GB';
  };

  const [sourceUnit, setSourceUnit] = useState<DataUnit>(detectUnit(initialFromUnit));
  const [val, setVal] = useState<number>(1024);

  // Download state
  const [fileSize, setFileSize] = useState<number>(50);
  const [fileUnit, setFileUnit] = useState<DataUnit>('GB');
  const [speedMbps, setSpeedMbps] = useState<number>(100);

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync state to shareable URL query parameters
  useShareableUrl(
    {
      mode,
      standard,
      unit: mode === 'storage' ? sourceUnit : fileUnit,
      val: mode === 'storage' ? val : fileSize,
      speed: mode === 'download' ? speedMbps : undefined,
    },
    (params) => {
      const pMode = params.get('mode') as 'storage' | 'download' | null;
      const pStd = params.get('standard') as DataStandard | null;
      const pUnit = params.get('unit') as DataUnit | null;
      const pVal = params.get('val');
      const pSpeed = params.get('speed');

      if (pMode && ['storage', 'download'].includes(pMode)) setMode(pMode);
      if (pStd && ['decimal', 'binary'].includes(pStd)) setStandard(pStd);
      if (pUnit && ['B', 'KB', 'MB', 'GB', 'TB', 'PB'].includes(pUnit)) {
        if (pMode === 'download') setFileUnit(pUnit);
        else setSourceUnit(pUnit);
      }
      if (pVal && !isNaN(Number(pVal))) {
        if (pMode === 'download') setFileSize(Number(pVal));
        else setVal(Number(pVal));
      }
      if (pSpeed && !isNaN(Number(pSpeed))) {
        setSpeedMbps(Number(pSpeed));
      }
    }
  );

  // Calculations
  const result = dataStorage(val, sourceUnit, standard);
  const downloadResult = calculateDownloadTime(fileSize, fileUnit, speedMbps, standard);

  const handleCopy = () => {
    let text = '';
    if (mode === 'storage') {
      text = `${val} ${sourceUnit} (${standard.toUpperCase()}) = ${result.gigabytes} GB (${result.gibibytes} GiB) = ${result.megabytes} MB (${result.mebibytes} MiB) = ${result.bytes.toLocaleString()} Bytes`;
    } else {
      text = `Download ${fileSize} ${fileUnit} at ${speedMbps} Mbps = ${downloadResult.formatted_time} (${Math.round((speedMbps / 8) * 10) / 10} MB/s actual transfer rate)`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Data storage conversion copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('my_size_card') || '[]');
      let summary = '';
      if (mode === 'storage') {
        summary = `DATA: ${val} ${sourceUnit} = ${result.gigabytes} GB (${result.gibibytes} GiB)`;
      } else {
        summary = `TRANSFER: ${fileSize} ${fileUnit} @ ${speedMbps} Mbps = ${downloadResult.formatted_time}`;
      }
      const updated = [
        { category: 'Data', summary, date: new Date().toLocaleDateString() },
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
            <span>Digital Storage & Bandwidth Engine</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            {initialFromUnit} to {initialToUnit} Calculator
          </h2>
        </div>

        {/* Action Alerts */}
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

      {/* Mode Selector */}
      <div role="tablist" aria-label="Data conversion mode" className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          role="tab"
          id="data-tab-storage"
          aria-controls="data-panel-storage"
          aria-selected={mode === 'storage'}
          tabIndex={mode === 'storage' ? 0 : -1}
          onClick={() => setMode('storage')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            mode === 'storage'
              ? 'bg-ink text-canvas shadow-xs'
              : 'bg-field text-text-muted hover:text-ink'
          }`}
        >
          Data Units & Disk Sizing
        </button>
        <button
          type="button"
          role="tab"
          id="data-tab-download"
          aria-controls="data-panel-download"
          aria-selected={mode === 'download'}
          tabIndex={mode === 'download' ? 0 : -1}
          onClick={() => setMode('download')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            mode === 'download'
              ? 'bg-ink text-canvas shadow-xs'
              : 'bg-field text-text-muted hover:text-ink'
          }`}
        >
          Download Time Calculator
        </button>
      </div>

      {/* Decimal (SI) vs Binary (IEC) Standard Selector (CRITICAL REQUIREMENT) */}
      <div className="mb-6 p-4 rounded-2xl bg-canvas-soft border border-hairline-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-bold text-ink block">Standard Definition</span>
            <span className="text-[11px] text-text-muted">
              Choose how kilo/mega/giga multipliers are calculated
            </span>
          </div>

          <div role="radiogroup" aria-label="Data standard definition" className="flex rounded-full bg-field p-1 max-w-xs">
            <button
              type="button"
              role="radio"
              aria-checked={standard === 'decimal'}
              onClick={() => setStandard('decimal')}
              className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                standard === 'decimal' ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted hover:text-ink'
              }`}
            >
              Decimal (1000 / SI)
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={standard === 'binary'}
              onClick={() => setStandard('binary')}
              className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                standard === 'binary' ? 'bg-canvas text-ink shadow-2xs' : 'text-text-muted hover:text-ink'
              }`}
            >
              Binary (1024 / IEC)
            </button>
          </div>
        </div>

        {/* Clarifying Badge / Note in the UI */}
        <div className="text-xs text-text-muted leading-relaxed border-t border-hairline-soft pt-3">
          {standard === 'decimal' ? (
            <p>
              <strong className="text-ink">Decimal (SI / Base 1,000):</strong> 1 KB = 1,000 Bytes, 1 MB = 1,000 KB, 1 GB = 1,000 MB. Used by <em>macOS, hard drive & SSD makers (WD, Samsung, Seagate)</em>, and networking standards.
            </p>
          ) : (
            <p>
              <strong className="text-ink">Binary (IEC / Base 1,024):</strong> 1 KiB = 1,024 Bytes, 1 MiB = 1,024 KiB, 1 GiB = 1,024 MiB. Used by <em>Microsoft Windows (labeled as KB/MB/GB), RAM architecture, and Linux filesystems</em>.
            </p>
          )}
        </div>
      </div>

      {/* ─── Mode 1: Storage Unit Converter ─── */}
      {mode === 'storage' && (
        <div role="tabpanel" id="data-panel-storage" aria-labelledby="data-tab-storage" tabIndex={0} className="focus:outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="data-storage-unit" className="block text-xs font-semibold text-text-muted mb-2">Input Unit</label>
              <select
                id="data-storage-unit"
                value={sourceUnit}
                onChange={(e) => setSourceUnit(e.target.value as DataUnit)}
                className="w-full px-4 py-3 rounded-2xl bg-field text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
              >
                <option value="B">Bytes (B)</option>
                <option value="KB">Kilobytes (KB) / KiB</option>
                <option value="MB">Megabytes (MB) / MiB</option>
                <option value="GB">Gigabytes (GB) / GiB</option>
                <option value="TB">Terabytes (TB) / TiB</option>
                <option value="PB">Petabytes (PB) / PiB</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="data-storage-val" className="text-xs font-semibold text-text-muted">Enter Size Value</label>
                <span className="text-[11px] text-text-faint">{result.human_readable_decimal}</span>
              </div>
              <input
                id="data-storage-val"
                type="number"
                step="any"
                min="0"
                value={val}
                onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
                aria-label="Enter data size value"
                className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink font-bold text-center text-xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
              />
            </div>
          </div>

          {/* Primary High-Contrast Conversion Display */}
          <div className="p-6 rounded-2xl bg-canvas-soft border border-hairline mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                  Converted Result
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl sm:text-5xl font-bold tracking-tight text-ink">
                    {sourceUnit === 'MB'
                      ? `${result.gigabytes} GB`
                      : sourceUnit === 'GB'
                      ? `${result.terabytes} TB`
                      : sourceUnit === 'KB'
                      ? `${result.megabytes} MB`
                      : `${result.gigabytes} GB`}
                  </span>
                  <span className="text-sm font-semibold text-accent">
                    {standard === 'decimal' ? 'Base 1000' : 'Base 1024'}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-text-muted block">Binary Equivalent (IEC)</span>
                <span className="text-lg font-bold text-ink">
                  {sourceUnit === 'MB'
                    ? `${result.gibibytes} GiB`
                    : sourceUnit === 'GB'
                    ? `${result.tebibytes} TiB`
                    : `${result.mebibytes} MiB`}
                </span>
              </div>
            </div>
          </div>

          {/* Comprehensive Units Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Kilobytes</span>
              <p className="text-xl font-bold text-ink mt-1 truncate">{result.kilobytes.toLocaleString()}</p>
              <span className="text-[11px] text-text-faint">{result.kibibytes.toLocaleString()} KiB</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Megabytes</span>
              <p className="text-xl font-bold text-ink mt-1 truncate">{result.megabytes.toLocaleString()}</p>
              <span className="text-[11px] text-text-faint">{result.mebibytes.toLocaleString()} MiB</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Gigabytes</span>
              <p className="text-xl font-bold text-ink mt-1 truncate">{result.gigabytes.toLocaleString()}</p>
              <span className="text-[11px] text-text-faint">{result.gibibytes.toLocaleString()} GiB</span>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Terabytes</span>
              <p className="text-xl font-bold text-ink mt-1 truncate">{result.terabytes.toLocaleString()}</p>
              <span className="text-[11px] text-text-faint">{result.tebibytes.toLocaleString()} TiB</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Mode 2: Download Time Calculator ─── */}
      {mode === 'download' && (
        <div role="tabpanel" id="data-panel-download" aria-labelledby="data-tab-download" tabIndex={0} className="focus:outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="data-download-size" className="block text-xs font-semibold text-text-muted mb-2">File Size</label>
              <input
                id="data-download-size"
                type="number"
                step="any"
                min="0"
                value={fileSize}
                onChange={(e) => setFileSize(parseFloat(e.target.value) || 0)}
                aria-label="Download file size"
                className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink font-bold text-center text-xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
              />
            </div>

            <div>
              <label htmlFor="data-download-unit" className="block text-xs font-semibold text-text-muted mb-2">Size Unit</label>
              <select
                id="data-download-unit"
                value={fileUnit}
                onChange={(e) => setFileUnit(e.target.value as DataUnit)}
                className="w-full px-4 py-3 rounded-2xl bg-field text-ink text-sm font-semibold outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all cursor-pointer"
              >
                <option value="MB">Megabytes (MB)</option>
                <option value="GB">Gigabytes (GB)</option>
                <option value="TB">Terabytes (TB)</option>
              </select>
            </div>

            <div>
              <label htmlFor="data-download-speed" className="block text-xs font-semibold text-text-muted mb-2">Internet Speed (Mbps)</label>
              <input
                id="data-download-speed"
                type="number"
                step="10"
                min="1"
                value={speedMbps}
                onChange={(e) => setSpeedMbps(parseFloat(e.target.value) || 1)}
                aria-label="Internet speed in Megabits per second"
                className="w-full px-4 py-2.5 rounded-2xl bg-field text-ink font-bold text-center text-xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all"
              />
            </div>
          </div>

          {/* Quick Speed Presets */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-text-muted font-medium mr-2">Presets:</span>
            {[
              { label: '25 Mbps (DSL)', val: 25 },
              { label: '100 Mbps (Cable)', val: 100 },
              { label: '300 Mbps (Fast)', val: 300 },
              { label: '1 Gbps (Fiber)', val: 1000 },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setSpeedMbps(p.val)}
                className="px-3 py-1 rounded-full text-xs bg-field hover:bg-hairline text-ink font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-canvas-soft border border-hairline mb-6">
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
              Estimated Transfer Duration
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                {downloadResult.formatted_time}
              </span>
              <span className="text-sm font-semibold text-accent">
                @ {speedMbps} Megabits/s
              </span>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Actual file transfer throughput: <span className="font-bold text-ink">{(speedMbps / 8).toFixed(1)} MB/s</span> (Megabytes per second, 8 bits = 1 Byte)
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Total Seconds</span>
              <p className="text-2xl font-bold text-ink mt-1">{downloadResult.total_seconds} s</p>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Actual Speed (MB/s)</span>
              <p className="text-2xl font-bold text-ink mt-1">{(speedMbps / 8).toFixed(1)} MB/s</p>
            </div>
            <div className="p-4 rounded-2xl bg-field text-center">
              <span className="text-[10px] uppercase text-text-muted font-semibold">Total Raw Bits</span>
              <p className="text-2xl font-bold text-ink mt-1 truncate">{(result.bits).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-hairline-soft">
        <p className="text-xs text-text-muted">
          Calculated according to IEEE 1541 and IEC 80000-13 standards.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            aria-live="polite"
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {saved ? '✓ Saved to Card' : 'Save to Size Card'}
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
