import React from 'react';
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
import { cn } from '../../utils/cn';

function TradeoffTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-3 shadow-soft-lg text-xs font-mono">
        <div className="font-bold text-slate-900 dark:text-white mb-2 pb-1 border-b border-slate-100 dark:border-slate-800">
          Intervention: {label}
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
 * Demonstrates policy trade-offs by contrasting Operating Cost against Service Improvement and Waiting Time reductions.
 */
export function TradeoffChart({ className = '' }) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Cost vs Service Improvement
          </h3>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            Trade-off Dynamics
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Evaluating marginal service gain against incremental operating expenditure
        </p>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={COST_VS_SERVICE_DATA}
              margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
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
                domain={[7, 12]}
                tick={{ fontSize: 10, fill: '#f59e0b' }}
                axisLine={false}
                tickLine={false}
                unit="₹L"
              />
              {/* Right Y Axis for Service / Wait Reduction % */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 35]}
                tick={{ fontSize: 10, fill: '#4f46e5' }}
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
                barSize={20}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="waitReduction"
                name="Wait Reduction (%)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#10b981' }}
                unit="%"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="serviceGain"
                name="Service Improvement Index (%)"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#4f46e5' }}
                unit="%"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default TradeoffChart;
