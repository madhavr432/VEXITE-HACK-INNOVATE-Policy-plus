import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Bus PolicySlider Component
 * Dedicated slider for fleet expansion targets with prominent percentage display,
 * custom slider track, and discrete tick indicators.
 */
export function PolicySlider({
  label = 'Fleet Increase',
  value = 20,
  onChange,
  min = 0,
  max = 50,
  step = 5,
  helpText = 'Proposed fleet expansion target',
  className = '',
}) {
  const numericVal = parseInt(value, 10) || 0;
  const percentagePos = ((numericVal - min) / (max - min)) * 100;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase">
            Target
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-mono font-extrabold bg-policy-50 dark:bg-policy-950/60 text-policy-700 dark:text-policy-300 border border-policy-200/80 dark:border-policy-800/80 shadow-soft-xs">
            {numericVal > 0 ? `+${numericVal}%` : '0%'}
          </span>
        </div>
      </div>

      <div className="relative pt-1 pb-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={numericVal}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={numericVal}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-policy-600 dark:accent-policy-400 focus:outline-none focus:ring-2 focus:ring-policy-500/20"
          style={{
            background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${percentagePos}%, #e2e8f0 ${percentagePos}%, #e2e8f0 100%)`,
          }}
        />

        {/* Ticks */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1 px-0.5">
          <span>0%</span>
          <span>10%</span>
          <span>20%</span>
          <span>30%</span>
          <span>40%</span>
          <span>50%</span>
        </div>
      </div>

      {helpText && (
        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          {helpText}
        </span>
      )}
    </div>
  );
}

export default PolicySlider;
