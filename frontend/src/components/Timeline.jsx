import React from 'react';
import { cn } from '../utils/cn';

/**
 * Timeline Component
 * 4-step policy workflow pipeline with light/dark contrast
 */
export function Timeline({ steps = [], className = '' }) {
  const defaultSteps = [
    {
      num: '01',
      title: 'DEFINE',
      desc: 'Set the policy intervention and assumptions.',
      sub: 'Specify baseline parameters, fleet volumes, fiscal brackets, or route frequencies.',
    },
    {
      num: '02',
      title: 'SIMULATE',
      desc: 'Calculate measurable outcomes using deterministic models.',
      sub: 'Run pure numerical modeling without LLM hallucination in raw figures.',
    },
    {
      num: '03',
      title: 'STRESS-TEST',
      desc: 'Test the policy under different scenarios and assumptions.',
      sub: 'Subject assumptions to demand surges, inflationary shocks, and supply constraints.',
    },
    {
      num: '04',
      title: 'DECIDE',
      desc: 'Understand risks, trade-offs and AI-assisted insights.',
      sub: 'Review synthesized trade-off analysis before committing municipal or state capital.',
    },
  ];

  const activeSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className={cn('relative', className)}>
      {/* Desktop connecting line */}
      <div className="hidden lg:block absolute top-7 left-12 right-12 h-[2px] bg-slate-200 dark:bg-slate-800 z-0" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {activeSteps.map((step, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-soft-xs hover:shadow-soft-sm transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-sm text-slate-900 dark:text-white group-hover:bg-ai-50 dark:group-hover:bg-ai-950 group-hover:border-ai-200 dark:group-hover:border-ai-800 group-hover:text-ai-700 dark:group-hover:text-ai-300 transition-colors shadow-soft-xs">
                  {step.num}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Stage {idx + 1}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight group-hover:text-ai-700 dark:group-hover:text-ai-400 transition-colors">
                {step.title}
              </h4>

              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 leading-snug">
                {step.desc}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {step.sub}
              </p>
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500">
              <span>Auditable Pipeline</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-ai-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
