import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '../context/ThemeContext';
import { useApiStatus } from '../hooks/useApiStatus';
import { cn } from '../utils/cn';

/**
 * Navbar Component
 * Minimalist premium navigation bar with typographic Policy+ mark, Theme toggle, and status
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { status } = useApiStatus();

  const navItems = [
    { to: '/', label: 'Overview', exact: true },
    { to: '/bus', label: '🚌 Bus' },
    { to: '/gst', label: '🧾 GST' },
    { to: '/intelligence', label: '✦ Intelligence' },
  ];

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* LEFT: Typographic Logo & Subtitle */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group" onClick={closeMobile}>
              <div className="flex items-center">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white transition-colors">
                  Policy
                </span>
                <span className="font-extrabold text-xl text-ai-600 transition-colors">
                  +
                </span>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                AI Policy Intelligence
              </span>
            </Link>
          </div>

          {/* CENTER: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              item.to.startsWith('/#') ? (
                <a
                  key={item.label}
                  href={item.to}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    cn(
                      'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-soft-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              )
            ))}
          </nav>

          {/* RIGHT: Theme Switcher, Status & Launch CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Status Indicator */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className={cn('w-2 h-2 rounded-full', status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
              <span>System Ready</span>
            </div>

            {/* THEME TOGGLE BUTTON */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-soft-xs"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Launch Simulator Pill Button */}
            <Button
              to="/bus"
              size="sm"
              pill
              variant="primary"
              icon={ArrowRight}
              className="shadow-soft-sm font-semibold"
            >
              Launch Simulator
            </Button>
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            <Button
              to="/bus"
              size="sm"
              pill
              variant="primary"
              className="text-xs px-3 py-1"
            >
              Launch
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2 shadow-soft-lg">
          {navItems.map((item) => (
            item.to.startsWith('/#') ? (
              <a
                key={item.label}
                href={item.to}
                onClick={closeMobile}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={closeMobile}
                className={({ isActive }) =>
                  cn(
                    'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )
                }
              >
                {item.label}
              </NavLink>
            )
          ))}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Engine Online
            </span>
            <span>Policy+ v1.0</span>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
