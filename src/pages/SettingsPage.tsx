import { useState } from 'react';
import { ChevronRight, Moon, Sun, Smartphone, Download, Trash2 } from 'lucide-react';
import { TopBar } from '../components/ui/TopBar';
import { Glass } from '../components/ui/Glass';
import { Sheet } from '../components/ui/Sheet';
import { Button } from '../components/ui/Button';
import { Segmented } from '../components/ui/Segmented';
import { CURRENCIES } from '../types';
import { useSettings } from '../stores/useSettings';
import { db } from '../db/database';
import { useToast } from '../components/ui/Toast';

export default function SettingsPage() {
  const { settings, setHomeCurrency, setTheme } = useSettings();
  const { show } = useToast();
  const [pickCur, setPickCur] = useState(false);

  const exportData = async () => {
    const [tickets, folders, rates] = await Promise.all([
      db.tickets.toArray(), db.folders.toArray(), db.rates.toArray(),
    ]);
    const blob = new Blob([JSON.stringify({ tickets, folders, rates }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wander-export-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    show('Exported');
  };

  const wipe = async () => {
    if (!confirm('Delete ALL tickets and folders? This cannot be undone.')) return;
    await db.tickets.clear();
    await db.folders.clear();
    show('All data cleared');
  };

  return (
    <div className="min-h-[100dvh] pb-32">
      <TopBar large subtitle="Preferences" title="Settings" />

      <div className="px-5 mt-4 space-y-3">
        <Glass padded>
          <div className="text-xs uppercase tracking-widest text-ink-3 font-semibold mb-2">Appearance</div>
          <Segmented
            value={settings?.theme ?? 'auto'}
            onChange={(v) => setTheme(v as any)}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'auto', label: 'Auto' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
          <div className="text-xs text-ink-3 mt-2 flex items-center gap-3">
            <Sun size={12} /> <Smartphone size={12} /> <Moon size={12} />
            <span>Glass surfaces adapt to your theme.</span>
          </div>
        </Glass>

        <button onClick={() => setPickCur(true)} className="press w-full text-left">
          <Glass padded className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl grid place-items-center bg-gradient-to-br from-accent-500/20 to-[#9b5bff]/20 font-bold">
              {CURRENCIES.find(c => c.code === settings?.homeCurrency)?.symbol ?? '€'}
            </div>
            <div className="flex-1">
              <div className="font-bold">Home currency</div>
              <div className="text-xs text-ink-3">{settings?.homeCurrency ?? 'EUR'} · used for totals</div>
            </div>
            <ChevronRight size={16} className="text-ink-3" />
          </Glass>
        </button>

        <button onClick={exportData} className="press w-full text-left">
          <Glass padded className="flex items-center gap-3">
            <Download size={18} className="text-accent-500" />
            <div className="flex-1">
              <div className="font-bold">Export data</div>
              <div className="text-xs text-ink-3">Download a JSON backup</div>
            </div>
            <ChevronRight size={16} className="text-ink-3" />
          </Glass>
        </button>

        <button onClick={wipe} className="press w-full text-left">
          <Glass padded className="flex items-center gap-3">
            <Trash2 size={18} className="text-[#ff4d6d]" />
            <div className="flex-1">
              <div className="font-bold">Erase all data</div>
              <div className="text-xs text-ink-3">Clear tickets & folders</div>
            </div>
          </Glass>
        </button>

        <Glass padded>
          <div className="text-xs uppercase tracking-widest text-ink-3 font-semibold mb-1">About</div>
          <div className="font-bold">Wander</div>
          <div className="text-xs text-ink-3">Travel receipts, mapped and understood.</div>
        </Glass>
      </div>

      <Sheet open={pickCur} onClose={() => setPickCur(false)} title="Home currency">
        <div className="grid grid-cols-2 gap-2">
          {CURRENCIES.map(c => (
            <button
              key={c.code}
              onClick={() => { setHomeCurrency(c.code); setPickCur(false); }}
              className={`press h-14 rounded-2xl px-3 flex items-center gap-3 ${
                c.code === settings?.homeCurrency ? 'bg-gradient-to-br from-accent-500 to-[#9b5bff] text-white' : 'glass'
              }`}
            >
              <span className="text-lg font-bold w-8 text-center">{c.symbol}</span>
              <div className="text-left">
                <div className="font-bold">{c.code}</div>
                <div className="text-xs opacity-70">{c.name}</div>
              </div>
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}
