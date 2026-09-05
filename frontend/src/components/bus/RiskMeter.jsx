import React from 'react';
import { Card, CardHeader, CardContent } from '../Card';

export function RiskMeter({ score = 0, riskLevel = 'moderate', riskLevelLabel = 'Moderate Risk' }) {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, Number(score) || 0));

  // Range segments
  const segments = [
    { label: 'Low', range: '0–29', max: 29, color: 'bg-emerald-500', bgLight: 'bg-emerald-100 dark:bg-emerald-950/40', textColor: 'text-emerald-700 dark:text-emerald-300' },
    { label: 'Moderate', range: '30–59', max: 59, color: 'bg-amber-500', bgLight: 'bg-amber-100 dark:bg-amber-950/40', textColor: 'text-amber-700 dark:text-amber-300' },
    { label: 'High', range: '60–79', max: 79, color: 'bg-orange-500', bgLight: 'bg-orange-100 dark:bg-orange-950/40', textColor: 'text-orange-700 dark:text-orange-300' },
    { label: 'Critical', range: '80–100', max: 100, color: 'bg-rose-500', bgLight: 'bg-rose-100 dark:bg-rose-950/40', textColor: 'text-rose-700 dark:text-rose-300' },
  ];

  return (
    <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Policy Risk Gauge
            </h4>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Risk Calibration Spectrum
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-lg font-bold text-slate-900 dark:text-white">{clampedScore}</span>
            <span className="text-xs text-slate-400"> / 100</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-6 px-5 sm:px-6">
        {/* Horizontal Meter Bar with 4 Segments */}
        <div className="relative pt-6 pb-2">
          {/* Pointer indicator */}
          <div
            className="absolute top-0 -translate-x-1/2 transition-all duration-500 ease-out flex flex-col items-center z-10"
            style={{ left: `${clampedScore}%` }}
          >
            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm whitespace-nowrap">
              {clampedScore} • {riskLevelLabel}
            </span>
            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900 dark:border-t-white mt-0.5" />
          </div>

          {/* Meter Track */}
          <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 p-0.5 gap-1 shadow-inner">
            {/* Low Segment: 0 to 29% (width: 29%) */}
            <div
              className="h-full rounded-l-full bg-emerald-400 dark:bg-emerald-500/80 transition-opacity"
              style={{ width: '29%' }}
              title="Low Risk: 0-29"
            />
            {/* Moderate Segment: 30 to 59% (width: 30%) */}
            <div
              className="h-full bg-amber-400 dark:bg-amber-500/80 transition-opacity"
              style={{ width: '30%' }}
              title="Moderate Risk: 30-59"
            />
            {/* High Segment: 60 to 79% (width: 20%) */}
            <div
              className="h-full bg-orange-400 dark:bg-orange-500/80 transition-opacity"
              style={{ width: '20%' }}
              title="High Risk: 60-79"
            />
            {/* Critical Segment: 80 to 100% (width: 21%) */}
            <div
              className="h-full rounded-r-full bg-rose-400 dark:bg-rose-500/80 transition-opacity"
              style={{ width: '21%' }}
              title="Critical Risk: 80-100"
            />
          </div>

          {/* Range Scale Markers */}
          <div className="relative w-full text-[10px] font-mono text-slate-400 mt-2 flex justify-between">
            <span>0</span>
            <span className="absolute left-[29%] -translate-x-1/2">29</span>
            <span className="absolute left-[59%] -translate-x-1/2">59</span>
            <span className="absolute left-[79%] -translate-x-1/2">79</span>
            <span>100</span>
          </div>
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-2">
          {segments.map((seg) => {
            const isActive =
              (seg.label === 'Low' && clampedScore <= 29) ||
              (seg.label === 'Moderate' && clampedScore >= 30 && clampedScore <= 59) ||
              (seg.label === 'High' && clampedScore >= 60 && clampedScore <= 79) ||
              (seg.label === 'Critical' && clampedScore >= 80);

            return (
              <div
                key={seg.label}
                className={`rounded-xl p-2.5 transition-all ${
                  isActive
                    ? `${seg.bgLight} border border-current font-medium ring-1 ring-inset ${seg.textColor}`
                    : 'bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${seg.color}`} />
                  <span className="text-xs font-semibold">{seg.label}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                  Score {seg.range}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default RiskMeter;
