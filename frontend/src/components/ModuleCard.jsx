import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { Badge } from './Badge';
import { cn } from '../utils/cn';

/**
 * ModuleCard Component
 * Independent policy domain cards with minimal vector iconography and metric indicators
 */
export function ModuleCard({
  to,
  icon: Icon,
  domainCode = 'DOM-01',
  badgeText = 'Independent Subsystem',
  title,
  description,
  metrics = [],
  ctaText = 'Open Simulator →',
  className = '',
}) {
  return (
    <Link
      to={to}
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl p-7 sm:p-9',
        'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
        'shadow-soft-sm hover:shadow-soft-md transition-all duration-200',
        className
      )}
    >
      <div>
        {/* Header row: Icon & Domain Code */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white group-hover:text-ai-600 group-hover:border-ai-200 dark:group-hover:border-ai-500/40 transition-colors duration-200">
            {Icon && <Icon className="w-6 h-6 stroke-[1.75]" />}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{domainCode}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            <Badge variant="neutral" size="sm">
              {badgeText}
            </Badge>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-ai-700 dark:group-hover:text-ai-400 transition-colors duration-200 mb-3 tracking-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
          {description}
        </p>

        {/* Metrics Preview */}
        {metrics.length > 0 && (
          <div className="pt-5 border-t border-slate-100 dark:border-slate-800 mb-6">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Modeled Vectors
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {metrics.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-ai-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-ai-600 dark:group-hover:text-ai-400 transition-colors flex items-center gap-2">
          <span>{ctaText.replace('→', '')}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Lock className="w-3 h-3 text-slate-400" />
          Isolated Math
        </span>
      </div>
    </Link>
  );
}

export default ModuleCard;
