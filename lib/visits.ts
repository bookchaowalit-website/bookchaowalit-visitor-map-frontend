export type City = { city: string; country: string; x: number; y: number };
export type Source = "simulated" | "self";
export type Hit = City & { id: string; source: Source };

export const MAX_HITS = 40;

/** Fixed marker positions on the abstract projection (not lat/lon). */
export const CITIES: City[] = [
  { city: "Bangkok", country: "TH", x: 67, y: 57 },
  { city: "Tokyo", country: "JP", x: 79, y: 43 },
  { city: "Berlin", country: "DE", x: 50, y: 38 },
  { city: "San Francisco", country: "US", x: 18, y: 43 },
  { city: "Sydney", country: "AU", x: 78, y: 75 },
];

/**
 * Maps an IANA time zone (from the visitor's own browser, no IP lookup) to the
 * nearest city in the fixed set by broad region. Returns null when unknown.
 */
export function cityForTimeZone(timeZone: string): City | null {
  const zone = timeZone.trim();
  const byName = (name: string) => CITIES.find((city) => city.city === name) ?? null;
  if (/^(Asia\/(Tokyo|Seoul|Pyongyang|Sakhalin|Vladivostok)|Japan|ROK)$/.test(zone)) return byName("Tokyo");
  if (/^(Australia|Pacific\/(Auckland|Fiji|Noumea)|NZ)/.test(zone)) return byName("Sydney");
  // Legacy link names some browsers still report (Singapore, Hongkong, PRC, ROC).
  if (/^(Asia|Indian)\//.test(zone) || /^(Singapore|Hongkong|PRC|ROC)$/.test(zone)) return byName("Bangkok");
  // Atlantic islands on the American side belong with the Americas, not Europe.
  if (/^Atlantic\/(Bermuda|Stanley|South_Georgia)$/.test(zone)) return byName("San Francisco");
  if (/^(Europe|Africa|Atlantic)\//.test(zone)) return byName("Berlin");
  if (/^(America|US|Canada|Pacific\/Honolulu)/.test(zone)) return byName("San Francisco");
  return null;
}

export function simulatedHit(random: number, id: string): Hit {
  const scaled = Math.floor(random * CITIES.length);
  const index = Number.isNaN(scaled) ? 0 : Math.min(CITIES.length - 1, Math.max(0, scaled));
  return { ...CITIES[index], id, source: "simulated" };
}

export function addHit(hits: Hit[], hit: Hit): Hit[] {
  return [...hits, hit].slice(-MAX_HITS);
}

export type CityCount = City & { count: number; self: number };

/** Per-city counts, busiest first; ties keep the fixed city order. */
export function countByCity(hits: Hit[]): CityCount[] {
  const counted = CITIES.map((city) => ({
    ...city,
    count: hits.filter((hit) => hit.city === city.city).length,
    self: hits.filter((hit) => hit.city === city.city && hit.source === "self").length,
  }));
  // Array.prototype.sort is stable, so equal counts keep the fixed city order.
  return counted.sort((a, b) => b.count - a.count);
}

/** Restores stored hits, re-deriving coordinates from the fixed city set. */
export function parseHits(raw: string | null): Hit[] | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return null;
    const hits: Hit[] = [];
    for (const item of data) {
      if (typeof item !== "object" || item === null) continue;
      const record = item as Record<string, unknown>;
      const city = CITIES.find((candidate) => candidate.city === record.city);
      // Ids key the map dots; a repeated id keeps only its first hit.
      if (!city || typeof record.id !== "string" || hits.some((hit) => hit.id === record.id)) continue;
      hits.push({ ...city, id: record.id, source: record.source === "self" ? "self" : "simulated" });
    }
    return hits.slice(-MAX_HITS);
  } catch {
    return null;
  }
}
