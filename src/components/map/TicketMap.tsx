import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import type { Ticket } from '../../types';
import { TAG_META } from '../../types';
import { fmtMoney, fmtDateShort } from '../../lib/format';

export type MapStyle = 'minimal' | 'satellite' | 'dark';

interface Props {
  tickets: Ticket[];
  onTapBubble: (t: Ticket) => void;
  focus?: { lat: number; lng: number; zoom?: number } | null;
  style?: MapStyle;
}

const TILE_MINIMAL       = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png';
const LABEL_MINIMAL      = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png';
const TILE_DARK          = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
const LABEL_DARK         = 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png';
const TILE_SATELLITE     = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const LABEL_SATELLITE    = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png';

function urlsFor(style: MapStyle) {
  if (style === 'satellite') return { tile: TILE_SATELLITE, label: LABEL_SATELLITE, grayscale: false };
  if (style === 'dark')      return { tile: TILE_DARK,      label: LABEL_DARK,      grayscale: false };
  const sysDark = document.documentElement.classList.contains('dark');
  return sysDark
    ? { tile: TILE_DARK,    label: LABEL_DARK,    grayscale: false }
    : { tile: TILE_MINIMAL, label: LABEL_MINIMAL, grayscale: true  };
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]!);
}

function makePinIcon(count?: number) {
  const content = count && count > 1
    ? `<div class="pin-wrap"><div class="pin-halo"></div><div class="pin-core is-cluster">${count}</div></div>`
    : `<div class="pin-wrap"><div class="pin-halo"></div><div class="pin-core">•</div></div>`;
  return L.divIcon({ className: 'ticket-pin', html: content, iconSize: [44, 44], iconAnchor: [22, 44] });
}

function popupContent(t: Ticket): string {
  const emoji = (t.tags[0] && TAG_META[t.tags[0]])?.emoji ?? '🧾';
  const title = escape(t.merchant);
  const amount = escape(fmtMoney(t.amount, t.currency));
  const date = escape(fmtDateShort(t.date));
  const place = t.place ? escape(t.place) : '';
  return `
    <div class="ticket-bubble" data-ticket-id="${t.id}">
      <div class="ticket-bubble-row">
        <div class="ticket-bubble-icon">${emoji}</div>
        <div class="ticket-bubble-main">
          <div class="ticket-bubble-title">${title}</div>
          <div class="ticket-bubble-sub">${date}${place ? ' · ' + place : ''}</div>
        </div>
        <div class="ticket-bubble-amt">${amount}</div>
      </div>
      <div class="ticket-bubble-cta">Tap for details →</div>
    </div>
  `;
}

export function TicketMap({ tickets, onTapBubble, focus, style = 'minimal' }: Props) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const labelRef = useRef<L.TileLayer | null>(null);
  const didFitRef = useRef(false);
  const onTapRef = useRef(onTapBubble);
  onTapRef.current = onTapBubble;

  const points = useMemo(
    () => tickets.filter(t => typeof t.lat === 'number' && typeof t.lng === 'number'),
    [tickets]
  );

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, {
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
      preferCanvas: true,
    }).setView([20, 0], 2);

    const u = urlsFor(style);
    tileRef.current = L.tileLayer(u.tile, { maxZoom: 19, crossOrigin: true }).addTo(map);
    labelRef.current = L.tileLayer(u.label, { maxZoom: 19, crossOrigin: true, opacity: 0.9, pane: 'shadowPane' }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapEl.current.classList.toggle('map-tone', u.grayscale);
    mapRef.current = map;

    const observer = new MutationObserver(() => {
      const uu = urlsFor(style);
      tileRef.current?.setUrl(uu.tile);
      labelRef.current?.setUrl(uu.label);
      mapEl.current?.classList.toggle('map-tone', uu.grayscale);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const u = urlsFor(style);
    tileRef.current?.setUrl(u.tile);
    labelRef.current?.setUrl(u.label);
    mapEl.current?.classList.toggle('map-tone', u.grayscale);
  }, [style]);

  useEffect(() => {
    const map = mapRef.current;
    const group = layerRef.current;
    if (!map || !group) return;
    group.clearLayers();

    if (!points.length) return;

    const grouped = new Map<string, Ticket[]>();
    const z = map.getZoom();
    const p = z >= 12 ? 4 : z >= 8 ? 3 : z >= 5 ? 2 : 1;
    for (const t of points) {
      const key = `${t.lat!.toFixed(p)},${t.lng!.toFixed(p)}`;
      const arr = grouped.get(key) ?? [];
      arr.push(t);
      grouped.set(key, arr);
    }

    grouped.forEach((list) => {
      const lat = list.reduce((a, t) => a + t.lat!, 0) / list.length;
      const lng = list.reduce((a, t) => a + t.lng!, 0) / list.length;
      const marker = L.marker([lat, lng], { icon: makePinIcon(list.length) });

      if (list.length === 1) {
        const t = list[0];
        const popup = L.popup({
          offset: [0, -38],
          closeButton: false,
          autoPan: true,
          className: 'ticket-popup',
          maxWidth: 280,
        }).setContent(popupContent(t));
        marker.bindPopup(popup);
        marker.on('popupopen', () => {
          const node = document.querySelector('.ticket-popup .ticket-bubble') as HTMLElement | null;
          if (!node) return;
          const handler = () => onTapRef.current(t);
          node.addEventListener('click', handler, { once: true });
        });
      } else {
        marker.on('click', () => {
          map.flyTo([lat, lng], Math.min(map.getZoom() + 2, 15), { duration: 0.6 });
        });
      }
      marker.addTo(group);
    });

    if (!focus && !didFitRef.current) {
      if (points.length === 1) {
        map.setView([points[0].lat!, points[0].lng!], 13, { animate: true });
      } else {
        const bounds = L.latLngBounds(points.map(t => [t.lat!, t.lng!] as [number, number]));
        map.fitBounds(bounds.pad(0.2), { animate: true, maxZoom: 13 });
      }
      didFitRef.current = true;
    }
  }, [points, focus]);

  useEffect(() => {
    if (focus && mapRef.current) {
      mapRef.current.flyTo([focus.lat, focus.lng], focus.zoom ?? 13, { duration: 0.9 });
    }
  }, [focus]);

  return <div ref={mapEl} className="absolute inset-0" />;
}
