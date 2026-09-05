import React from 'react';
import { Badge } from './Badge';
import { cn } from '../utils/cn';

/**
 * SectionHeader Component
 * Editorial section header with optional badge, bold title, and generous whitespace
 */
export function SectionHeader({
  badge,
  badgeVariant = 'neutral',
  title,
  subtitle,
  align = 'center', // 'left' | 'center'
  className = '',
}) {
  const isCenter = align === 'center';

  return (
    <div
      className={cn(
        'max-w-3xl mb-12 sm:mb-16',
        isCenter ? 'mx-auto text-center items-center' : 'text-left items-start',
        'flex flex-col',
        className
      )}
    >
      {badge && (
        <div className="mb-4">
          <Badge variant={badgeVariant} size="sm">
            {badge}
          </Badge>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
