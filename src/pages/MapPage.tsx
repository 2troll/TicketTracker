import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Search, Layers, Plus, Navigation2, Moon, Satellite, Map as MapIcon, Check } from 'lucide-react';
import { db } from '../db/database';
import type { Ticket } from '../types';
import { TicketMap, type MapStyle } from '../components/map/TicketMap';
import { TopBar } from '../components/ui/TopBar';
import { IconButton } from '../components/ui/IconButton';
import { Sheet } from '../components/ui/Sheet';
import { Glass } from '../components/ui/Glass';

export default function MapPage() {
  const nav = useNavigate();
  const tickets = useLiveQuery(() => db.tickets.toArray(), [], []) ?? [];
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [style, setStyle] = useState<MapStyle>('minimal');
  const [layersOpen, setLayersOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return tickets;
    const q = query.toLowerCase();
    return tickets.filter(t =>
      t.merchant.toLowerCase().includes(q) ||
      (t.place ?? '').toLowerCase().includes(q) ||
      t.tags.some(tag => tag.includes(q))
    );
  }, [tickets, query]);

  const mapped = filtered.filter(t => t.lat && t.lng);
  const countries = new Set(mapped.map(t => (t.place ?? '').split(',').pop()?.trim()).filter(Boolean));

  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setFocus({ lat: pos.coords.latitude, lng: pos.coords.longitude, zoom: 13 }),
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const openTicket = (t: Ticket) => {
    if (t.id !== undefined) nav(`/tickets/${t.id}`);
  };

  return (
    <div className="relative h-[100dvh] overflow-hidden">
      <TicketMap tickets={filtered} onTapBubble={openTicket} focus={focus} style={style} />

      <div className="absolute inset-x-0 top-0 pt-safe pointer-events-none z-[500]">
        <TopBar
          large
          subtitle={`${mapped.length} tickets · ${countries.size || 0} places`}
          title="Your Journey"
        />
        <div className="px-5 mt-3 pointer-events-auto">
          <Glass className="flex items-center gap-2 px-3 h-12 rounded-full">
            <Search size={18} className="text-ink-3" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search merchant, place, tag…"
              className="flex-1 bg-transparent outline-none text-[15px]"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-ink-3 text-sm">Clear</button>
            )}
          </Glass>
        </div>
      </div>

      <div
        className="absolute right-4 flex flex-col gap-2 z-[500]"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)' }}
      >
        <IconButton icon={<Navigation2 size={18} />} onClick={locate} aria-label="Locate me" />
        <IconButton icon={<Layers size={18} />} onClick={() => setLayersOpen(true)} aria-label="Map style" />
        <IconButton
          icon={<Plus size={20} />}
          tone="solid"
          onClick={() => nav('/add')}
          aria-label="Add ticket"
          className="bg-gradient-to-br from-accent-500 to-[#9b5bff] shadow-[0_10px_24px_-6px_rgba(59,91,255,.6)]"
        />
      </div>

      <Sheet open={layersOpen} onClose={() => setLayersOpen(false)} title="Map style" detents="medium">
        <div className="grid grid-cols-3 gap-2">
          <StyleChoice
            label="Minimal"
            active={style === 'minimal'}
            onClick={() => { setStyle('minimal'); setLayersOpen(false); }}
            icon={<MapIcon size={22} />}
            gradient="from-slate-200 to-slate-300"
          />
          <StyleChoice
            label="Satellite"
            active={style === 'satellite'}
            onClick={() => { setStyle('satellite'); setLayersOpen(false); }}
            icon={<Satellite size={22} />}
            gradient="from-emerald-300 to-sky-400"
          />
          <StyleChoice
            label="Dark"
            active={style === 'dark'}
            onClick={() => { setStyle('dark'); setLayersOpen(false); }}
            icon={<Moon size={22} />}
            gradient="from-slate-700 to-slate-900"
          />
        </div>
        <div className="text-xs text-ink-3 mt-4 px-1">
          Tap a pin to see ticket info, then tap the bubble to open it.
        </div>
      </Sheet>
    </div>
  );
}

function StyleChoice({
  label, active, onClick, icon, gradient,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`press glass rounded-2xl p-3 flex flex-col items-center gap-2 relative ${
        active ? 'ring-2 ring-accent-500' : ''
      }`}
    >
      <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${gradient} grid place-items-center text-white`}>
        {icon}
      </div>
      <div className="font-semibold text-sm">{label}</div>
      {active && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent-500 text-white grid place-items-center">
          <Check size={14} />
        </div>
      )}
    </button>
  );
}
