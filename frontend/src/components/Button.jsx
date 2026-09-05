import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

/**
 * Button Component
 * Editorial SaaS button with primary dark/light inverse, crisp secondary, and micro-interactions
 */
export function Button({
  children,
  to,
  href,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'disabled'
  size = 'md', // 'sm' | 'md' | 'lg'
  pill = false,
  icon: Icon,
  iconPosition = 'right',
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 focus:ring-offset-2';

  const shapeStyles = pill ? 'rounded-full' : 'rounded-xl';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4.5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 shadow-soft-sm hover:shadow-soft-md active:translate-y-[0.5px]',
    secondary: 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 dark:border-slate-700 shadow-soft-xs hover:shadow-soft-sm active:translate-y-[0.5px]',
    accent: 'bg-ai-600 hover:bg-ai-700 text-white shadow-soft-sm hover:shadow-ai-glow active:translate-y-[0.5px]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-soft-sm active:translate-y-[0.5px]',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
    disabled: 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-80',
  };

  const isActuallyDisabled = disabled || variant === 'disabled';
  const appliedVariant = isActuallyDisabled ? 'disabled' : variant;

  const combinedClasses = cn(
    baseStyles,
    shapeStyles,
    sizeStyles[size],
    variantStyles[appliedVariant],
    className
  );

  const iconElement = Icon ? (
    <Icon
      className={cn(
        'transition-transform duration-200 shrink-0',
        size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
        iconPosition === 'right' ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5'
      )}
    />
  ) : null;

  if (to && !isActuallyDisabled) {
    return (
      <Link to={to} className={cn(combinedClasses, 'group')} {...props}>
        {iconPosition === 'left' && iconElement}
        <span>{children}</span>
        {iconPosition === 'right' && iconElement}
      </Link>
    );
  }

  if (href && !isActuallyDisabled) {
    return (
      <a href={href} className={cn(combinedClasses, 'group')} {...props}>
        {iconPosition === 'left' && iconElement}
        <span>{children}</span>
        {iconPosition === 'right' && iconElement}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={isActuallyDisabled}
      onClick={isActuallyDisabled ? undefined : onClick}
      className={cn(combinedClasses, isActuallyDisabled ? '' : 'group')}
      {...props}
    >
      {iconPosition === 'left' && iconElement}
      <span>{children}</span>
      {iconPosition === 'right' && iconElement}
    </button>
  );
}

export default Button;
