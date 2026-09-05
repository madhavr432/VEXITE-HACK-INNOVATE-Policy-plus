import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bus,
  Receipt,
  Sparkles,
  ShieldAlert,
  Sliders,
  ArrowRight,
  Cpu,
  BrainCircuit,
  UserCheck,
  CheckCircle2,
  Zap,
  Layers,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

/**
 * IntelligencePage Component
 *
 * Concise Policy Intelligence Overview presenting the Policy+ framework:
 * - Deterministic Simulation
 * - Stress Testing
 * - Deterministic Risk Analysis
 * - AI-Assisted Strategic Interpretation
 * - Direct navigation to Bus and GST policy modules
 */
export function IntelligencePage() {
  const steps = [
    {
      num: '01',
      title: 'Configure Policy',
      desc: 'Define baseline parameters, target interventions, and empirical domain assumptions.',
      icon: Sliders,
      badge: 'Interactive',
    },
    {
      num: '02',
      title: 'Deterministic Simulation',
      desc: 'Execute mathematical formulas for service, fiscal yields, and load balances with zero LLM hallucination.',
      icon: Cpu,
      badge: 'Python Engine',
    },
    {
      num: '03',
      title: 'Compare Scenarios',
      desc: 'Examine multi-scenario matrices across conservative, balanced, and aggressive policy tiers.',
      icon: Layers,
      badge: 'Sensitivity',
    },
    {
      num: '04',
      title: 'Attack My Policy',
      desc: 'Subject policies to severe adversarial demand, cost, and compliance shocks to discover breaking points.',
      icon: Zap,
      badge: 'Adversarial',
    },
    {
      num: '05',
      title: 'Quantify Policy Risk',
      desc: 'Calculate weighted composite 0–100 risk scores across 4 key dimensions with auditable contributions.',
      icon: ShieldAlert,
      badge: 'Auditable',
    },
    {
      num: '06',
      title: 'Analyze with Gemini',
      desc: 'Synthesize trade-offs, edge-case vulnerabilities, and strategic policy briefs using validated figures.',
      icon: BrainCircuit,
      badge: 'Gemini AI',
    },
    {
      num: '07',
      title: 'Human Decision',
      desc: 'Empower policymakers with transparent, defensible evidence for responsible, real-world deployment.',
      icon: UserCheck,
      badge: 'Governance',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ai-50 dark:bg-ai-950/60 border border-ai-200 dark:border-ai-800 text-ai-600 dark:text-ai-400 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Decision Intelligence Framework</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Policy Intelligence
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Policy+ combines deterministic simulation, stress testing, risk analysis, and AI-assisted interpretation.
        </p>

        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Choose a policy module to begin.
        </p>
      </div>

      {/* 2. Policy Module Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Module 1: Bus */}
        <Card className="border-2 border-slate-200 dark:border-slate-800 hover:border-policy-500 dark:hover:border-policy-500 transition-all duration-200 shadow-soft-sm hover:shadow-soft-md group">
          <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-policy-500/10 text-policy-600 dark:text-policy-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🚌
              </div>
              <Badge variant="positive" size="sm" className="font-mono uppercase text-[10px]">
                Production Ready
              </Badge>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-policy-600 dark:group-hover:text-policy-400 transition-colors">
                Bus Policy Stress Tester
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Urban Transit & Public Transportation
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore how changes in municipal transit fleet size affect passenger waiting times, daily ridership, capacity utilization, operating surplus, and emissions under surge conditions.
            </p>

            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Deterministic transit queue & elasticity modeling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Multi-tier scenario comparison (0% to +50% fleet)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Attack My Policy & breaking point discovery</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                to="/bus"
                variant="primary"
                pill
                icon={ArrowRight}
                className="w-full justify-center font-semibold"
              >
                Launch Bus Simulator →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Module 2: GST */}
        <Card className="border-2 border-slate-200 dark:border-slate-800 hover:border-policy-500 dark:hover:border-policy-500 transition-all duration-200 shadow-soft-sm hover:shadow-soft-md group">
          <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-ai-500/10 text-ai-600 dark:text-ai-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🧾
              </div>
              <Badge variant="accent" size="sm" className="font-mono uppercase text-[10px]">
                Fiscal Simulation
              </Badge>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-ai-600 dark:group-hover:text-ai-400 transition-colors">
                GST Policy Simulator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Macroeconomic Indirect Taxation
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Model indirect tax bracket shifts across essential, standard, and luxury sectors. Quantify net revenue yields, consumer demand feedback, and MSME compliance burden.
            </p>

            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Net Revenue = Gross Revenue - ITC Refunds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Sectoral demand elasticity & compliance shock tests</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>4-dimension fiscal risk & Gemini strategic analysis</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                to="/gst"
                variant="primary"
                pill
                icon={ArrowRight}
                className="w-full justify-center font-semibold"
              >
                Launch GST Simulator →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Core Architectural Philosophy */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-soft-lg space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-ai-400">
            Core Philosophy
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            Separation of Computation from Interpretation
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold">
              ∑
            </div>
            <div className="font-bold text-sm">Deterministic Engine</div>
            <div className="text-xs font-mono text-blue-400">Calculates Numbers</div>
            <p className="text-[11px] text-slate-400">
              Verifiable Python mathematical models. Zero hallucination.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm">Gemini AI Analyst</div>
            <div className="text-xs font-mono text-violet-400">Interprets Trade-offs</div>
            <p className="text-[11px] text-slate-400">
              Synthesizes risks, hidden costs, and strategic executive briefs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm">Human Policymaker</div>
            <div className="text-xs font-mono text-emerald-400">Owns Decision</div>
            <p className="text-[11px] text-slate-400">
              Evaluates trade-offs and guides democratic implementation.
            </p>
          </div>
        </div>
      </div>

      {/* 4. The 7-Step Workflow */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
            End-to-End Decision Pipeline
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            The Policy+ Decision Support Workflow
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.num} className="p-4 space-y-2 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-policy-600 dark:text-policy-400">
                    {step.num}
                  </span>
                  <Badge variant="neutral" size="sm" className="text-[10px] font-mono">
                    {step.badge}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                  {step.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default IntelligencePage;
