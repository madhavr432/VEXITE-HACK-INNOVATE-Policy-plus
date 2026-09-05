import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Card, CardHeader, CardContent } from '../Card';
import { POLICY_SENSITIVITY_DATA } from '../../data/bus/demoScenarios';
import { cn } from '../../utils/cn';

/**
 * Custom Tooltip for Policy Sensitivity
 */
function SensitivityTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-3 shadow-soft-lg text-xs font-mono">
        <div className="font-bold text-slate-900 dark:text-white mb-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
          Fleet Increase: {label}
        </div>
        <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400 font-semibold">
          <span>Waiting Time:</span>
          <span>{data.waitTime} minutes</span>
        </div>
        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
          Effective Fleet: {data.fleetNum} buses
        </div>
      </div>
    );
  }
  return null;
}

/**
 * PolicySensitivity Component
 * Line chart visualizing passenger waiting time sensitivity relative to fleet increments
 */
export function PolicySensitivity({ data, className = '' }) {
  const chartData = data && data.length > 0 ? data : POLICY_SENSITIVITY_DATA;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Policy Sensitivity
          </h3>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            Queue Compression
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Average waiting time as fleet size changes
        </p>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis
                dataKey="fleetDelta"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1', strokeOpacity: 0.5 }}
                tickLine={false}
              />
              <YAxis
                domain={[7, 16]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                unit="m"
              />
              <Tooltip content={<SensitivityTooltip />} />
              <ReferenceLine
                y={14}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                label={{ value: 'Baseline (14m)', position: 'insideTopRight', fill: '#94a3b8', fontSize: 10 }}
              />
              <Line
                type="monotone"
                dataKey="waitTime"
                name="Average Waiting Time (min)"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4.5, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 6.5, fill: '#059669' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default PolicySensitivity;
