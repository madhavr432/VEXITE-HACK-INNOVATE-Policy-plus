import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Bus PolicyInput Component
 * High-precision numeric input with inline validation, units, prefixes, and helper context.
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
  error,
  placeholder,
  disabled = false,
  className = '',
  id,
}) {
  const inputId = id || `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-800 dark:text-slate-200 tracking-tight"
        >
          {label}
        </label>
        {suffix && (
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {suffix}
          </span>
        )}
      </div>

      <div
        className={cn(
          'relative rounded-xl border bg-white dark:bg-slate-900 transition-all duration-150 shadow-soft-xs',
          error
            ? 'border-rose-400 dark:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20'
            : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-ai-500 dark:focus-within:border-ai-400 focus-within:ring-2 focus-within:ring-ai-500/10'
        )}
      >
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-slate-500 dark:text-slate-400 select-none">
            {prefix}
          </span>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none disabled:bg-slate-50 dark:disabled:bg-slate-800/60 disabled:text-slate-400 font-mono tracking-tight',
            prefix ? 'pl-8' : '',
            suffix ? 'pr-12' : ''
          )}
        />
      </div>

      {error ? (
        <div className="flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 animate-in fade-in duration-150">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </div>
      ) : helpText ? (
        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          {helpText}
        </span>
      ) : null}
    </div>
  );
}

export default PolicyInput;
