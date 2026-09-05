import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from './Badge';
import { cn } from '../utils/cn';

/**
 * PageHeader Component
 * Unified top header for product workspaces with breadcrumbs, title, and engine readiness
 */
export function PageHeader({
  title,
  subtitle,
  status = 'Simulation Engine Ready',
  statusVariant = 'positive',
  breadcrumbs = [],
  actions,
  className = '',
}) {
  return (
    <div className={cn('mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800', className)}>
      {/* Breadcrumb line */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 mb-3" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Policy+
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-900 dark:text-white font-semibold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {status && (
              <Badge variant={statusVariant} size="sm" dot>
                {status}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
