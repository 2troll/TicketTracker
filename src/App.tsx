import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TabBar } from './components/ui/TabBar';
import { ToastProvider } from './components/ui/Toast';
import MapPage from './pages/MapPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AddPage from './pages/AddPage';
import CurrencyPage from './pages/CurrencyPage';
import TicketsPage from './pages/TicketsPage';
import SettingsPage from './pages/SettingsPage';
import { ensureSettings } from './db/database';
import { seedFallbackRates } from './lib/currency';

function Shell() {
  const loc = useLocation();
  const hideTabBar = false;

  return (
    <>
      <main className="animate-fade-in">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/tickets/:id" element={<AddPage />} />
          <Route path="/currency" element={<CurrencyPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideTabBar && <TabBar />}
    </>
  );
}

export default function App() {
  useEffect(() => {
    ensureSettings().catch(console.error);
    seedFallbackRates().catch(console.error);
  }, []);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </ToastProvider>
  );
}
