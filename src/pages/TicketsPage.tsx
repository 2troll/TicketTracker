import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Search, SlidersHorizontal, FolderOpen, Plus, Settings as SettingsIcon } from 'lucide-react';
import { db } from '../db/database';
import { TAG_META } from '../types';
import type { Tag } from '../types';
import { TopBar } from '../components/ui/TopBar';
import { IconButton } from '../components/ui/IconButton';
import { Glass } from '../components/ui/Glass';
import { Pill } from '../components/ui/Pill';
import { Segmented } from '../components/ui/Segmented';
import { fmtMoney, fmtDateShort } from '../lib/format';
import { convert } from '../lib/currency';
import { useSettings } from '../stores/useSettings';

export default function TicketsPage() {
  const nav = useNavigate();
  const { settings } = useSettings();
  const home = settings?.homeCurrency ?? 'EUR';
  const tickets = useLiveQuery(() => db.tickets.orderBy('date').reverse().toArray(), [], []) ?? [];
  const folders = useLiveQuery(() => db.folders.toArray(), [], []) ?? [];
  const [view, setView] = useState<'all' | 'folders'>('all');
  const [query, setQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<Tag | null>(null);
  const [homeTotals, setHomeTotals] = useState<Record<number, number>>({});

  useEffect(() => {
    (async () => {
      const out: Record<number, number> = {};
      await Promise.all(tickets.map(async t => {
        out[t.id!] = await convert(t.amount, t.currency, home);
      }));
      setHomeTotals(out);
    })();
  }, [tickets, home]);

  const filtered = useMemo(() => {
    return tickets.filter(t => {
      if (tagFilter && !t.tags.includes(tagFilter)) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return t.merchant.toLowerCase().includes(q)
        || (t.place ?? '').toLowerCase().includes(q)
        || (t.notes ?? '').toLowerCase().includes(q);
    });
  }, [tickets, tagFilter, query]);

  const byFolder = useMemo(() => {
    const map = new Map<number | 'none', typeof tickets>();
    tickets.forEach(t => {
      const key = t.folderId ?? 'none';
      const list = map.get(key) ?? [];
      list.push(t);
      map.set(key, list);
    });
    return map;
  }, [tickets]);

  return (
    <div className="min-h-[100dvh] pb-32">
      <TopBar
        large
        subtitle="Library"
        title="All tickets"
        trailing={<IconButton icon={<SettingsIcon size={18} />} onClick={() => nav('/settings')} aria-label="Settings" />}
      />

      <div className="px-5 mt-3">
        <Glass className="flex items-center gap-2 px-3 h-11 rounded-full">
          <Search size={16} className="text-ink-3" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tickets"
            className="flex-1 bg-transparent outline-none text-[15px]"
          />
        </Glass>
      </div>

      <div className="px-5 mt-3">
        <Segmented
          value={view}
          onChange={setView}
          options={[
            { value: 'all', label: 'All' },
            { value: 'folders', label: 'Folders' },
          ]}
        />
      </div>

      <div className="px-5 mt-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setTagFilter(null)}
            className={`press px-3 h-8 rounded-full text-xs font-semibold ${!tagFilter ? 'bg-ink text-white' : 'glass'}`}
          >
            All tags
          </button>
          {(Object.keys(TAG_META) as Tag[]).map(tag => {
            const m = TAG_META[tag];
            const active = tagFilter === tag;
            return (
              <button
                key={tag}
                onClick={() => setTagFilter(active ? null : tag)}
                className={`press inline-flex items-center gap-1 px-3 h-8 rounded-full text-xs font-semibold ${active ? 'text-white' : 'glass'}`}
                style={active ? { background: m.color } : undefined}
              >
                <span>{m.emoji}</span>{m.label}
              </button>
            );
          })}
        </div>
      </div>

      {view === 'all' ? (
        <div className="px-5 mt-4 space-y-2">
          {filtered.map(t => (
            <button
              key={t.id}
              onClick={() => nav(`/tickets/${t.id}`)}
              className="press w-full text-left"
            >
              <Glass padded className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl grid place-items-center text-xl bg-gradient-to-br from-accent-500/20 to-[#9b5bff]/20">
                  {t.tags[0] && TAG_META[t.tags[0]] ? TAG_META[t.tags[0]].emoji : '🧾'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{t.merchant}</div>
                  <div className="text-xs text-ink-3 truncate">
                    {fmtDateShort(t.date)}{t.place ? ` · ${t.place}` : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold tracking-[-0.02em]">{fmtMoney(t.amount, t.currency)}</div>
                  {t.currency !== home && homeTotals[t.id!] !== undefined && (
                    <div className="text-xs text-ink-3">≈ {fmtMoney(homeTotals[t.id!], home)}</div>
                  )}
                </div>
              </Glass>
            </button>
          ))}
          {!filtered.length && <Empty />}
        </div>
      ) : (
        <div className="px-5 mt-4 space-y-3">
          <NewFolderButton />
          {folders.map(f => {
            const list = byFolder.get(f.id!) ?? [];
            const total = list.reduce((a, t) => a + (homeTotals[t.id!] ?? 0), 0);
            return (
              <div key={f.id}>
                <Glass padded className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl grid place-items-center text-xl bg-gradient-to-br from-accent-500/20 to-[#9b5bff]/20">
                    {f.emoji ?? '📁'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold">{f.name}</div>
                    <div className="text-xs text-ink-3">{list.length} tickets</div>
                  </div>
                  <div className="font-extrabold tabular-nums">{fmtMoney(total, home)}</div>
                </Glass>
              </div>
            );
          })}
          {byFolder.get('none') && (
            <div className="pt-2">
              <div className="text-xs uppercase tracking-widest text-ink-3 font-semibold mb-2 pl-1">Unfiled</div>
              {byFolder.get('none')!.slice(0, 3).map(t => (
                <Glass key={t.id} padded className="flex items-center gap-3 mb-2">
                  <FolderOpen size={18} className="text-ink-3" />
                  <div className="flex-1 truncate font-semibold">{t.merchant}</div>
                  <div className="text-sm font-bold">{fmtMoney(t.amount, t.currency)}</div>
                </Glass>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Empty() {
  return (
    <Glass padded className="text-center py-10">
      <div className="text-4xl mb-2">🧾</div>
      <div className="font-bold">Nothing here yet</div>
      <div className="text-ink-3 text-sm mt-1">Add your first ticket to get started.</div>
    </Glass>
  );
}

function NewFolderButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)} className="press w-full glass rounded-2xl h-14 flex items-center gap-2 justify-center font-semibold text-ink-2">
          <Plus size={16} /> New folder
        </button>
      ) : (
        <div className="glass rounded-2xl p-2 flex gap-2">
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Folder name"
            className="flex-1 h-10 px-3 rounded-xl bg-transparent outline-none"
          />
          <button
            onClick={async () => {
              if (!name.trim()) return setOpen(false);
              await db.folders.add({ name: name.trim(), emoji: '🧳', createdAt: Date.now() });
              setName(''); setOpen(false);
            }}
            className="press h-10 px-3 rounded-xl bg-gradient-to-br from-accent-500 to-[#9b5bff] text-white font-semibold"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
