import React from 'react';
import { cn } from '../utils/cn';

/**
 * PolicyInput Component
 * Precision form control for policy parameters and simulation constraints with dark mode support
 */
export function PolicyInput({
  label,
  value,
  onChange,
  type = 'number',
  prefix,
  suffix,
  min,
  max,
  step = 1,
  helpText,
  disabled = false,
  className = '',
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {suffix && (
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {suffix}
          </span>
        )}
      </div>

      <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-ai-500 dark:focus-within:border-ai-400 focus-within:ring-2 focus-within:ring-ai-500/10 transition-all shadow-soft-xs">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 dark:text-slate-400">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            'w-full bg-transparent px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-400 font-mono',
            prefix ? 'pl-8' : '',
            suffix ? 'pr-8' : ''
          )}
        />
      </div>

      {helpText && (
        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          {helpText}
        </span>
      )}
    </div>
  );
}

export default PolicyInput;
