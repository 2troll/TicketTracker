import { useEffect, useState } from 'react';
import { ArrowUpDown, RefreshCw, Check } from 'lucide-react';
import { TopBar } from '../components/ui/TopBar';
import { Glass } from '../components/ui/Glass';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { CURRENCIES } from '../types';
import type { Currency } from '../types';
import { convert, fetchLiveRates, getRate, setManualRate } from '../lib/currency';
import { useToast } from '../components/ui/Toast';
import { useSettings } from '../stores/useSettings';
import { fmtMoney } from '../lib/format';
import { db } from '../db/database';

export default function CurrencyPage() {
  const { settings, setHomeCurrency } = useSettings();
  const { show } = useToast();
  const [from, setFrom] = useState<Currency>('USD');
  const [to, setTo] = useState<Currency>('EUR');
  const [amount, setAmount] = useState('100');
  const [result, setResult] = useState<number>(0);
  const [picking, setPicking] = useState<null | 'from' | 'to' | 'home'>(null);
  const [rateFrom, setRateFrom] = useState(1);
  const [rateTo, setRateTo] = useState(1);
  const [updated, setUpdated] = useState<number | null>(null);
  const [didSeedHome, setDidSeedHome] = useState(false);

  useEffect(() => {
    if (settings && !didSeedHome) {
      setTo(settings.homeCurrency);
      setDidSeedHome(true);
    }
  }, [settings, didSeedHome]);

  useEffect(() => {
    const n = parseFloat(amount.replace(',', '.'));
    const safe = isFinite(n) ? n : 0;
    (async () => {
      const r = await convert(safe, from, to);
      setResult(r);
      setRateFrom(await getRate(from));
      setRateTo(await getRate(to));
      const row = await db.rates.get(from);
      setUpdated(row?.updatedAt ?? null);
    })();
  }, [amount, from, to]);

  const swap = () => { const a = from; setFrom(to); setTo(a); };

  const refresh = async () => {
    show('Updating rates…');
    const ok = await fetchLiveRates();
    show(ok ? 'Rates updated' : 'Using cached rates');
    const r = await convert(parseFloat(amount.replace(',', '.')) || 0, from, to);
    setResult(r);
    const row = await db.rates.get(from);
    setUpdated(row?.updatedAt ?? null);
  };

  const oneUnit = rateFrom && rateTo ? rateTo / rateFrom : 1;

  return (
    <div className="min-h-[100dvh] pb-32">
      <TopBar large subtitle="Currency" title="Converter" />

      <div className="px-5 mt-4">
        <Glass padded className="space-y-4">
          <Row
            side="From"
            code={from}
            onPick={() => setPicking('from')}
            value={amount}
            onChange={setAmount}
            editable
          />
          <div className="flex justify-center">
            <button
              onClick={swap}
              className="press w-11 h-11 rounded-full glass grid place-items-center"
              aria-label="Swap"
            >
              <ArrowUpDown size={18} />
            </button>
          </div>
          <Row
            side="To"
            code={to}
            onPick={() => setPicking('to')}
            value={result.toFixed(2)}
            editable={false}
          />
        </Glass>
      </div>

      <div className="px-5 mt-4">
        <Glass padded>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-ink-3 font-semibold">Rate</div>
              <div className="font-bold text-lg mt-0.5">
                1 {from} = {oneUnit.toFixed(4)} {to}
              </div>
              <div className="text-xs text-ink-3 mt-1">
                {updated ? `Updated ${new Date(updated).toLocaleString()}` : 'Manual / cached'}
              </div>
            </div>
            <button onClick={refresh} className="press glass rounded-full w-11 h-11 grid place-items-center">
              <RefreshCw size={16} />
            </button>
          </div>
        </Glass>
      </div>

      <div className="px-5 mt-4">
        <Glass padded>
          <div className="text-xs uppercase tracking-widest text-ink-3 font-semibold mb-2">Home currency</div>
          <button onClick={() => setPicking('home')} className="press w-full text-left flex items-center justify-between">
            <div>
              <div className="font-bold text-lg">{settings?.homeCurrency ?? 'EUR'}</div>
              <div className="text-xs text-ink-3">Used everywhere to show totals</div>
            </div>
            <span className="text-accent-500 font-semibold">Change</span>
          </button>
        </Glass>
      </div>

      <div className="px-5 mt-4">
        <Glass padded>
          <div className="text-xs uppercase tracking-widest text-ink-3 font-semibold mb-2">Manual rate</div>
          <ManualRate from={from} onSaved={() => show('Manual rate saved')} />
        </Glass>
      </div>

      <Sheet open={picking !== null} onClose={() => setPicking(null)} title="Pick currency">
        <div className="grid grid-cols-2 gap-2">
          {CURRENCIES.map(c => {
            const active = (picking === 'from' && c.code === from) ||
                           (picking === 'to' && c.code === to) ||
                           (picking === 'home' && c.code === settings?.homeCurrency);
            return (
              <button
                key={c.code}
                onClick={() => {
                  if (picking === 'from') setFrom(c.code);
                  if (picking === 'to') setTo(c.code);
                  if (picking === 'home') setHomeCurrency(c.code);
                  setPicking(null);
                }}
                className={`press h-14 rounded-2xl px-3 flex items-center gap-3 ${active ? 'bg-gradient-to-br from-accent-500 to-[#9b5bff] text-white' : 'glass'}`}
              >
                <span className="text-lg font-bold w-8 text-center">{c.symbol}</span>
                <div className="text-left flex-1">
                  <div className="font-bold">{c.code}</div>
                  <div className="text-xs opacity-70 truncate">{c.name}</div>
                </div>
                {active && <Check size={16} />}
              </button>
            );
          })}
        </div>
      </Sheet>
    </div>
  );
}

function Row({
  side, code, onPick, value, onChange, editable,
}: {
  side: string;
  code: Currency;
  onPick: () => void;
  value: string;
  onChange?: (v: string) => void;
  editable: boolean;
}) {
  const meta = CURRENCIES.find(c => c.code === code)!;
  return (
    <div className="flex items-center gap-3">
      <button onClick={onPick} className="press w-20 h-14 rounded-2xl glass flex flex-col items-center justify-center">
        <span className="text-xs font-semibold text-ink-3">{side}</span>
        <span className="font-bold text-lg -mt-0.5">{code}</span>
      </button>
      <div className="flex-1 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl font-bold text-ink-3">{meta.symbol}</span>
        {editable ? (
          <input
            type="number"
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full h-14 pl-10 pr-3 rounded-2xl glass text-right text-2xl font-extrabold tracking-[-0.02em] outline-none"
          />
        ) : (
          <div className="w-full h-14 pl-10 pr-3 rounded-2xl glass grid place-items-end">
            <div className="text-2xl font-extrabold tracking-[-0.02em]">{fmtMoney(parseFloat(value) || 0, code)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ManualRate({ from, onSaved }: { from: Currency; onSaved: () => void }) {
  const [val, setVal] = useState('');
  useEffect(() => {
    getRate(from).then(r => setVal(r.toFixed(4)));
  }, [from]);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <div className="text-sm text-ink-2">1 USD =</div>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-full h-11 rounded-xl glass px-3 font-bold text-lg outline-none mt-1"
        />
        <div className="text-xs text-ink-3 mt-1">{from}</div>
      </div>
      <Button
        onClick={async () => {
          const n = parseFloat(val);
          if (!isFinite(n) || n <= 0) return;
          await setManualRate(from, n);
          onSaved();
        }}
      >
        Save
      </Button>
    </div>
  );
}
