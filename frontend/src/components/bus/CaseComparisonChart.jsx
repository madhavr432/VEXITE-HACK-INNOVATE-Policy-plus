import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { Card, CardHeader, CardContent } from '../Card';
import { formatInrLakhs, formatPaxK } from '../../services/busSimulation';
import { cn } from '../../utils/cn';

const METRIC_OPTIONS = [
  { id: 'surplus', label: 'Operating Surplus (₹ Lakhs/day)', unit: '₹L', scale: 100000 },
  { id: 'cost', label: 'Operating Cost (₹ Lakhs/day)', unit: '₹L', scale: 100000 },
  { id: 'revenue', label: 'Farebox Revenue (₹ Lakhs/day)', unit: '₹L', scale: 100000 },
  { id: 'ridership', label: 'Daily Ridership (Thousands)', unit: 'K pax', scale: 1000 },
  { id: 'waitTime', label: 'Waiting Time (Minutes)', unit: 'min', scale: 1 },
  { id: 'utilization', label: 'Fleet Utilization (%)', unit: '%', scale: 1 },
];

/**
 * CaseComparisonChart Component
 *
 * Interactive Recharts visualization comparing Best Case vs Expected Case vs Worst Tested Case
 * across multiple selectable policy metrics.
 */
export function CaseComparisonChart({
  bestCase,
  expectedCase,
  worstCase,
  className = '',
}) {
  const [selectedMetric, setSelectedMetric] = useState('surplus');

  const activeMetricConfig = useMemo(() => {
    return METRIC_OPTIONS.find((m) => m.id === selectedMetric) || METRIC_OPTIONS[0];
  }, [selectedMetric]);

  const chartData = useMemo(() => {
    if (!bestCase || !expectedCase || !worstCase) return [];

    const getRawValue = (res, metricId) => {
      switch (metricId) {
        case 'surplus':
          return res.operating_surplus;
        case 'cost':
          return res.operating_cost;
        case 'revenue':
          return res.revenue;
        case 'ridership':
          return res.daily_ridership;
        case 'waitTime':
          return res.waiting_time_minutes;
        case 'utilization':
          return res.utilization_percent;
        default:
          return 0;
      }
    };

    const cases = [
      { key: 'best', label: 'Best Case', data: bestCase, color: '#10b981' },
      { key: 'expected', label: 'Expected Case', data: expectedCase, color: '#0ea5e9' },
      { key: 'worst', label: 'Worst Tested Case', data: worstCase, color: '#f43f5e' },
    ];

    return cases.map((c) => {
      const rawVal = getRawValue(c.data.results, selectedMetric);
      const scaledVal = Number((rawVal / activeMetricConfig.scale).toFixed(1));
      return {
        name: c.label,
        value: scaledVal,
        rawValue: rawVal,
        fill: c.color,
      };
    });
  }, [bestCase, expectedCase, worstCase, selectedMetric, activeMetricConfig]);

  if (!bestCase || !expectedCase || !worstCase) {
    return null;
  }

  return (
    <Card className={cn('overflow-hidden shadow-soft-sm border', className)}>
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Envelope Comparison: Best vs Expected vs Worst
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare key operational and financial indicators across outcome cases.
          </p>
        </div>

        {/* Metric Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 shrink-0">
            Metric:
          </label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="text-xs font-mono font-semibold py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-policy-500 shadow-soft-xs"
          >
            {METRIC_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94a3b8"
                opacity={0.2}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                unit={` ${activeMetricConfig.unit}`}
              />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg bg-white dark:bg-slate-900 p-3 shadow-soft-md border border-slate-200 dark:border-slate-800 text-xs font-mono">
                        <p className="font-sans font-bold text-slate-900 dark:text-white mb-1">
                          {data.name}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          {activeMetricConfig.label.split('(')[0].trim()}:{' '}
                          <span className="font-bold text-slate-900 dark:text-white">
                            {data.value} {activeMetricConfig.unit}
                          </span>
                        </p>
                        {selectedMetric === 'surplus' && data.rawValue < 0 && (
                          <p className="text-rose-600 dark:text-rose-400 text-[11px] font-semibold mt-1">
                            ⚠️ Operating Deficit
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={52}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.rawValue < 0 && selectedMetric === 'surplus' ? '#f43f5e' : entry.fill}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>*Calculated via FastAPI /api/bus/stress-test</span>
          <span>Source of truth: Deterministic Engine</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default CaseComparisonChart;
