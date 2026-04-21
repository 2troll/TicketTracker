import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, Cell, PieChart, Pie,
} from 'recharts';
import { Link } from 'react-router-dom';
import { TrendingUp, Globe2, ArrowUpRight } from 'lucide-react';
import { db } from '../db/database';
import { TAG_META } from '../types';
import type { Tag } from '../types';
import { TopBar } from '../components/ui/TopBar';
import { Glass } from '../components/ui/Glass';
import { Segmented } from '../components/ui/Segmented';
import { fmtMoney } from '../lib/format';
import { convert } from '../lib/currency';
import { useSettings } from '../stores/useSettings';

type Range = '7d' | '30d' | '1y' | 'all';

export default function AnalyticsPage() {
  const { settings } = useSettings();
  const home = settings?.homeCurrency ?? 'EUR';
  const tickets = useLiveQuery(() => db.tickets.toArray(), [], []) ?? [];
  const [range, setRange] = useState<Range>('30d');
  const [converted, setConverted] = useState<{ id: number; home: number; ticket: typeof tickets[number] }[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const out = await Promise.all(
        tickets.map(async (t) => ({ id: t.id!, ticket: t, home: await convert(t.amount, t.currency, home) }))
      );
      if (!cancelled) setConverted(out);
    })();
    return () => { cancelled = true; };
  }, [tickets, home]);

  const cutoff = useMemo(() => {
    const d = new Date();
    if (range === '7d') d.setDate(d.getDate() - 7);
    else if (range === '30d') d.setDate(d.getDate() - 30);
    else if (range === '1y') d.setFullYear(d.getFullYear() - 1);
    else return null;
    return d;
  }, [range]);

  const scoped = useMemo(() => {
    if (!cutoff) return converted;
    return converted.filter(x => new Date(x.ticket.date) >= cutoff);
  }, [converted, cutoff]);

  const total = scoped.reduce((a, x) => a + x.home, 0);
  const count = scoped.length;
  const avg = count ? total / count : 0;

  const trend = useMemo(() => {
    const map = new Map<string, number>();
    scoped.forEach(x => {
      const key = x.ticket.date.slice(0, 10);
      map.set(key, (map.get(key) ?? 0) + x.home);
    });
    return Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b))
      .map(([date, value]) => ({ date, value }));
  }, [scoped]);

  const byTag = useMemo(() => {
    const m = new Map<Tag, number>();
    scoped.forEach(x => x.ticket.tags.forEach(t => m.set(t, (m.get(t) ?? 0) + x.home / x.ticket.tags.length)));
    return Array.from(m.entries())
      .filter(([tag]) => !!TAG_META[tag])
      .map(([tag, value]) => ({
        tag, value, label: TAG_META[tag].label, color: TAG_META[tag].color,
      }))
      .sort((a, b) => b.value - a.value);
  }, [scoped]);

  const byPlace = useMemo(() => {
    const m = new Map<string, number>();
    scoped.forEach(x => {
      const k = (x.ticket.place?.split(',').pop() ?? 'Unknown').trim();
      m.set(k, (m.get(k) ?? 0) + x.home);
    });
    return Array.from(m.entries()).map(([place, value]) => ({ place, value }))
      .sort((a, b) => b.value - a.value).slice(0, 6);
  }, [scoped]);

  return (
    <div className="min-h-[100dvh] pb-32">
      <TopBar large subtitle="Analytics" title="Spending" />

      <div className="px-5 mt-4">
        <Segmented
          value={range}
          onChange={setRange}
          options={[
            { value: '7d', label: '7D' },
            { value: '30d', label: '30D' },
            { value: '1y', label: '1Y' },
            { value: 'all', label: 'All' },
          ]}
        />
      </div>

      <div className="px-5 mt-5 grid grid-cols-2 gap-3">
        <Glass padded>
          <div className="text-xs uppercase tracking-widest text-ink-3 font-semibold">Total</div>
          <div className="text-[28px] font-extrabold tracking-[-0.02em] mt-1">{fmtMoney(total, home)}</div>
          <div className="text-xs text-ink-3 mt-1">{count} tickets</div>
        </Glass>
        <Glass padded>
          <div className="text-xs uppercase tracking-widest text-ink-3 font-semibold">Average</div>
          <div className="text-[28px] font-extrabold tracking-[-0.02em] mt-1">{fmtMoney(avg, home)}</div>
          <div className="text-xs text-ink-3 mt-1">per ticket</div>
        </Glass>
      </div>

      <div className="px-5 mt-4">
        <Glass padded>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-accent-500" />
              <h3 className="font-bold tracking-tight">Trend</h3>
            </div>
            <span className="text-xs text-ink-3">{home}</span>
          </div>
          <div className="h-40 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b5bff" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#9b5bff" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip formatter={(v: any) => fmtMoney(Number(v), home)} labelFormatter={(l) => l} />
                <Area type="monotone" dataKey="value" stroke="#3b5bff" strokeWidth={2.2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Glass>
      </div>

      {byTag.length > 0 && (
        <div className="px-5 mt-4">
          <Glass padded>
            <h3 className="font-bold tracking-tight mb-3">By category</h3>
            <div className="flex gap-4 items-center">
              <div className="w-28 h-28 relative">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={byTag} dataKey="value" innerRadius={34} outerRadius={54} paddingAngle={2} strokeWidth={0}>
                      {byTag.map((d) => <Cell key={d.tag} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {byTag.slice(0, 5).map(d => (
                  <div key={d.tag} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="flex-1 text-sm font-medium">{d.label}</span>
                    <span className="text-sm font-semibold tabular-nums">{fmtMoney(d.value, home)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Glass>
        </div>
      )}

      {byPlace.length > 0 && (
        <div className="px-5 mt-4">
          <Glass padded>
            <div className="flex items-center gap-2 mb-3">
              <Globe2 size={16} className="text-accent-500" />
              <h3 className="font-bold tracking-tight">Top places</h3>
            </div>
            <div className="h-44 -mx-2">
              <ResponsiveContainer>
                <BarChart data={byPlace} layout="vertical" margin={{ left: 8, right: 12, top: 4, bottom: 4 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="place" width={90} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'currentColor' }} />
                  <Tooltip formatter={(v: any) => fmtMoney(Number(v), home)} />
                  <Bar dataKey="value" radius={[10,10,10,10]} fill="url(#grad-bar)" />
                  <defs>
                    <linearGradient id="grad-bar" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b5bff" />
                      <stop offset="100%" stopColor="#9b5bff" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Glass>
        </div>
      )}

      {count === 0 && (
        <div className="px-5 mt-8">
          <Glass padded className="text-center py-10">
            <div className="text-4xl mb-2">📊</div>
            <div className="font-bold text-lg">No data yet</div>
            <div className="text-ink-3 text-sm mt-1">Scan your first ticket to see insights here.</div>
            <Link to="/add" className="inline-flex items-center gap-1 mt-4 text-accent-600 font-semibold text-sm">
              Add one now <ArrowUpRight size={14} />
            </Link>
          </Glass>
        </div>
      )}
    </div>
  );
}
