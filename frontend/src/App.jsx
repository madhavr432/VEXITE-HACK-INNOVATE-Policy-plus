import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { LandingPage } from './pages/LandingPage';
import { BusPage } from './pages/BusPage';
import { GstPage } from './pages/GstPage';
import { IntelligencePage } from './pages/IntelligencePage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="bus" element={<BusPage />} />
          <Route path="gst" element={<GstPage />} />
          <Route path="intelligence" element={<IntelligencePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
