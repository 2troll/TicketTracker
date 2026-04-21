import Tesseract from 'tesseract.js';
import type { Currency } from '../types';
import { CURRENCIES } from '../types';

export interface OcrResult {
  merchant?: string;
  amount?: number;
  currency?: Currency;
  date?: string;
  raw: string;
}

const CURRENCY_PATTERNS: [RegExp, Currency][] = [
  [/€/,      'EUR'],
  [/EUR/i,   'EUR'],
  [/\$/,     'USD'],
  [/USD/i,   'USD'],
  [/£/,      'GBP'],
  [/GBP/i,   'GBP'],
  [/¥/,      'JPY'],
  [/JPY/i,   'JPY'],
  [/CHF/i,   'CHF'],
  [/CNY|RMB/i, 'CNY'],
  [/THB|฿/,  'THB'],
  [/TRY|₺/,  'TRY'],
  [/INR|₹/,  'INR'],
  [/MXN/i,   'MXN'],
];

function detectCurrency(text: string): Currency | undefined {
  for (const [re, code] of CURRENCY_PATTERNS) if (re.test(text)) return code;
  for (const c of CURRENCIES) if (new RegExp(`\\b${c.code}\\b`).test(text)) return c.code;
  return undefined;
}

function detectAmount(text: string): number | undefined {
  const candidates = Array.from(text.matchAll(/(?:total|amount|importe|suma|grand total|balance)[^0-9\n]{0,8}([0-9]+[.,][0-9]{2})/gi))
    .map(m => m[1]);
  const fallback = Array.from(text.matchAll(/\b([0-9]{1,5}[.,][0-9]{2})\b/g)).map(m => m[1]);
  const raw = candidates[0] ?? fallback.sort((a, b) => parseFloat(b.replace(',', '.')) - parseFloat(a.replace(',', '.')))[0];
  if (!raw) return undefined;
  return parseFloat(raw.replace(',', '.'));
}

function detectDate(text: string): string | undefined {
  const m = text.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
  if (!m) return undefined;
  let [_, d, mo, y] = m;
  if (y.length === 2) y = '20' + y;
  const iso = `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  if (isNaN(Date.parse(iso))) return undefined;
  return iso;
}

function detectMerchant(text: string): string | undefined {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const line = lines.find(l => /^[A-Z][A-Z0-9 &'.,-]{2,}$/.test(l)) ?? lines[0];
  if (!line) return undefined;
  return line.slice(0, 40);
}

export async function runOCR(
  image: Blob | string,
  onProgress?: (p: number) => void
): Promise<OcrResult> {
  const result = await Tesseract.recognize(image, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text') onProgress?.(m.progress);
    },
  });
  const raw = result.data.text ?? '';
  return {
    merchant: detectMerchant(raw),
    amount:   detectAmount(raw),
    currency: detectCurrency(raw),
    date:     detectDate(raw),
    raw,
  };
}
