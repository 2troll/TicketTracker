import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Camera, Image as ImageIcon, MapPin, Tag as TagIcon, FolderPlus, Trash2, Loader2 } from 'lucide-react';
import { db } from '../db/database';
import type { Ticket, Tag } from '../types';
import { TAG_META, CURRENCIES } from '../types';
import { TopBar } from '../components/ui/TopBar';
import { IconButton } from '../components/ui/IconButton';
import { Glass } from '../components/ui/Glass';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Sheet } from '../components/ui/Sheet';
import { Pill } from '../components/ui/Pill';
import { Segmented } from '../components/ui/Segmented';
import { LocationPicker } from '../components/map/LocationPicker';
import { todayISO } from '../lib/format';
import { runOCR } from '../lib/ocr';
import { reverseGeocode, forwardGeocode } from '../lib/geocode';
import { useSettings } from '../stores/useSettings';
import { useToast } from '../components/ui/Toast';

export default function AddPage() {
  const nav = useNavigate();
  const { id } = useParams();
  const editing = id !== undefined ? Number(id) : null;
  const { settings } = useSettings();
  const { show } = useToast();
  const folders = useLiveQuery(() => db.folders.toArray(), [], []) ?? [];

  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [date, setDate] = useState(todayISO());
  const [tags, setTags] = useState<Tag[]>([]);
  const [folderId, setFolderId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [place, setPlace] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const [sheet, setSheet] = useState<null | 'currency' | 'place' | 'folder'>(null);

  useEffect(() => {
    if (editing === null) {
      if (settings?.homeCurrency) setCurrency(settings.homeCurrency);
      return;
    }
    (async () => {
      const t = await db.tickets.get(editing);
      if (!t) return;
      setMerchant(t.merchant);
      setAmount(String(t.amount));
      setCurrency(t.currency);
      setDate(t.date);
      setTags(t.tags);
      setFolderId(t.folderId ?? null);
      setNotes(t.notes ?? '');
      setPlace(t.place ?? null);
      if (t.lat && t.lng) setCoords({ lat: t.lat, lng: t.lng });
    })();
  }, [editing, settings]);

  const scan = async (file: File) => {
    setScanning(true);
    setScanProgress(0);
    try {
      const r = await runOCR(file, (p) => setScanProgress(p));
      if (r.merchant) setMerchant(r.merchant);
      if (r.amount) setAmount(String(r.amount));
      if (r.currency) setCurrency(r.currency);
      if (r.date) setDate(r.date);
      show('Scanned — check the fields');
    } catch {
      show('Scan failed');
    } finally {
      setScanning(false);
    }
  };

  const locate = () => {
    if (!navigator.geolocation) return show('Geolocation unavailable');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(c);
        const label = await reverseGeocode(c.lat, c.lng);
        setPlace(label);
        show(label ? `Located: ${label}` : 'Location saved');
      },
      () => show('Location denied'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const toggleTag = (tag: Tag) =>
    setTags(t => (t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag]));

  const save = async () => {
    const amt = parseFloat(amount.replace(',', '.'));
    if (!merchant.trim() || !isFinite(amt) || amt <= 0) {
      show('Merchant and amount required');
      return;
    }
    const patch = {
      merchant: merchant.trim(),
      amount: amt,
      currency,
      date,
      tags,
      folderId: folderId ?? null,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      place,
      notes: notes.trim() || null,
    };
    if (editing !== null) {
      await db.tickets.update(editing, patch);
    } else {
      await db.tickets.add({ ...patch, createdAt: Date.now() } as Ticket);
    }
    show(editing !== null ? 'Saved' : 'Ticket added');
    nav('/');
  };

  const remove = async () => {
    if (editing === null) return;
    await db.tickets.delete(editing);
    show('Deleted');
    nav('/');
  };

  return (
    <div className="min-h-[100dvh] pb-40">
      <TopBar
        large
        subtitle={editing ? 'Edit' : 'New'}
        title={editing !== null ? 'Edit ticket' : 'Add ticket'}
        trailing={editing !== null ? (
          <IconButton icon={<Trash2 size={18} />} onClick={remove} aria-label="Delete" />
        ) : undefined}
      />

      {editing === null && (
        <div className="px-5 mt-5">
          <Glass padded className="relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-gradient-to-br from-accent-500/30 to-[#9b5bff]/30 blur-2xl" />
            <div className="relative">
              <div className="text-xs uppercase tracking-widest text-ink-3 font-semibold">Scan receipt</div>
              <div className="font-bold text-lg tracking-tight mt-0.5">Point your camera at a ticket</div>
              <div className="text-ink-3 text-sm mt-1">We'll auto-fill merchant, amount, currency, and date.</div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => camRef.current?.click()} size="md" disabled={scanning}>
                  {scanning ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
                  {scanning ? `Scanning ${Math.round(scanProgress * 100)}%` : 'Camera'}
                </Button>
                <Button onClick={() => fileRef.current?.click()} size="md" variant="glass" disabled={scanning}>
                  <ImageIcon size={16} /> Gallery
                </Button>
              </div>
            </div>
            <input ref={camRef} type="file" accept="image/*" capture="environment" hidden
              onChange={(e) => e.target.files?.[0] && scan(e.target.files[0])} />
            <input ref={fileRef} type="file" accept="image/*" hidden
              onChange={(e) => e.target.files?.[0] && scan(e.target.files[0])} />
          </Glass>
        </div>
      )}

      <div className="px-5 mt-4 space-y-3">
        <Input label="Merchant" placeholder="e.g. Starbucks" value={merchant} onChange={(e) => setMerchant(e.target.value)} />

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Input label="Amount" type="number" inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <div className="flex flex-col">
            <span className="block text-[11px] font-semibold tracking-wider uppercase text-ink-3 mb-1.5 pl-1">Currency</span>
            <button
              onClick={() => setSheet('currency')}
              className="press glass rounded-2xl h-12 px-4 font-bold tracking-tight"
            >
              {currency}
            </button>
          </div>
        </div>

        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <button
          onClick={() => setSheet('place')}
          className="press glass rounded-2xl w-full text-left px-4 h-12 flex items-center gap-3"
        >
          <MapPin size={18} className="text-accent-500" />
          <span className="flex-1 truncate">{place ?? 'Add location'}</span>
          {coords && <span className="text-xs text-ink-3">{coords.lat.toFixed(2)}, {coords.lng.toFixed(2)}</span>}
        </button>

        <button
          onClick={() => setSheet('folder')}
          className="press glass rounded-2xl w-full text-left px-4 h-12 flex items-center gap-3"
        >
          <FolderPlus size={18} className="text-accent-500" />
          <span className="flex-1 truncate">
            {folderId ? folders.find(f => f.id === folderId)?.name ?? 'Folder' : 'No folder'}
          </span>
        </button>

        <div>
          <div className="block text-[11px] font-semibold tracking-wider uppercase text-ink-3 mb-2 pl-1 flex items-center gap-1.5">
            <TagIcon size={12} /> Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TAG_META) as Tag[]).map(tag => {
              const m = TAG_META[tag];
              const active = tags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`press inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-sm font-semibold border transition-colors ${
                    active
                      ? 'text-white border-transparent'
                      : 'glass text-ink border-transparent'
                  }`}
                  style={active ? { background: m.color } : undefined}
                >
                  <span>{m.emoji}</span>{m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="block text-[11px] font-semibold tracking-wider uppercase text-ink-3 mb-1.5 pl-1">Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional details…"
            className="glass rounded-2xl w-full px-3 py-3 min-h-24 outline-none text-[15px] placeholder:text-ink-3"
          />
        </div>
      </div>

      <div className="fixed left-0 right-0 bottom-0 z-[700] px-5 pointer-events-none" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)' }}>
        <div className="max-w-[560px] mx-auto pointer-events-auto">
          <Button block size="lg" onClick={save}>Save ticket</Button>
        </div>
      </div>

      <Sheet open={sheet === 'currency'} onClose={() => setSheet(null)} title="Currency" detents="tall">
        <div className="grid grid-cols-2 gap-2">
          {CURRENCIES.map(c => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c.code); setSheet(null); }}
              className={`press h-14 rounded-2xl px-3 flex items-center gap-3 ${
                c.code === currency ? 'bg-gradient-to-br from-accent-500 to-[#9b5bff] text-white' : 'glass'
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

      <Sheet open={sheet === 'place'} onClose={() => setSheet(null)} title="Location" detents="tall">
        <PlaceEditor
          current={place}
          startCoords={coords}
          onClose={() => setSheet(null)}
          onSet={(p) => { setPlace(p.label); setCoords({ lat: p.lat, lng: p.lng }); setSheet(null); }}
          onClear={() => { setPlace(null); setCoords(null); setSheet(null); }}
          onUseCurrent={async () => { setSheet(null); locate(); }}
        />
      </Sheet>

      <Sheet open={sheet === 'folder'} onClose={() => setSheet(null)} title="Folder" detents="medium">
        <FolderPicker
          folders={folders}
          active={folderId}
          onPick={(fid) => { setFolderId(fid); setSheet(null); }}
        />
      </Sheet>
    </div>
  );
}

function PlaceEditor({
  current, startCoords, onClose, onSet, onClear, onUseCurrent,
}: {
  current: string | null;
  startCoords: { lat: number; lng: number } | null;
  onClose: () => void;
  onSet: (p: { lat: number; lng: number; label: string }) => void;
  onClear: () => void;
  onUseCurrent: () => void;
}) {
  const [mode, setMode] = useState<'search' | 'pin'>('search');
  const [q, setQ] = useState('');
  const [results, setResults] = useState<{ lat: number; lng: number; label: string }[]>([]);

  useEffect(() => {
    if (!q.trim() || q.length < 3) { setResults([]); return; }
    const id = setTimeout(async () => {
      const r = await forwardGeocode(q);
      setResults(r);
    }, 350);
    return () => clearTimeout(id);
  }, [q]);

  return (
    <div className="space-y-3">
      {current && (
        <div className="glass rounded-2xl px-4 py-3 text-sm flex items-center gap-2">
          <MapPin size={14} className="text-accent-500" />
          <span className="flex-1 truncate"><b>{current}</b></span>
          <button onClick={onClear} className="press text-xs font-semibold text-ink-3">Clear</button>
        </div>
      )}

      <button
        onClick={onUseCurrent}
        className="press w-full glass rounded-2xl h-12 px-4 flex items-center gap-3 text-left"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-[#9b5bff] grid place-items-center text-white">
          <MapPin size={14} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">Use my current location</div>
          <div className="text-xs text-ink-3">GPS — automatic</div>
        </div>
      </button>

      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: 'search', label: 'Search' },
          { value: 'pin',    label: 'Pick on map' },
        ]}
      />

      {mode === 'search' ? (
        <div className="space-y-2">
          <Input
            leading={<MapPin size={16} />}
            placeholder="Search a city, street, or place"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          <div className="space-y-1.5 max-h-[40vh] overflow-y-auto no-scrollbar">
            {results.map((r, i) => (
              <button key={i} onClick={() => onSet(r)} className="press w-full text-left glass rounded-2xl px-4 py-3 text-sm">
                {r.label}
              </button>
            ))}
            {q.length >= 3 && results.length === 0 && (
              <div className="text-center text-sm text-ink-3 py-4">No matches</div>
            )}
          </div>
        </div>
      ) : (
        <LocationPicker
          initial={startCoords}
          onConfirm={(p) => onSet(p)}
        />
      )}

      <div className="flex justify-end pt-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}

function FolderPicker({
  folders, active, onPick,
}: {
  folders: { id?: number; name: string; emoji?: string }[];
  active: number | null;
  onPick: (id: number | null) => void;
}) {
  const [newName, setNewName] = useState('');
  const create = async () => {
    if (!newName.trim()) return;
    const id = await db.folders.add({ name: newName.trim(), emoji: '🧳', createdAt: Date.now() });
    setNewName('');
    onPick(id as number);
  };
  return (
    <div className="space-y-3">
      <button onClick={() => onPick(null)} className={`press w-full glass rounded-2xl px-4 h-12 text-left font-semibold ${active === null ? 'ring-2 ring-accent-500' : ''}`}>
        No folder
      </button>
      {folders.map(f => (
        <button key={f.id} onClick={() => onPick(f.id!)} className={`press w-full glass rounded-2xl px-4 h-12 text-left font-semibold flex items-center gap-2 ${active === f.id ? 'ring-2 ring-accent-500' : ''}`}>
          <span>{f.emoji ?? '📁'}</span>{f.name}
        </button>
      ))}
      <div className="flex gap-2 pt-2">
        <Input leading={<FolderPlus size={14} />} placeholder="New folder (e.g. Tokyo trip)" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <Button onClick={create}>Create</Button>
      </div>
    </div>
  );
}
