import React from 'react';
import { cn } from '../utils/cn';

/**
 * StatusIndicator Component
 * Renders an institutional status badge with pulsing health dot
 */
export function StatusIndicator({ status = 'connected', label, className = '' }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          dotClass: 'bg-emerald-400',
          pulseClass: 'bg-emerald-400/40',
          textClass: 'text-emerald-300',
          borderClass: 'border-emerald-500/20 bg-emerald-950/30',
          defaultText: 'System Operational',
        };
      case 'checking':
        return {
          dotClass: 'bg-amber-400',
          pulseClass: 'bg-amber-400/40',
          textClass: 'text-amber-300',
          borderClass: 'border-amber-500/20 bg-amber-950/30',
          defaultText: 'Connecting Engine...',
        };
      case 'disconnected':
      default:
        return {
          dotClass: 'bg-rose-400',
          pulseClass: 'bg-rose-400/40',
          textClass: 'text-rose-300',
          borderClass: 'border-rose-500/20 bg-rose-950/30',
          defaultText: 'Engine Offline',
        };
    }
  };

  const config = getStatusConfig();
  const displayText = label || config.defaultText;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm transition-all',
        config.borderClass,
        config.textClass,
        className
      )}
      title={`Backend Status: ${displayText}`}
    >
      <span className="relative flex h-2 w-2">
        {status === 'connected' && (
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.pulseClass)} />
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', config.dotClass)} />
      </span>
      <span className="tracking-wide font-mono text-[11px]">{displayText}</span>
    </div>
  );
}

export default StatusIndicator;
