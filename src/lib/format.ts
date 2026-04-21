import { CURRENCIES } from '../types';

export function fmtMoney(amount: number, currency: string, opts: { signed?: boolean } = {}) {
  try {
    const s = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
    return opts.signed && amount > 0 ? `+${s}` : s;
  } catch {
    const meta = CURRENCIES.find(c => c.code === currency);
    return `${meta?.symbol ?? ''}${amount.toFixed(2)} ${currency}`;
  }
}

export function currencySymbol(code: string) {
  return CURRENCIES.find(c => c.code === code)?.symbol ?? code;
}

export function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function fmtDateShort(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
