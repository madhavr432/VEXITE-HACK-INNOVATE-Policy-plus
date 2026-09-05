import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

/**
 * AIInsight Component
 * Floating AI card displaying synthesized policy intelligence in light and dark
 */
export function AIInsight({
  title = 'AI POLICY INSIGHT',
  highlight = '20% fleet increase',
  insight = 'provides a strong waiting-time improvement, but operating costs rise faster beyond the 20–25% range.',
  secondary = 'Diminishing marginal returns observed after 125 active units.',
  floating = false,
  className = '',
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-ai-200/90 dark:border-ai-500/40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-5',
        'shadow-ai-glow transition-all duration-300',
        floating && 'hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Purple AI icon container */}
        <div className="w-8 h-8 rounded-xl bg-ai-50 dark:bg-ai-950/80 border border-ai-200 dark:border-ai-800 text-ai-600 dark:text-ai-400 flex items-center justify-center shrink-0 shadow-soft-xs">
          <Sparkles className="w-4 h-4" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-ai-700 dark:text-ai-300 uppercase">
              {title}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-ai-500 animate-pulse" />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            A <strong className="font-semibold text-slate-900 dark:text-white bg-ai-50 dark:bg-ai-950/70 px-1 py-0.5 rounded border border-ai-100 dark:border-ai-800">{highlight}</strong> {insight}
          </p>

          {secondary && (
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
              {secondary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIInsight;
