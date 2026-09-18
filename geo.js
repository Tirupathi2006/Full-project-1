export function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported on this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`
    );
    const data = await res.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

export async function searchPlaces(query) {
  if (!query || query.length < 3) return [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(query)}`
    );
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchOsrmRoute(profile, a, b) {
  const url = `https://router.project-osrm.org/route/v1/${profile}/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.routes || !data.routes.length) throw new Error("no route");
  const route = data.routes[0];
  return {
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
    coords: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
  };
}

/** Resolves real road routes for driving + cycling, with a graceful fallback. */
export async function buildRoute(pickup, drop) {
  const fallbackKm = haversineKm(pickup, drop) * 1.25;
  let driving, cycling;

  try {
    driving = await fetchOsrmRoute("driving", pickup, drop);
  } catch {
    driving = {
      distanceKm: fallbackKm,
      durationMin: (fallbackKm / 28) * 60,
      coords: [[pickup.lat, pickup.lng], [drop.lat, drop.lng]],
    };
  }
  try {
    cycling = await fetchOsrmRoute("cycling", pickup, drop);
  } catch {
    cycling = { distanceKm: fallbackKm, durationMin: (fallbackKm / 16) * 60, coords: driving.coords };
  }

  return { driving, cycling };
}
