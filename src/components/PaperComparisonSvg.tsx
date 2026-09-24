import React, { useState } from 'react';
import type { PaperSizeResult } from '../lib/converters/types';
import { comparePaperSizes } from '../lib/converters/paperSize';

interface Props {
  sizeA: PaperSizeResult;
  sizeB: PaperSizeResult;
  initialMode?: 'side-by-side' | 'overlay';
  showControls?: boolean;
}

export default function PaperComparisonSvg({
  sizeA,
  sizeB,
  initialMode = 'side-by-side',
  showControls = true,
}: Props) {
  const [mode, setMode] = useState<'side-by-side' | 'overlay'>(initialMode);
  const comparison = comparePaperSizes(sizeA, sizeB);

  const wA = sizeA.width_mm;
  const hA = sizeA.height_mm;
  const wB = sizeB.width_mm;
  const hB = sizeB.height_mm;

  // ViewBox calculations
  const pad = 60;
  const gap = 50;

  // Side-by-side dimensions
  const sbsContentW = wA + gap + wB;
  const sbsContentH = Math.max(hA, hB);
  const sbsViewW = sbsContentW + pad * 2;
  const sbsViewH = sbsContentH + pad * 2 + 30; // Extra room for bottom labels

  // Overlay dimensions
  const ovrContentW = Math.max(wA, wB);
  const ovrContentH = Math.max(hA, hB);
  const ovrViewW = ovrContentW + pad * 2 + 50;
  const ovrViewH = ovrContentH + pad * 2 + 50;

  const currentViewW = mode === 'side-by-side' ? sbsViewW : ovrViewW;
  const currentViewH = mode === 'side-by-side' ? sbsViewH : ovrViewH;

  // Center alignment for bottom baseline
  const aY_sbs = pad + (sbsContentH - hA);
  const bY_sbs = pad + (sbsContentH - hB);
  const aX_sbs = pad;
  const bX_sbs = pad + wA + gap;

  // Overlay origins (aligned to bottom-left corner for natural visual stacking)
  const aY_ovr = pad + (ovrContentH - hA);
  const bY_ovr = pad + (ovrContentH - hB);
  const aX_ovr = pad;
  const bX_ovr = pad;

  return (
    <div className="rounded-3xl bg-canvas border border-hairline-soft p-5 sm:p-7 shadow-xs">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-hairline-soft">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
              Proportional Scale Visualizer
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-ink">
            {sizeA.name} <span className="text-text-muted font-normal">vs</span> {sizeB.name} Visual Comparison
          </h3>
        </div>

        {showControls && (
          <div role="radiogroup" aria-label="Visualizer display mode" className="flex items-center bg-canvas-soft p-1 rounded-full border border-hairline-soft self-start sm:self-auto">
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'side-by-side'}
              onClick={() => setMode('side-by-side')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                mode === 'side-by-side'
                  ? 'bg-canvas text-ink shadow-2xs'
                  : 'text-text-muted hover:text-ink'
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'overlay'}
              onClick={() => setMode('overlay')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                mode === 'overlay'
                  ? 'bg-canvas text-ink shadow-2xs'
                  : 'text-text-muted hover:text-ink'
              }`}
            >
              Overlaid Comparison
            </button>
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full my-6 bg-canvas-soft/40 rounded-2xl p-4 sm:p-6 border border-hairline-soft flex items-center justify-center min-h-[300px] overflow-hidden">
        <svg
          viewBox={`0 0 ${currentViewW} ${currentViewH}`}
          className="w-full max-h-[460px] select-none transition-all duration-300"
          style={{ maxHeight: '460px' }}
          role="img"
          aria-label={`Visual comparison of ${sizeA.name} and ${sizeB.name}`}
        >
          <defs>
            {/* Subtle Grid Pattern */}
            <pattern id="comparison-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="0.8" />
            </pattern>
            {/* Drop Shadow for Paper Sheets */}
            <filter id="paper-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
            </filter>
            {/* Markers for dimension arrows */}
            <marker id="arrow-start" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 10 0 L 0 5 L 10 10 z" fill="currentColor" fillOpacity="0.6" />
            </marker>
            <marker id="arrow-end" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" fillOpacity="0.6" />
            </marker>
          </defs>

          {/* Background Grid */}
          <rect width={currentViewW} height={currentViewH} fill="url(#comparison-grid)" />

          {mode === 'side-by-side' ? (
            /* --- SIDE-BY-SIDE MODE --- */
            <g className="transition-all duration-300">
              {/* Baseline ground */}
              <line
                x1={pad - 20}
                y1={pad + sbsContentH}
                x2={pad + sbsContentW + 20}
                y2={pad + sbsContentH}
                stroke="currentColor"
                strokeOpacity="0.15"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* SHEET A (Left) */}
              <g>
                <rect
                  x={aX_sbs}
                  y={aY_sbs}
                  width={wA}
                  height={hA}
                  rx="6"
                  fill="var(--color-canvas, #ffffff)"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  filter="url(#paper-shadow)"
                  className="transition-all duration-300"
                />
                {/* Subtle Sheet A tint fill */}
                <rect
                  x={aX_sbs}
                  y={aY_sbs}
                  width={wA}
                  height={hA}
                  rx="6"
                  fill="#2563eb"
                  fillOpacity="0.08"
                />
                {/* Dog-ear corner fold accent */}
                <path
                  d={`M ${aX_sbs + wA - 14} ${aY_sbs} L ${aX_sbs + wA} ${aY_sbs + 14} L ${aX_sbs + wA - 14} ${aY_sbs + 14} Z`}
                  fill="#2563eb"
                  fillOpacity="0.25"
                />

                {/* Name & Dimensions Inside Sheet A */}
                <text
                  x={aX_sbs + wA / 2}
                  y={aY_sbs + hA / 2 - 14}
                  textAnchor="middle"
                  fill="var(--color-ink, #111827)"
                  fontSize={Math.max(14, Math.min(22, wA * 0.1))}
                  fontWeight="bold"
                >
                  {sizeA.name}
                </text>
                <text
                  x={aX_sbs + wA / 2}
                  y={aY_sbs + hA / 2 + 10}
                  textAnchor="middle"
                  fill="#2563eb"
                  fontSize={Math.max(11, Math.min(15, wA * 0.07))}
                  fontWeight="600"
                >
                  {sizeA.width_mm} × {sizeA.height_mm} mm
                </text>
                <text
                  x={aX_sbs + wA / 2}
                  y={aY_sbs + hA / 2 + 28}
                  textAnchor="middle"
                  fill="var(--color-text-muted, #6b7280)"
                  fontSize={Math.max(10, Math.min(13, wA * 0.06))}
                >
                  ({sizeA.width_in} × {sizeA.height_in} in)
                </text>

                {/* Aspect Ratio Badge */}
                <text
                  x={aX_sbs + wA / 2}
                  y={aY_sbs + hA - 16}
                  textAnchor="middle"
                  fill="var(--color-text-faint, #9ca3af)"
                  fontSize={Math.max(9, Math.min(12, wA * 0.05))}
                  fontWeight="500"
                >
                  Ratio {sizeA.aspect_ratio}
                </text>

                {/* Sheet A Width Dimension Arrow (Top) */}
                <line
                  x1={aX_sbs}
                  y1={aY_sbs - 14}
                  x2={aX_sbs + wA}
                  y2={aY_sbs - 14}
                  stroke="#2563eb"
                  strokeWidth="1.5"
                  markerStart="url(#arrow-start)"
                  markerEnd="url(#arrow-end)"
                />
                <text
                  x={aX_sbs + wA / 2}
                  y={aY_sbs - 22}
                  textAnchor="middle"
                  fill="#2563eb"
                  fontSize="11"
                  fontWeight="600"
                >
                  W: {sizeA.width_mm} mm ({sizeA.width_in}″)
                </text>

                {/* Sheet A Height Dimension Arrow (Left) */}
                <line
                  x1={aX_sbs - 14}
                  y1={aY_sbs}
                  x2={aX_sbs - 14}
                  y2={aY_sbs + hA}
                  stroke="#2563eb"
                  strokeWidth="1.5"
                  markerStart="url(#arrow-start)"
                  markerEnd="url(#arrow-end)"
                />
                <text
                  x={aX_sbs - 22}
                  y={aY_sbs + hA / 2}
                  textAnchor="middle"
                  fill="#2563eb"
                  fontSize="11"
                  fontWeight="600"
                  transform={`rotate(-90 ${aX_sbs - 22} ${aY_sbs + hA / 2})`}
                >
                  H: {sizeA.height_mm} mm ({sizeA.height_in}″)
                </text>
              </g>

              {/* SHEET B (Right) */}
              <g>
                <rect
                  x={bX_sbs}
                  y={bY_sbs}
                  width={wB}
                  height={hB}
                  rx="6"
                  fill="var(--color-canvas, #ffffff)"
                  stroke="#8b5cf6"
                  strokeWidth="2.5"
                  filter="url(#paper-shadow)"
                  className="transition-all duration-300"
                />
                {/* Sheet B subtle purple tint */}
                <rect
                  x={bX_sbs}
                  y={bY_sbs}
                  width={wB}
                  height={hB}
                  rx="6"
                  fill="#8b5cf6"
                  fillOpacity="0.08"
                />
                {/* Dog-ear corner fold accent */}
                <path
                  d={`M ${bX_sbs + wB - 14} ${bY_sbs} L ${bX_sbs + wB} ${bY_sbs + 14} L ${bX_sbs + wB - 14} ${bY_sbs + 14} Z`}
                  fill="#8b5cf6"
                  fillOpacity="0.25"
                />

                {/* Name & Dimensions Inside Sheet B */}
                <text
                  x={bX_sbs + wB / 2}
                  y={bY_sbs + hB / 2 - 14}
                  textAnchor="middle"
                  fill="var(--color-ink, #111827)"
                  fontSize={Math.max(14, Math.min(22, wB * 0.1))}
                  fontWeight="bold"
                >
                  {sizeB.name}
                </text>
                <text
                  x={bX_sbs + wB / 2}
                  y={bY_sbs + hB / 2 + 10}
                  textAnchor="middle"
                  fill="#8b5cf6"
                  fontSize={Math.max(11, Math.min(15, wB * 0.07))}
                  fontWeight="600"
                >
                  {sizeB.width_mm} × {sizeB.height_mm} mm
                </text>
                <text
                  x={bX_sbs + wB / 2}
                  y={bY_sbs + hB / 2 + 28}
                  textAnchor="middle"
                  fill="var(--color-text-muted, #6b7280)"
                  fontSize={Math.max(10, Math.min(13, wB * 0.06))}
                >
                  ({sizeB.width_in} × {sizeB.height_in} in)
                </text>

                {/* Aspect Ratio Badge */}
                <text
                  x={bX_sbs + wB / 2}
                  y={bY_sbs + hB - 16}
                  textAnchor="middle"
                  fill="var(--color-text-faint, #9ca3af)"
                  fontSize={Math.max(9, Math.min(12, wB * 0.05))}
                  fontWeight="500"
                >
                  Ratio {sizeB.aspect_ratio}
                </text>

                {/* Sheet B Width Dimension Arrow (Top) */}
                <line
                  x1={bX_sbs}
                  y1={bY_sbs - 14}
                  x2={bX_sbs + wB}
                  y2={bY_sbs - 14}
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                  markerStart="url(#arrow-start)"
                  markerEnd="url(#arrow-end)"
                />
                <text
                  x={bX_sbs + wB / 2}
                  y={bY_sbs - 22}
                  textAnchor="middle"
                  fill="#8b5cf6"
                  fontSize="11"
                  fontWeight="600"
                >
                  W: {sizeB.width_mm} mm ({sizeB.width_in}″)
                </text>

                {/* Sheet B Height Dimension Arrow (Right) */}
                <line
                  x1={bX_sbs + wB + 14}
                  y1={bY_sbs}
                  x2={bX_sbs + wB + 14}
                  y2={bY_sbs + hB}
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                  markerStart="url(#arrow-start)"
                  markerEnd="url(#arrow-end)"
                />
                <text
                  x={bX_sbs + wB + 22}
                  y={bY_sbs + hB / 2}
                  textAnchor="middle"
                  fill="#8b5cf6"
                  fontSize="11"
                  fontWeight="600"
                  transform={`rotate(90 ${bX_sbs + wB + 22} ${bY_sbs + hB / 2})`}
                >
                  H: {sizeB.height_mm} mm ({sizeB.height_in}″)
                </text>
              </g>
            </g>
          ) : (
            /* --- OVERLAY MODE --- */
            <g className="transition-all duration-300">
              {/* Baseline alignment */}
              <line
                x1={pad - 20}
                y1={pad + ovrContentH}
                x2={pad + ovrContentW + 40}
                y2={pad + ovrContentH}
                stroke="currentColor"
                strokeOpacity="0.15"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Render larger sheet first in background, then smaller */}
              {/* Sheet B (Layer 1) */}
              <rect
                x={bX_ovr}
                y={bY_ovr}
                width={wB}
                height={hB}
                rx="6"
                fill="#8b5cf6"
                fillOpacity="0.18"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeDasharray={wA > wB || hA > hB ? '5 5' : undefined}
                filter="url(#paper-shadow)"
              />

              {/* Sheet A (Layer 2) */}
              <rect
                x={aX_ovr}
                y={aY_ovr}
                width={wA}
                height={hA}
                rx="6"
                fill="#2563eb"
                fillOpacity="0.22"
                stroke="#2563eb"
                strokeWidth="2.5"
              />

              {/* Overhang Indicators */}
              {/* Height Difference Marker */}
              {Math.abs(hA - hB) > 0.5 && (
                <g>
                  {hA > hB ? (
                    // Sheet A is taller (overhang at top)
                    <g>
                      <line
                        x1={aX_ovr + Math.min(wA, wB) + 16}
                        y1={aY_ovr}
                        x2={aX_ovr + Math.min(wA, wB) + 16}
                        y2={bY_ovr}
                        stroke="#2563eb"
                        strokeWidth="2"
                        markerStart="url(#arrow-start)"
                        markerEnd="url(#arrow-end)"
                      />
                      <text
                        x={aX_ovr + Math.min(wA, wB) + 26}
                        y={(aY_ovr + bY_ovr) / 2 + 4}
                        fill="#2563eb"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        +{Math.abs(comparison.heightDiffMm)} mm ({Math.abs(comparison.heightDiffIn)}″) taller ({sizeA.name})
                      </text>
                    </g>
                  ) : (
                    // Sheet B is taller
                    <g>
                      <line
                        x1={bX_ovr + Math.min(wA, wB) + 16}
                        y1={bY_ovr}
                        x2={bX_ovr + Math.min(wA, wB) + 16}
                        y2={aY_ovr}
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        markerStart="url(#arrow-start)"
                        markerEnd="url(#arrow-end)"
                      />
                      <text
                        x={bX_ovr + Math.min(wA, wB) + 26}
                        y={(aY_ovr + bY_ovr) / 2 + 4}
                        fill="#8b5cf6"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        +{Math.abs(comparison.heightDiffMm)} mm ({Math.abs(comparison.heightDiffIn)}″) taller ({sizeB.name})
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* Width Difference Marker (Bottom overhang) */}
              {Math.abs(wA - wB) > 0.5 && (
                <g>
                  {wB > wA ? (
                    // Sheet B is wider (protrudes on right)
                    <g>
                      <line
                        x1={aX_ovr + wA}
                        y1={pad + ovrContentH + 16}
                        x2={bX_ovr + wB}
                        y2={pad + ovrContentH + 16}
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        markerStart="url(#arrow-start)"
                        markerEnd="url(#arrow-end)"
                      />
                      <text
                        x={(aX_ovr + wA + bX_ovr + wB) / 2}
                        y={pad + ovrContentH + 30}
                        textAnchor="middle"
                        fill="#8b5cf6"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        +{Math.abs(comparison.widthDiffMm)} mm ({Math.abs(comparison.widthDiffIn)}″) wider ({sizeB.name})
                      </text>
                    </g>
                  ) : (
                    // Sheet A is wider
                    <g>
                      <line
                        x1={bX_ovr + wB}
                        y1={pad + ovrContentH + 16}
                        x2={aX_ovr + wA}
                        y2={pad + ovrContentH + 16}
                        stroke="#2563eb"
                        strokeWidth="2"
                        markerStart="url(#arrow-start)"
                        markerEnd="url(#arrow-end)"
                      />
                      <text
                        x={(aX_ovr + wA + bX_ovr + wB) / 2}
                        y={pad + ovrContentH + 30}
                        textAnchor="middle"
                        fill="#2563eb"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        +{Math.abs(comparison.widthDiffMm)} mm ({Math.abs(comparison.widthDiffIn)}″) wider ({sizeA.name})
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* Center legend badge */}
              <g transform={`translate(${pad + 16}, ${pad + 24})`}>
                <rect x="0" y="0" width="160" height="44" rx="8" fill="var(--color-canvas, #ffffff)" fillOpacity="0.9" stroke="currentColor" strokeOpacity="0.1" />
                <circle cx="16" cy="15" r="5" fill="#2563eb" />
                <text x="28" y="19" fontSize="11" fontWeight="bold" fill="var(--color-ink, #111827)">{sizeA.name}</text>
                <circle cx="16" cy="31" r="5" fill="#8b5cf6" />
                <text x="28" y="35" fontSize="11" fontWeight="bold" fill="var(--color-ink, #111827)">{sizeB.name}</text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Delta Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
        <div className="p-3.5 rounded-2xl bg-canvas-soft border border-hairline-soft">
          <span className="text-[11px] font-semibold text-text-muted block">Height Delta</span>
          <span className={`text-base font-bold ${comparison.heightDiffMm >= 0 ? 'text-accent' : 'text-purple-600'}`}>
            {comparison.heightDiffMm > 0 ? `+${comparison.heightDiffMm} mm` : comparison.heightDiffMm < 0 ? `${comparison.heightDiffMm} mm` : 'Identical'}
          </span>
          <span className="text-[11px] text-text-faint block mt-0.5">
            {comparison.heightDiffIn > 0 ? `+${comparison.heightDiffIn}″` : comparison.heightDiffIn < 0 ? `${comparison.heightDiffIn}″` : '0″'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-canvas-soft border border-hairline-soft">
          <span className="text-[11px] font-semibold text-text-muted block">Width Delta</span>
          <span className={`text-base font-bold ${comparison.widthDiffMm >= 0 ? 'text-accent' : 'text-purple-600'}`}>
            {comparison.widthDiffMm > 0 ? `+${comparison.widthDiffMm} mm` : comparison.widthDiffMm < 0 ? `${comparison.widthDiffMm} mm` : 'Identical'}
          </span>
          <span className="text-[11px] text-text-faint block mt-0.5">
            {comparison.widthDiffIn > 0 ? `+${comparison.widthDiffIn}″` : comparison.widthDiffIn < 0 ? `${comparison.widthDiffIn}″` : '0″'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-canvas-soft border border-hairline-soft">
          <span className="text-[11px] font-semibold text-text-muted block">Surface Area Diff</span>
          <span className="text-base font-bold text-ink">
            {Math.abs(comparison.areaDiffPercent)}%
          </span>
          <span className="text-[11px] text-text-faint block mt-0.5">
            {comparison.isALargerArea ? `${sizeA.name} is larger` : comparison.areaDiffPercent === 0 ? 'Equal area' : `${sizeB.name} is larger`}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-canvas-soft border border-hairline-soft">
          <span className="text-[11px] font-semibold text-text-muted block">Fit Scale Ratio</span>
          <span className="text-base font-bold text-ink">
            {comparison.scaleToFitPercent}%
          </span>
          <span className="text-[11px] text-text-faint block mt-0.5">
            To fit {sizeB.name} on {sizeA.name}
          </span>
        </div>
      </div>
    </div>
  );
}
