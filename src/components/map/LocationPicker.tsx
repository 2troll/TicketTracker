import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { reverseGeocode } from '../../lib/geocode';

interface Props {
  initial: { lat: number; lng: number } | null;
  onConfirm: (p: { lat: number; lng: number; label: string }) => void;
}

const TILE = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const TILE_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

function makeDraggableIcon() {
  return L.divIcon({
    className: 'ticket-pin',
    html: `<div class="pin-wrap"><div class="pin-halo"></div><div class="pin-core">✓</div></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  });
}

export function LocationPicker({ initial, onConfirm }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [coords, setCoords] = useState(initial ?? { lat: 20, lng: 0 });
  const [label, setLabel] = useState<string>('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (!el.current || mapRef.current) return;
    const dark = document.documentElement.classList.contains('dark');
    const start = initial ?? { lat: 20, lng: 0 };
    const startZoom = initial ? 14 : 2;
    const map = L.map(el.current, {
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
    }).setView([start.lat, start.lng], startZoom);
    L.tileLayer(dark ? TILE_DARK : TILE, { maxZoom: 19, crossOrigin: true }).addTo(map);

    const marker = L.marker([start.lat, start.lng], {
      icon: makeDraggableIcon(),
      draggable: true,
    }).addTo(map);
    markerRef.current = marker;

    const update = (ll: L.LatLng) => {
      setCoords({ lat: ll.lat, lng: ll.lng });
    };

    marker.on('dragend', () => update(marker.getLatLng()));
    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      update(e.latlng);
    });

    mapRef.current = map;

    if (initial) {
      setResolving(true);
      reverseGeocode(initial.lat, initial.lng).then(l => {
        setLabel(l ?? `${initial.lat.toFixed(4)}, ${initial.lng.toFixed(4)}`);
        setResolving(false);
      });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setResolving(true);
    const id = setTimeout(async () => {
      const l = await reverseGeocode(coords.lat, coords.lng);
      if (cancelled) return;
      setLabel(l ?? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
      setResolving(false);
    }, 450);
    return () => { cancelled = true; clearTimeout(id); };
  }, [coords.lat, coords.lng]);

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden h-[42vh] glass">
        <div ref={el} className="absolute inset-0" />
        <div className="absolute inset-x-3 bottom-3 glass-strong rounded-2xl px-3 py-2 flex items-center gap-2 pointer-events-none">
          <MapPin size={14} className="text-accent-500" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-ink-3 font-semibold">Selected</div>
            <div className="text-sm font-semibold truncate">
              {resolving ? <span className="inline-flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Resolving…</span> : (label || 'Tap or drag to pick')}
            </div>
          </div>
          <div className="text-[10px] text-ink-3 tabular-nums whitespace-nowrap">
            {coords.lat.toFixed(3)}, {coords.lng.toFixed(3)}
          </div>
        </div>
      </div>
      <Button
        block
        size="md"
        disabled={resolving && !label}
        onClick={() => onConfirm({ lat: coords.lat, lng: coords.lng, label: label || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` })}
      >
        Use this location
      </Button>
      <div className="text-xs text-ink-3 text-center">Tap the map or drag the pin to pick a spot.</div>
    </div>
  );
}
