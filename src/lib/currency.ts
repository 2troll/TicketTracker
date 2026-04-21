import { db } from '../db/database';
import type { Currency, Rate } from '../types';

const FALLBACK_RATES: Record<Currency, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 155, CNY: 7.2,
  CHF: 0.88, CAD: 1.37, AUD: 1.52, MXN: 17.1, BRL: 5.1,
  INR: 83.4, KRW: 1360, THB: 35.8, TRY: 32.5,
  SEK: 10.6, NOK: 10.9, DKK: 6.9, SGD: 1.34, HKD: 7.82, ZAR: 18.2,
};

export async function seedFallbackRates() {
  const now = Date.now();
  const all = await db.rates.toArray();
  if (all.length) return;
  await db.rates.bulkPut(
    Object.entries(FALLBACK_RATES).map(([code, perUSD]) => ({ code, perUSD, updatedAt: now }))
  );
}

export async function fetchLiveRates(): Promise<boolean> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) return false;
    const json = await res.json();
    if (!json?.rates) return false;
    const now = Date.now();
    const entries: Rate[] = Object.entries(json.rates).map(([code, v]) => ({
      code, perUSD: Number(v), updatedAt: now,
    }));
    await db.rates.bulkPut(entries);
    return true;
  } catch {
    return false;
  }
}

export async function getRate(code: Currency): Promise<number> {
  const row = await db.rates.get(code);
  return row?.perUSD ?? FALLBACK_RATES[code] ?? 1;
}

export async function convert(amount: number, from: Currency, to: Currency): Promise<number> {
  if (from === to) return amount;
  const [rFrom, rTo] = await Promise.all([getRate(from), getRate(to)]);
  const inUSD = amount / rFrom;
  return inUSD * rTo;
}

export async function setManualRate(code: Currency, perUSD: number) {
  await db.rates.put({ code, perUSD, updatedAt: Date.now(), manual: true });
}
