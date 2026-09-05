import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronRight,
  Lightbulb,
  ArrowRightLeft,
  ShieldAlert,
  Zap,
  AlertTriangle,
  ClipboardList,
  Info,
  RotateCcw,
  Send,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';

// ---------------------------------------------------------------------------
// Question chips
// ---------------------------------------------------------------------------
const QUESTION_CHIPS = [
  'Is this policy financially sustainable?',
  'What is the biggest risk?',
  'What could go wrong under stress?',
  'Explain the trade-offs',
  'Which assumption should I validate first?',
  'Why did the policy receive this risk score?',
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHeader({ icon: Icon, label, color = 'text-policy-600 dark:text-policy-400' }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`w-4 h-4 ${color} shrink-0`} />
      <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </h4>
    </div>
  );
}

function InsightItem({ text, idx }) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
      <span className="w-5 h-5 rounded-full bg-policy-600 dark:bg-policy-500 text-white text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
        {idx + 1}
      </span>
      <span>{text}</span>
    </div>
  );
}

function TradeoffRow({ benefit, cost, idx }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
        <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
        <span>{benefit}</span>
      </div>
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
        <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <span>{cost}</span>
      </div>
    </div>
  );
}

function BulletList({ items, color = 'text-policy-500' }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <ChevronRight className={`w-3.5 h-3.5 ${color} shrink-0 mt-0.5`} />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function AIPolicyAnalyst({
  analysisResult,
  isLoading,
  error,
  onAnalyze,
  selectedFleetIncrease = 20,
  disabled = false,
}) {
  const [question, setQuestion] = useState('');

  const handleChipClick = (chip) => {
    setQuestion(chip);
  };

  const handleAnalyze = () => {
    onAnalyze(question || null);
  };

  return (
    <div id="ai-analyst-section" className="space-y-6 pt-6 border-t border-slate-200/80 dark:border-slate-800">

      {/* ─── Section Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                AI Policy Analyst
              </h2>
              <Badge variant="neutral" size="sm" className="text-[10px] font-mono uppercase tracking-wider">
                Powered by Gemini
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Gemini interprets validated Policy+ simulation results for the +{selectedFleetIncrease}% fleet policy.
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono ml-1.5">
                Policy metrics are calculated deterministically.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ─── Question Box ────────────────────────────────────────────────── */}
      <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-policy-500" />
              Ask the Policy Analyst
              <span className="text-[11px] font-normal text-slate-400 ml-1">(optional)</span>
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Is this policy financially sustainable? What is the biggest risk?"
              maxLength={500}
              rows={2}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-policy-500/30 focus:border-policy-500 resize-none transition-all font-sans leading-relaxed"
            />
          </div>

          {/* Question Chips */}
          <div className="flex flex-wrap gap-1.5">
            {QUESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all font-medium ${
                  question === chip
                    ? 'bg-policy-600 text-white border-policy-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-policy-400 hover:text-policy-600 dark:hover:text-policy-300'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Analyze Button */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              Gemini interprets validated results — not a calculator
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || disabled}
              size="sm"
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-sm text-xs font-semibold px-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing policy trade-offs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{analysisResult ? 'Re-Analyze' : 'Analyze with Gemini'}</span>
                  <Send className="w-3 h-3 opacity-70" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── AI Policy Disclaimer ────────────────────────────────────────── */}
      <div className="p-3 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200/60 dark:border-violet-800/40 flex items-start gap-2.5 text-xs text-violet-900 dark:text-violet-200">
        <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Gemini interprets validated Policy+ simulation results.</strong> It does not calculate policy metrics or make autonomous policy decisions.
        </p>
      </div>

      {/* ─── Empty State ─────────────────────────────────────────────────── */}
      {!analysisResult && !isLoading && !error && (
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
          <div className="mx-auto w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No AI analysis yet.
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Run a simulation and click "Analyze with Gemini" to explore strategic trade-offs.
            </p>
          </div>
        </Card>
      )}

      {/* ─── Error State ─────────────────────────────────────────────────── */}
      {error && !isLoading && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>AI analysis is currently unavailable.</span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-300 ml-6 leading-relaxed">
            {error}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 ml-6">
            Your simulation, stress test and risk results are still available.
          </p>
          <div className="ml-6 pt-1">
            <Button size="sm" variant="secondary" onClick={handleAnalyze} className="text-xs">
              <RotateCcw className="w-3 h-3 mr-1.5" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* ─── Loading Skeleton ─────────────────────────────────────────────── */}
      {isLoading && (
        <Card className="border border-slate-200/90 dark:border-slate-800 p-8">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <Loader2 className="w-5 h-5 text-violet-500 animate-spin absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Analyzing policy trade-offs...
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
                Gemini is interpreting your deterministic simulation results.
                Policy metrics are not being recalculated.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Results ─────────────────────────────────────────────────────── */}
      {analysisResult && !isLoading && (
        <div className="space-y-5">

          {/* Source-of-truth label */}
          <div className="flex items-center justify-between flex-wrap gap-2 px-1">
            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <strong className="text-slate-600 dark:text-slate-300">Deterministic results</strong>
              <span>→ validated by Policy+ engines</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
              <strong className="text-slate-600 dark:text-slate-300">AI interpretation</strong>
              <span>→ Gemini policy analyst</span>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <Card className="border border-violet-200/60 dark:border-violet-800/40 bg-gradient-to-br from-violet-50/60 to-indigo-50/30 dark:from-violet-950/20 dark:to-indigo-950/10 shadow-soft-xs">
            <CardContent className="p-5">
              <SectionHeader icon={Sparkles} label="Executive Summary" color="text-violet-600 dark:text-violet-400" />
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {analysisResult.executive_summary}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-violet-500 dark:text-violet-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
                Interpreted by Gemini AI
              </div>
            </CardContent>
          </Card>

          {/* 2 + 3: Key Insights & Risk Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs">
              <CardContent className="p-5">
                <SectionHeader icon={Lightbulb} label="Key Insights" />
                <div className="space-y-2">
                  {analysisResult.key_insights.map((insight, i) => (
                    <InsightItem key={i} text={insight} idx={i} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs">
              <CardContent className="p-5">
                <SectionHeader icon={ShieldAlert} label="Risk Explanation" color="text-orange-500 dark:text-orange-400" />
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {analysisResult.risk_explanation}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 4. Trade-offs */}
          <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs">
            <CardContent className="p-5">
              <SectionHeader icon={ArrowRightLeft} label="Policy Trade-offs" />
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold text-slate-500 mb-2 px-1">
                <span className="text-emerald-600 dark:text-emerald-400">✓ Benefits</span>
                <span className="text-amber-600 dark:text-amber-400">⚠ Trade-offs / Costs</span>
              </div>
              <div className="space-y-2">
                {analysisResult.tradeoffs.map((t, i) => (
                  <TradeoffRow key={i} benefit={t.benefit} cost={t.cost} idx={i} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 5 + 6: Stress Findings & Assumption Warnings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs">
              <CardContent className="p-5">
                <SectionHeader icon={Zap} label="Stress Test Findings" color="text-amber-500 dark:text-amber-400" />
                <BulletList items={analysisResult.stress_findings} color="text-amber-500" />
              </CardContent>
            </Card>

            <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs">
              <CardContent className="p-5">
                <SectionHeader icon={AlertTriangle} label="Assumption Warnings" color="text-rose-500 dark:text-rose-400" />
                <BulletList items={analysisResult.assumption_warnings} color="text-rose-500" />
              </CardContent>
            </Card>
          </div>

          {/* 7. Recommendations */}
          <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs">
            <CardContent className="p-5">
              <SectionHeader icon={ClipboardList} label="Recommendations" color="text-emerald-600 dark:text-emerald-400" />
              <BulletList items={analysisResult.recommendations} color="text-emerald-500" />
            </CardContent>
          </Card>

          {/* 8. Confidence Note + Responsible AI Disclosure */}
          <Card className="border border-slate-200/90 dark:border-slate-800 shadow-soft-xs bg-slate-50/50 dark:bg-slate-900/40">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-policy-500" />
                Decision Support Disclosure
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {analysisResult.confidence_note}
              </p>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono pt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span>Policy metrics → deterministic engines</span>
                <span>Interpretation → Gemini AI</span>
                <span>Decision → Human</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AIPolicyAnalyst;
