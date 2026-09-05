import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardContent } from '../Card';
import { COST_VS_SERVICE_DATA } from '../../data/bus/demoScenarios';
import { formatInrLakhs } from '../../services/busSimulation';
import { cn } from '../../utils/cn';

function TradeoffTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-3 shadow-soft-lg text-xs font-mono">
        <div className="font-bold text-slate-900 dark:text-white mb-2 pb-1 border-b border-slate-100 dark:border-slate-800">
          Expansion Tier: {label}
        </div>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {entry.value} {entry.unit || ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

/**
 * TradeoffChart Component
 * Contrasts incremental operating expenditure against service gains across scenario tiers.
 */
export function TradeoffChart({
  scenarios = [],
  activePercent = 20,
  onSelectTier,
  className = '',
}) {
  const [metricMode, setMetricMode] = useState('wait'); // 'wait' | 'ridership'

  const chartData = useMemo(() => {
    if (scenarios && scenarios.length > 0) {
      return scenarios.map((sc) => ({
        stage: sc.fleet_increase_percent === 0 ? '0% (Base)' : `+${sc.fleet_increase_percent}%`,
        tierPercent: sc.fleet_increase_percent,
        cost: Number((sc.operating_cost / 100000).toFixed(1)),
        waitReduction: Math.abs(sc.waiting_time_delta_percent),
        ridershipGain: sc.ridership_delta_percent,
        surplus: Number((sc.operating_surplus / 100000).toFixed(1)),
      }));
    }
    return COST_VS_SERVICE_DATA;
  }, [scenarios]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Cost vs Service Trade-off
            </h3>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              Marginal Gain
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Marginal public benefit against incremental operating expenditure
          </p>
        </div>

        {/* Toggle Button */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium">
          <button
            type="button"
            onClick={() => setMetricMode('wait')}
            className={cn(
              'px-2.5 py-1 rounded-lg transition-all duration-150',
              metricMode === 'wait'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-soft-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            Wait Reduction %
          </button>
          <button
            type="button"
            onClick={() => setMetricMode('ridership')}
            className={cn(
              'px-2.5 py-1 rounded-lg transition-all duration-150',
              metricMode === 'ridership'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-soft-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            Ridership Gain %
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
              onClick={(e) => {
                if (e && e.activePayload && e.activePayload[0] && onSelectTier) {
                  onSelectTier(e.activePayload[0].payload.tierPercent);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis
                dataKey="stage"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1', strokeOpacity: 0.5 }}
                tickLine={false}
              />
              {/* Left Y Axis for Cost */}
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 10, fill: '#f59e0b' }}
                axisLine={false}
                tickLine={false}
                unit="₹L"
              />
              {/* Right Y Axis for Percentage Gain */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 40]}
                tick={{ fontSize: 10, fill: '#10b981' }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip content={<TradeoffTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 6, fontSize: 11 }}
                formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
              />
              <Bar
                yAxisId="left"
                dataKey="cost"
                name="Operating Cost (₹L/day)"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                unit="₹L"
                barSize={18}
              />
              {metricMode === 'wait' ? (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="waitReduction"
                  name="Wait Time Reduction (%)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#10b981' }}
                  activeDot={{ r: 6, fill: '#059669' }}
                  unit="%"
                />
              ) : (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ridershipGain"
                  name="Ridership Growth (%)"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#4f46e5' }}
                  activeDot={{ r: 6, fill: '#4338ca' }}
                  unit="%"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default TradeoffChart;
