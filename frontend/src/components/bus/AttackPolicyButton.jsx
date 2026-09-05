import React from 'react';
import { Zap, Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '../Button';
import { cn } from '../../utils/cn';

/**
 * AttackPolicyButton Component
 *
 * Prominent action button that triggers the deterministic stress test / attack
 * against the currently selected policy configuration.
 */
export function AttackPolicyButton({
  onClick,
  isLoading = false,
  disabled = false,
  className = '',
  size = 'md',
}) {
  return (
    <div className={cn('relative group inline-block', className)}>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        size={size}
        variant="accent"
        icon={isLoading ? Loader2 : Zap}
        className={cn(
          'relative font-bold shadow-soft-sm hover:shadow-soft-md transition-all duration-200',
          'bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white border-0',
          isLoading && 'opacity-90 cursor-wait'
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Attacking Policy...</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span>⚡ Attack My Policy</span>
          </span>
        )}
      </Button>
    </div>
  );
}

export default AttackPolicyButton;
