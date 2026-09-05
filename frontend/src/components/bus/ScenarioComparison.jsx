import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardContent } from '../Card';
import { SCENARIO_COMPARISON_DATA } from '../../data/bus/demoScenarios';
import { cn } from '../../utils/cn';

/**
 * Custom Tooltip for Scenario Comparison Bar Chart
 */
function CustomBarTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-3 shadow-soft-lg text-xs font-mono">
        <div className="font-bold text-slate-900 dark:text-white mb-2 pb-1 border-b border-slate-100 dark:border-slate-800">
          Fleet Tier: {label}
        </div>
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill || item.color }} />
              {item.name}:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {item.value} {item.unit || ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

/**
 * ScenarioComparison Component
 * Grouped bar chart visualizing Ridership & Operating Cost with a toggle for Waiting Time
 */
export function ScenarioComparison({ className = '' }) {
  const [viewMetric, setViewMetric] = useState('ridership_cost'); // 'ridership_cost' | 'wait_time'

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Scenario Comparison
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            How outcomes change with fleet expansion
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setViewMetric('ridership_cost')}
            className={cn(
              'px-2.5 py-1 rounded-lg transition-all duration-150',
              viewMetric === 'ridership_cost'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-soft-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            Ridership & Cost
          </button>
          <button
            type="button"
            onClick={() => setViewMetric('wait_time')}
            className={cn(
              'px-2.5 py-1 rounded-lg transition-all duration-150',
              viewMetric === 'wait_time'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-soft-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            Waiting Time
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMetric === 'ridership_cost' ? (
              <BarChart
                data={SCENARIO_COMPARISON_DATA}
                margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis
                  dataKey="scenario"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1', strokeOpacity: 0.5 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
                  formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
                />
                <Bar
                  dataKey="ridership"
                  name="Ridership (K pax/day)"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                  unit="K pax"
                />
                <Bar
                  dataKey="cost"
                  name="Operating Cost (₹L/day)"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  unit="₹L"
                />
              </BarChart>
            ) : (
              <BarChart
                data={SCENARIO_COMPARISON_DATA}
                margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis
                  dataKey="scenario"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1', strokeOpacity: 0.5 }}
                  tickLine={false}
                />
                <YAxis
                  domain={[6, 16]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  unit="m"
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
                  formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
                />
                <Bar
                  dataKey="waitTime"
                  name="Average Waiting Time (min)"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  unit="min"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default ScenarioComparison;
