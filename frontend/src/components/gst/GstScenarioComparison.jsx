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
  Cell,
} from 'recharts';
import { Card, CardHeader, CardContent } from '../Card';
import { Badge } from '../Badge';
import { TrendingUp, Layers, CheckCircle2 } from 'lucide-react';
import { formatInrCrores, formatPercent } from '../../services/gstSimulation';

export function GstScenarioComparison({
  scenarios = [],
  currentRate,
  proposedRate,
  onSelectRate,
}) {
  if (!scenarios || scenarios.length === 0) return null;

  // Prepare chart data in ₹ Crores
  const chartData = scenarios.map((s) => ({
    rateLabel: `${s.gst_rate}%`,
    rateValue: s.gst_rate,
    revenueCr: Number((s.modeled_gst_revenue / 1e7).toFixed(2)),
    demandResponsePct: s.demand_response_percent,
    isCurrent: s.is_current,
    isProposed: s.is_proposed,
  }));

  return (
    <Card className="space-y-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              GST Rate Bracket Comparison
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic yield and behavioral demand response across standard GST slabs
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" /> Current ({currentRate}%)
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Proposed ({proposedRate}%)
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* RECHARTS COMPOSED BAR & LINE CHART */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
              <XAxis
                dataKey="rateLabel"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                yAxisId="revenue"
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(v) => `₹${v}Cr`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="demand"
                orientation="right"
                stroke="#8b5cf6"
                fontSize={11}
                tickFormatter={(v) => `${v}%`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg text-xs space-y-1 font-sans">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                          <span>Slab {data.rateLabel}</span>
                          {data.isCurrent && <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-1.5 py-0.5 rounded text-[10px]">Current</span>}
                          {data.isProposed && <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-1.5 py-0.5 rounded text-[10px]">Proposed</span>}
                        </div>
                        <div className="text-slate-600 dark:text-slate-300">
                          Revenue: <strong className="font-mono text-slate-900 dark:text-white">₹{data.revenueCr.toLocaleString()} Cr</strong>
                        </div>
                        <div className="text-purple-600 dark:text-purple-400">
                          Demand Response: <strong className="font-mono">{formatPercent(data.demandResponsePct, true)}</strong>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar yAxisId="revenue" dataKey="revenueCr" name="Modeled Revenue (₹ Cr)" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => {
                  let fillColor = '#94a3b8'; // default slate
                  if (entry.isProposed) fillColor = '#10b981'; // emerald-500
                  else if (entry.isCurrent) fillColor = '#3b82f6'; // blue-500
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Bar>
              <Line
                yAxisId="demand"
                type="monotone"
                dataKey="demandResponsePct"
                name="Demand Response (%)"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#8b5cf6' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* DETAILED SCENARIO TABLE */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">GST Bracket</th>
                <th className="py-2.5 px-3">Taxable Volume</th>
                <th className="py-2.5 px-3">Modeled Revenue</th>
                <th className="py-2.5 px-3">Revenue Δ vs Current</th>
                <th className="py-2.5 px-3">Demand Response</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {scenarios.map((sc) => {
                const isSelected = sc.is_proposed;
                const isBaseline = sc.is_current;

                return (
                  <tr
                    key={sc.gst_rate}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/15 font-medium'
                        : isBaseline
                        ? 'bg-blue-500/5 dark:bg-blue-500/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2.5 px-3 flex items-center gap-1.5 font-sans">
                      <span className="font-bold font-mono">{sc.gst_rate}%</span>
                      {isBaseline && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">
                          Current
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 px-1.5 py-0.5 rounded font-medium">
                          Selected
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                      {formatInrCrores(sc.modeled_taxable_volume)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {formatInrCrores(sc.modeled_gst_revenue)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={
                          sc.revenue_change > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : sc.revenue_change < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-500'
                        }
                      >
                        {sc.revenue_change > 0 ? '+' : ''}
                        {formatInrCrores(sc.revenue_change)} ({formatPercent(sc.revenue_change_percent, true)})
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={
                          sc.demand_response_percent > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : sc.demand_response_percent < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-500'
                        }
                      >
                        {formatPercent(sc.demand_response_percent, true)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {onSelectRate && (
                        <button
                          onClick={() => onSelectRate(String(sc.gst_rate))}
                          disabled={isSelected}
                          className={`text-[11px] font-sans px-2 py-1 rounded transition ${
                            isSelected
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {isSelected ? 'Active' : 'Test Slab'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
