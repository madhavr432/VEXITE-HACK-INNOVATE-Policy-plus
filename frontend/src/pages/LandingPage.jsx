import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bus,
  Receipt,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  UserCheck,
  Activity,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Layers,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card, CardHeader, CardContent } from '../components/Card';
import { MetricCard } from '../components/MetricCard';
import { ModuleCard } from '../components/ModuleCard';
import { SectionHeader } from '../components/SectionHeader';
import { Timeline } from '../components/Timeline';
import { AIInsight } from '../components/AIInsight';

// Hero Chart Synthetic Scenario Data
const heroScenarioData = [
  { scenario: 'Current', waitTime: 14, ridership: 42, cost: 8.2 },
  { scenario: '+10%', waitTime: 12.8, ridership: 44.5, cost: 8.7 },
  { scenario: '+15%', waitTime: 11.9, ridership: 45.8, cost: 9.0 },
  { scenario: '+20%', waitTime: 11.0, ridership: 47.0, cost: 9.4 },
  { scenario: '+25%', waitTime: 10.4, ridership: 47.8, cost: 10.1 },
  { scenario: '+30%', waitTime: 10.0, ridership: 48.2, cost: 11.0 },
];

export function LandingPage() {
  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (TWO-COLUMN EDITORIAL WITH PRISTINE CONTRAST)            */}
      {/* ========================================================================= */}
      <section className="relative pt-10 sm:pt-20 pb-8 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 inset-x-0 h-96 bg-lavender-glow pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* LEFT COLUMN: Large Typography & Value Prop */}
            <div className="lg:col-span-6 space-y-6">
              {/* Badge */}
              <div className="inline-block">
                <Badge variant="ai" size="md" dot icon={Sparkles}>
                  AI-Powered Policy Stress Testing
                </Badge>
              </div>

              {/* Huge Confident Headline */}
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.95]">
                SIMULATE.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-ai-600 via-policy-600 to-indigo-700 dark:from-ai-400 dark:via-policy-400 dark:to-indigo-300">
                  STRESS-TEST.
                </span><br />
                DECIDE.
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 leading-snug max-w-xl">
                Explore the consequences of policy decisions before they reach the real world.
              </p>

              {/* Supporting Line */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg font-normal">
                Deterministic simulations. AI-assisted analysis. Human-led decisions.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Button
                  to="/bus"
                  size="lg"
                  pill
                  variant="primary"
                  icon={ArrowRight}
                  className="font-semibold shadow-soft-md"
                >
                  Explore Bus Policies
                </Button>
                <Button
                  href="#how-it-works"
                  size="lg"
                  pill
                  variant="secondary"
                  className="font-medium"
                >
                  See How It Works
                </Button>
              </div>

              {/* Small trust metadata */}
              <div className="flex items-center gap-4 pt-4 text-xs font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Auditable Models
                </span>
                <span>•</span>
                <span>Zero Math Hallucination</span>
                <span>•</span>
                <span>Dual-Domain Isolation</span>
              </div>
            </div>

            {/* RIGHT COLUMN: POLICY INTELLIGENCE WORKSPACE PREVIEW */}
            <div className="lg:col-span-6 relative">
              {/* Workspace Card */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft-xl p-6 relative">
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ai-700 dark:text-ai-300">
                      POLICY INTELLIGENCE
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Scenario Analysis • Live Simulation
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      BUS FLEET EXPANSION <span className="text-ai-600 dark:text-ai-400 font-mono">+20%</span>
                    </span>
                  </div>
                </div>

                {/* 4 Small Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                  <MetricCard
                    label="Avg Wait Time"
                    baseline="14 min"
                    simulated="11 min"
                    change="-21%"
                    trend="positive"
                    compact
                  />
                  <MetricCard
                    label="Ridership"
                    baseline="42K"
                    simulated="47K"
                    change="+12%"
                    trend="positive"
                    compact
                  />
                  <MetricCard
                    label="Operating Cost"
                    baseline="₹8.2L"
                    simulated="₹9.4L"
                    change="+15%"
                    trend="negative"
                    compact
                  />
                  <MetricCard
                    label="Fleet Utilization"
                    baseline="78%"
                    simulated="72%"
                    change="-6%"
                    trend="neutral"
                    compact
                  />
                </div>

                {/* Hero Recharts Area Chart */}
                <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Policy Impact Across Scenarios
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      Synthetic Model Curve
                    </span>
                  </div>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={heroScenarioData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="scenario" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="waitTime" name="Wait Time (min)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorWait)" />
                        <Area type="monotone" dataKey="cost" name="Cost (₹ Lakhs)" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Floating AI Insight Card */}
                <div className="mt-4 sm:-mb-6 sm:-mr-4 sm:ml-8 relative z-20">
                  <AIInsight
                    floating
                    highlight="20% fleet increase"
                    insight="provides a strong waiting-time improvement, but operating costs rise faster beyond the 20–25% range."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. RECENT POLICY ACTIVITY                                                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-soft-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-ai-600 dark:text-ai-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Recent Policy Simulations
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Live Evaluation Stream
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Activity 1 */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-policy-600 dark:text-policy-400 flex items-center justify-center">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Bus Fleet Expansion</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">+20% peak capacity scenario</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="positive" size="sm">
                  Completed
                </Badge>
                <Link to="/bus" className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-ai-600 dark:text-ai-400 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">GST Rate Scenario</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">18% → 12% bracket rationalization</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="positive" size="sm">
                  Completed
                </Badge>
                <Link to="/gst" className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. POLICY DOMAINS SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Policy Domains"
          title="Explore Policy Domains"
          subtitle="Turn policy ideas into measurable experiments across transport infrastructure and fiscal revenue."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BUS POLICY CARD */}
          <ModuleCard
            to="/bus"
            icon={Bus}
            domainCode="SUB-01"
            badgeText="Transit System"
            title="Bus Policy Stress Tester"
            description="Explore how changes in fleet size, service capacity and transport assumptions can affect waiting time, ridership, utilization and operating costs."
            metrics={['Waiting Time', 'Ridership', 'Operating Cost', 'Utilization']}
            ctaText="Open Bus Simulator →"
          />

          {/* GST POLICY CARD */}
          <ModuleCard
            to="/gst"
            icon={Receipt}
            domainCode="SUB-02"
            badgeText="Fiscal System"
            title="GST Policy Simulator"
            description="Explore hypothetical GST policy changes and evaluate potential effects on revenue, prices, businesses and demand."
            metrics={['Revenue Impact', 'Price Impact', 'Business Impact', 'Demand Response']}
            ctaText="Open GST Simulator →"
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY STRESS-TEST POLICIES?                                              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-14 shadow-soft-md">
          <div className="max-w-3xl mb-12">
            <Badge variant="neutral" size="sm" className="mb-4">
              The Need for Stress-Testing
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              "A policy can look successful under one assumption and fail under another."
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Col 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-ai-700 dark:text-ai-300 font-bold">
                01 • Input Sensitivity
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Change Assumption</span>
                <span className="text-ai-600 dark:text-ai-400 font-mono">Demand ↑</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                A sudden 15% commuter surge or fuel price hike changes the feasibility of previously approved schedules.
              </p>
            </div>

            {/* Col 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                02 • Fiscal Pressure
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Observe Impact</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono">Cost ↑</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Operating expenditures scale non-linearly when bottlenecked routes require depot overtime and maintenance.
              </p>
            </div>

            {/* Col 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-rose-700 dark:text-rose-400 font-bold">
                03 • Strategic Exposure
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Understand Trade-off</span>
                <span className="text-rose-600 dark:text-rose-400 font-mono">Risk ↑</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Policy+ exposes the failure boundaries before municipal contracts and tax codes are irreversibly enacted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW POLICY+ WORKS                                                      */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Methodology"
          title="From Policy Idea to Decision"
          subtitle="A structured pipeline that separates numerical computation from AI synthesis, keeping leaders in total control."
        />

        <Timeline />
      </section>

      {/* ========================================================================= */}
      {/* 6. DARK AI SECTION ("Policy decisions deserve intelligence")               */}
      {/* ========================================================================= */}
      <section id="intelligence" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-slate-800">
          {/* Subtle violet ambient illumination */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-ai-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-ai-300 bg-ai-950/80 border border-ai-800/80 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-ai-400" />
              <span>AI Policy Interpretation Engine</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              Policy decisions deserve intelligence.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Turn simulation results into understandable insights. Policy+ connects deterministic calculations with generative AI to highlight vulnerabilities and trade-offs.
            </p>
          </div>

          {/* 3 AI Insight Cards in Dark Mode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-ai-950 border border-ai-800 text-ai-400 flex items-center justify-center text-xs font-bold font-mono">
                01
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium italic">
                "Operating costs increase faster beyond the 25% expansion threshold."
              </p>
              <span className="text-[11px] font-mono text-slate-400 block pt-2 border-t border-slate-800">
                Transport Elasticity Model
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-ai-950 border border-ai-800 text-ai-400 flex items-center justify-center text-xs font-bold font-mono">
                02
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium italic">
                "Waiting time improves significantly between 10–20% expansion."
              </p>
              <span className="text-[11px] font-mono text-slate-400 block pt-2 border-t border-slate-800">
                Headway Congestion Model
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-ai-950 border border-ai-800 text-ai-400 flex items-center justify-center text-xs font-bold font-mono">
                03
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium italic">
                "Demand assumptions are the largest uncertainty in this scenario."
              </p>
              <span className="text-[11px] font-mono text-slate-400 block pt-2 border-t border-slate-800">
                Sensitivity Matrix Risk
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TRUST / EXPLAINABILITY SECTION                                         */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Governance & Ethics"
          title="Built for decisions, not black boxes."
          subtitle="Three non-negotiable principles that prevent algorithmic overconfidence and ensure transparent public accountability."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Principle 1 */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-soft-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Deterministic Numbers
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Core policy metrics come from verified mathematical and econometric simulation logic. Numbers are never fabricated by language models.
            </p>
          </div>

          {/* Principle 2 */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-soft-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-ai-50 dark:bg-ai-950/60 border border-ai-200 dark:border-ai-800 text-ai-700 dark:text-ai-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              AI-Assisted Analysis
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Gemini AI analyzes the deterministic outputs to identify second-order effects, summarize trade-offs, and suggest risk mitigations.
            </p>
          </div>

          {/* Principle 3 */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-soft-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Human-Led Decisions
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              The system supports policy leaders rather than replacing them. Final value judgements and resource allocations remain human.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FINAL CTA                                                              */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 sm:p-16 shadow-soft-lg space-y-6">
          <Badge variant="ai" size="md">
            Policy Decision Intelligence
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white max-w-2xl mx-auto leading-tight">
            Don't just predict the outcome. Stress-test it.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Explore the consequences of policy decisions before they reach the real world.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Button
              to="/bus"
              size="lg"
              pill
              variant="primary"
              icon={ArrowRight}
              className="w-full sm:w-auto font-semibold shadow-soft-md"
            >
              Launch Policy+
            </Button>
            <Button
              to="/bus"
              size="lg"
              pill
              variant="secondary"
              className="w-full sm:w-auto font-medium"
            >
              Explore Bus Simulator
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
