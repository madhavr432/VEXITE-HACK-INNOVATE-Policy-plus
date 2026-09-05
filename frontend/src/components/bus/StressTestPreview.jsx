import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  Clock,
  Users,
  Banknote,
  Percent,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../Card';
import { Button } from '../Button';
import { ENVELOPE_SCENARIOS } from '../../data/bus/demoScenarios';
import { cn } from '../../utils/cn';

/**
 * StressTestPreview Component
 * Displays 3 bounds (Best, Expected, Stress) with demo metrics and interactive
 * stress-test preview trigger (visual simulation interaction).
 */
export function StressTestPreview({
  onSelectEnvelopeScenario,
  className = '',
}) {
  const [activeEnvelope, setActiveEnvelope] = useState('expected');
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [showStressAlert, setShowStressAlert] = useState(false);

  const handleRunStressTest = () => {
    setIsStressTesting(true);
    setShowStressAlert(false);

    setTimeout(() => {
      setIsStressTesting(false);
      setShowStressAlert(true);
      setActiveEnvelope('stress');
      if (onSelectEnvelopeScenario) {
        onSelectEnvelopeScenario('stress');
      }
    }, 700);
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Stress-Test Your Policy
            </h3>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              Scenario Envelope
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            See how the proposed policy could behave when assumptions change.
          </p>
        </div>

        <Button
          onClick={handleRunStressTest}
          size="sm"
          variant="accent"
          icon={Zap}
          disabled={isStressTesting}
          className="shrink-0 text-xs font-semibold shadow-soft-xs"
        >
          {isStressTesting ? 'Simulating Stress...' : 'Stress-Test →'}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Interactive feedback notice when stress test was triggered */}
        {showStressAlert && (
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3.5 flex items-start gap-2.5 animate-in fade-in duration-200">
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 dark:text-rose-200">
              <span className="font-bold">Stress-Test Preview Active:</span> Injected adverse scenario with +25% sudden commuter surge and depot fuel cost inflation.
              <span className="font-mono ml-1 text-[11px] text-rose-700 dark:text-rose-300 underline cursor-pointer" onClick={() => setShowStressAlert(false)}>
                Dismiss
              </span>
            </div>
          </div>
        )}

        {/* 3 Small Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {ENVELOPE_SCENARIOS.map((sc) => {
            const isSelected = activeEnvelope === sc.type;
            const borderColors = {
              best: 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-300',
              expected: 'border-sky-200 dark:border-sky-900/60 hover:border-sky-300',
              stress: 'border-rose-200 dark:border-rose-900/60 hover:border-rose-300',
            };
            const activeBg = {
              best: 'bg-emerald-50/40 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30',
              expected: 'bg-sky-50/40 dark:bg-sky-950/30 ring-1 ring-sky-500/30',
              stress: 'bg-rose-50/40 dark:bg-rose-950/30 ring-1 ring-rose-500/30',
            };

            return (
              <div
                key={sc.type}
                onClick={() => {
                  setActiveEnvelope(sc.type);
                  if (onSelectEnvelopeScenario) onSelectEnvelopeScenario(sc.type);
                }}
                className={cn(
                  'p-4 rounded-xl border transition-all duration-150 cursor-pointer text-left',
                  borderColors[sc.type],
                  isSelected ? activeBg[sc.type] : 'bg-white dark:bg-slate-900 shadow-soft-xs'
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{sc.icon}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {sc.title}
                    </span>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-policy-600 dark:text-policy-400" />
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mb-3">
                  {sc.description}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{sc.metrics.waitingTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{sc.metrics.ridership}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Banknote className="w-3 h-3 text-slate-400" />
                    <span>{sc.metrics.cost}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Percent className="w-3 h-3 text-slate-400" />
                    <span>{sc.metrics.utilization}</span>
                  </div>
                </div>

                <div className="mt-2 text-right">
                  <span
                    className={cn(
                      'text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded',
                      sc.type === 'best' && 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
                      sc.type === 'expected' && 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300',
                      sc.type === 'stress' && 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    )}
                  >
                    Risk: {sc.metrics.risk}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default StressTestPreview;
