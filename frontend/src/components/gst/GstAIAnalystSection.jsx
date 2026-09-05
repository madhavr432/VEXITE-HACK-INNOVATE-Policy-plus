import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import {
  Sparkles,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Scale,
  Loader2,
  ChevronRight,
  Info,
} from 'lucide-react';

const SUGGESTED_GST_QUESTIONS = [
  'What is the biggest risk in this GST policy?',
  'How sensitive is revenue to compliance?',
  'What happens if demand is more elastic?',
  'What are the main trade-offs?',
  'Why does the risk score change?',
  'Which assumption should be validated first?',
];

export function GstAIAnalystSection({
  analysisResult,
  isLoading,
  error,
  onRunAnalysis,
}) {
  const [userQuestion, setUserQuestion] = useState('');

  const handleQuestionClick = (q) => {
    setUserQuestion(q);
    onRunAnalysis(q);
  };

  const handleSubmitCustom = (e) => {
    e.preventDefault();
    onRunAnalysis(userQuestion.trim() || null);
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-ai-500/10 text-ai-600 dark:text-ai-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Gemini AI Policy Analyst
              <Badge variant="neutral" className="text-[10px] font-mono">
                Interpretation Layer
              </Badge>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Natural-language interpretation of validated deterministic GST simulation and risk outputs
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
          Model: gemini-2.5-flash
        </span>
      </div>

      {/* QUESTION INTERACTION PANEL */}
      <Card className="p-4 space-y-3">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          Ask Targeted Policy Questions
        </span>

        {/* Quick Question Chips */}
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_GST_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleQuestionClick(q)}
              disabled={isLoading}
              className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-ai-500/10 hover:text-ai-600 dark:hover:text-ai-400 hover:border-ai-500/30 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
            >
              <span>{q}</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>

        {/* Custom Question Input */}
        <form onSubmit={handleSubmitCustom} className="flex gap-2 pt-1">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            placeholder="Ask Gemini about trade-offs, fiscal sensitivity, or compliance risks..."
            disabled={isLoading}
            className="flex-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ai-500/30"
          />
          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
            size="sm"
            pill
            icon={isLoading ? Loader2 : Sparkles}
            className="font-semibold text-xs whitespace-nowrap"
          >
            {isLoading ? 'Analyzing policy trade-offs...' : 'Generate Analysis'}
          </Button>
        </form>
      </Card>

      {/* AI DISCLAIMER */}
      <div className="p-3 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200/60 dark:border-violet-800/40 flex items-start gap-2.5 text-xs text-violet-900 dark:text-violet-200">
        <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Gemini interprets validated Policy+ simulation results.</strong> It does not calculate policy metrics or make autonomous policy decisions.
        </p>
      </div>

      {/* EMPTY STATE */}
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
              Run a simulation and click "Generate Analysis" to explore strategic fiscal trade-offs.
            </p>
          </div>
        </Card>
      )}

      {/* ERROR MESSAGE IF ANY */}
      {error && (
        <Card className="p-4 border-amber-500/40 bg-amber-500/5 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">AI analysis is currently unavailable.</div>
            <div>{error}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              Your simulation, stress test and risk results are still available.
            </div>
          </div>
        </Card>
      )}

      {/* LOADING STATE */}
      {isLoading && (
        <Card className="p-8 text-center space-y-3">
          <Loader2 className="w-7 h-7 text-ai-600 dark:text-ai-400 animate-spin mx-auto" />
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            Analyzing policy trade-offs...
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Gemini is interpreting your deterministic GST simulation results. Policy metrics are not being recalculated.
          </p>
        </Card>
      )}

      {/* STRUCTURED ANALYSIS RESULTS */}
      {analysisResult && !isLoading && (
        <div className="space-y-4">
          {/* Executive Summary */}
          <Card className="p-5 border-ai-500/20 bg-ai-500/5 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ai-600 dark:text-ai-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Executive Policy Summary
            </span>
            <p className="text-sm text-slate-900 dark:text-white leading-relaxed font-medium">
              {analysisResult.executive_summary}
            </p>
          </Card>

          {/* Key Insights & Risk Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Insights */}
            <Card className="p-4 space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Key Empirical Insights
              </span>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {analysisResult.key_insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ai-500 shrink-0 mt-1.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Risk Explanation */}
            <Card className="p-4 space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-500" /> Multi-Dimensional Risk Synthesis
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {analysisResult.risk_explanation}
              </p>
            </Card>
          </div>

          {/* Explicit Policy Trade-offs */}
          {analysisResult.tradeoffs && analysisResult.tradeoffs.length > 0 && (
            <Card className="p-4 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-purple-500" /> Explicit Benefit vs Cost Trade-offs
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysisResult.tradeoffs.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="text-emerald-700 dark:text-emerald-400 font-medium">
                      ✓ <strong className="font-semibold">Benefit:</strong> {item.benefit}
                    </div>
                    <div className="text-rose-700 dark:text-rose-400 font-medium">
                      ✗ <strong className="font-semibold">Cost / Exposure:</strong> {item.cost}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Stress Findings & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stress Findings */}
            <Card className="p-4 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> Stress Test Findings
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {analysisResult.stress_findings.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Action Recommendations */}
            <Card className="p-4 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Decision-Support Recommendations
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {analysisResult.recommendations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Confidence Note & Transparency Disclaimer */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
              <Info className="w-3.5 h-3.5" /> Simulation Confidence & Scope
            </div>
            <div>{analysisResult.confidence_note}</div>
            <div className="italic text-[10px] text-slate-400">
              GST results are illustrative scenario outputs based on configurable assumptions and should not be represented as official government revenue estimates.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
