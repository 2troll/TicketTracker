import { useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, ensureSettings } from '../db/database';
import type { Settings, Currency } from '../types';
import { seedFallbackRates, fetchLiveRates } from '../lib/currency';

let bootStarted = false;

async function bootstrap() {
  if (bootStarted) return;
  bootStarted = true;
  await seedFallbackRates();
  const s = await ensureSettings();
  const stale = !s.lastRatesFetch || Date.now() - s.lastRatesFetch > 1000 * 60 * 60 * 12;
  if (stale) {
    const ok = await fetchLiveRates();
    if (ok) await db.settings.put({ ...s, lastRatesFetch: Date.now() });
  }
}

export function useSettings() {
  const settings = useLiveQuery(() => db.settings.get('app'), [], null as Settings | null);

  useEffect(() => { bootstrap().catch(console.error); }, []);

  const setHomeCurrency = useCallback(async (code: Currency) => {
    const s = (await db.settings.get('app')) ?? await ensureSettings();
    await db.settings.put({ ...s, homeCurrency: code });
  }, []);

  const setTheme = useCallback(async (theme: Settings['theme']) => {
    const s = (await db.settings.get('app')) ?? await ensureSettings();
    await db.settings.put({ ...s, theme });
    const dark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('wander.theme', dark ? 'dark' : 'light');
  }, []);

  return { settings, setHomeCurrency, setTheme };
}
