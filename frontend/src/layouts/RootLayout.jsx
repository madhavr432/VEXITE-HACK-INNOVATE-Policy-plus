import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

/**
 * RootLayout Component
 * Master layout frame with ThemeProvider, background textures, and navigation
 */
export function RootLayout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200 relative">
        {/* Background illumination effects */}
        <div className="fixed inset-0 bg-grid-institutional opacity-50 dark:opacity-30 pointer-events-none" />
        <div className="fixed top-0 inset-x-0 h-96 bg-lavender-glow pointer-events-none" />

        {/* Main navigation header */}
        <Navbar />

        {/* Main page view */}
        <main className="flex-1 relative z-10">
          <Outlet />
        </main>

        {/* Platform footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default RootLayout;
