import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
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

const METRIC_OPTIONS = [
  { id: 'ridership_cost', label: 'Ridership & Cost' },
  { id: 'wait_time', label: 'Waiting Time' },
  { id: 'surplus', label: 'Operating Surplus' },
  { id: 'capacity', label: 'Daily Capacity' },
  { id: 'utilization', label: 'Utilization' },
];

/**
 * ScenarioComparison Component
 * Grouped and single bar chart visualizing policy scenarios across expansion tiers.
 */
export function ScenarioComparison({
  scenarios = [],
  activePercent = 20,
  onSelectTier,
  className = '',
}) {
  const [viewMetric, setViewMetric] = useState('ridership_cost');

  const chartData = useMemo(() => {
    if (scenarios && scenarios.length > 0) {
      return scenarios.map((sc) => ({
        scenario: sc.fleet_increase_percent === 0 ? '0% (Base)' : `+${sc.fleet_increase_percent}%`,
        tierPercent: sc.fleet_increase_percent,
        fleet: sc.fleet,
        ridership: Number((sc.daily_ridership / 1000).toFixed(1)),
        cost: Number((sc.operating_cost / 100000).toFixed(1)),
        revenue: Number((sc.revenue / 100000).toFixed(1)),
        waitTime: sc.waiting_time_minutes,
        surplus: Number((sc.operating_surplus / 100000).toFixed(1)),
        capacity: Number((sc.daily_capacity / 1000).toFixed(1)),
        utilization: sc.utilization_percent,
      }));
    }
    return SCENARIO_COMPARISON_DATA;
  }, [scenarios]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Scenario Comparison & Trade-off Spectrum
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare service, financial, and capacity outcomes across fleet expansion tiers
          </p>
        </div>

        {/* View Metric Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium">
          {METRIC_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setViewMetric(opt.id)}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-all duration-150',
                viewMetric === opt.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-soft-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMetric === 'ridership_cost' && (
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                onClick={(e) => {
                  if (e && e.activePayload && e.activePayload[0] && onSelectTier) {
                    onSelectTier(e.activePayload[0].payload.tierPercent);
                  }
                }}
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
            )}

            {viewMetric === 'wait_time' && (
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                onClick={(e) => {
                  if (e && e.activePayload && e.activePayload[0] && onSelectTier) {
                    onSelectTier(e.activePayload[0].payload.tierPercent);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis
                  dataKey="scenario"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1', strokeOpacity: 0.5 }}
                  tickLine={false}
                />
                <YAxis
                  domain={[8, 16]}
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
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={Math.abs(entry.tierPercent - activePercent) < 0.01 ? '#059669' : '#10b981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}

            {viewMetric === 'surplus' && (
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                onClick={(e) => {
                  if (e && e.activePayload && e.activePayload[0] && onSelectTier) {
                    onSelectTier(e.activePayload[0].payload.tierPercent);
                  }
                }}
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
                  unit="₹L"
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
                  formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
                />
                <Bar
                  dataKey="surplus"
                  name="Operating Surplus (₹L/day)"
                  radius={[4, 4, 0, 0]}
                  unit="₹L"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.surplus >= 0 ? (Math.abs(entry.tierPercent - activePercent) < 0.01 ? '#047857' : '#10b981') : '#f43f5e'}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}

            {viewMetric === 'capacity' && (
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                onClick={(e) => {
                  if (e && e.activePayload && e.activePayload[0] && onSelectTier) {
                    onSelectTier(e.activePayload[0].payload.tierPercent);
                  }
                }}
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
                  unit="K"
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
                  formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
                />
                <Bar
                  dataKey="capacity"
                  name="Daily Seat Capacity (K/day)"
                  fill="#0284c7"
                  radius={[4, 4, 0, 0]}
                  unit="K seats"
                />
              </BarChart>
            )}

            {viewMetric === 'utilization' && (
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                onClick={(e) => {
                  if (e && e.activePayload && e.activePayload[0] && onSelectTier) {
                    onSelectTier(e.activePayload[0].payload.tierPercent);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis
                  dataKey="scenario"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1', strokeOpacity: 0.5 }}
                  tickLine={false}
                />
                <YAxis
                  domain={[50, 90]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 8, fontSize: 12 }}
                  formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
                />
                <Bar
                  dataKey="utilization"
                  name="Fleet Load Factor (%)"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  unit="%"
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
