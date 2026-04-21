export interface Place {
  lat: number;
  lng: number;
  label: string;
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      { headers: { 'Accept-Language': navigator.language || 'en' } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const a = json.address ?? {};
    const city = a.city ?? a.town ?? a.village ?? a.municipality ?? a.state ?? '';
    const country = a.country ?? '';
    const label = [city, country].filter(Boolean).join(', ');
    return label || json.display_name || null;
  } catch {
    return null;
  }
}

export async function forwardGeocode(q: string): Promise<Place[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&q=${encodeURIComponent(q)}`,
      { headers: { 'Accept-Language': navigator.language || 'en' } }
    );
    if (!res.ok) return [];
    const json = await res.json() as any[];
    return json.map(r => ({
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      label: r.display_name,
    }));
  } catch {
    return [];
  }
}
