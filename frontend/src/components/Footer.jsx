import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/**
 * Footer Component
 * Minimalist institutional platform footer for Policy+ with dark mode support
 */
export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f19] mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
                Policy
              </span>
              <span className="font-extrabold text-2xl text-ai-600">
                +
              </span>
            </div>
            <div className="text-xs font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400">
              AI-Powered Policy Stress Testing
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
              Simulate. Stress-Test. Decide.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Explore the consequences of policy decisions before they reach the real world. Deterministic simulations. AI-assisted analysis. Human-led decisions.
            </p>
          </div>

          {/* Policy Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold mb-4">
              Policy Domains
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <Link to="/bus" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-between">
                  <span>Bus Policy Stress Tester</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link to="/gst" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-between">
                  <span>GST Policy Simulator</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Overview & Analytics
                </Link>
              </li>
              <li>
                <a href="#intelligence" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  AI Intelligence Layer
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture / Trust */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold mb-4">
              Principles
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Deterministic Models</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-ai-500" />
                <span>Gemini Analysis Layer</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-slate-100" />
                <span>Human Governance</span>
              </li>
              <li className="pt-2 text-[11px] text-slate-400 dark:text-slate-600">
                Isolated domain subsystems
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} Policy+. Simulate. Stress-Test. Decide.
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400 dark:text-slate-600">
            Prototype for demonstration and policy experimentation.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
