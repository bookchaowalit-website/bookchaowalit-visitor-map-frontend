"use client";

import { useEffect, useMemo, useState } from "react";

type City = { city: string; country: string; x: number; y: number };
type Hit = City & { id: string };

const CITIES: City[] = [
  { city: "Bangkok", country: "TH", x: 67, y: 57 },
  { city: "Tokyo", country: "JP", x: 79, y: 43 },
  { city: "Berlin", country: "DE", x: 50, y: 38 },
  { city: "San Francisco", country: "US", x: 18, y: 43 },
  { city: "Sydney", country: "AU", x: 78, y: 75 },
];
const STORAGE_KEY = "book-visitor-map-v2";

export default function VisitorMap() {
  const [hits, setHits] = useState<Hit[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHits(JSON.parse(saved) as Hit[]);
    } catch {
      setHits([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hits));
  }, [hits]);

  const counts = useMemo(() => CITIES.map((city) => ({
    ...city,
    count: hits.filter((hit) => hit.city === city.city).length,
  })).sort((a, b) => b.count - a.count), [hits]);

  function simulateVisitor() {
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const hit = { ...city, id: crypto.randomUUID() };
    setHits((current) => [...current, hit].slice(-40));
    setSelected(city.city);
  }

  return (
    <main className="atlas-shell">
      <header className="atlas-header">
        <div className="atlas-mark">B/13</div>
        <div className="atlas-brand"><strong>VISITOR ATLAS</strong><span>SIMULATION / FIXED CITY SET</span></div>
        <div className="atlas-state"><i /> SYNTHETIC SIGNAL · NOT LIVE</div>
      </header>

      <section className="atlas-hero">
        <div>
          <p className="atlas-kicker">BOOKCHAOWALIT / SMALL AUDIENCE INSTRUMENT</p>
          <h1>Read the room,<br /><em>lightly.</em></h1>
          <p className="atlas-lede">A quiet projection of simulated visitors — enough to test a map interaction, never enough to pretend it is analytics.</p>
        </div>
        <div className="atlas-coordinate" aria-label="Synthetic map coordinates"><span>FIELD</span><strong>13°</strong><b>FIXED / LOCAL</b></div>
      </section>

      <section className="atlas-console" aria-label="Visitor map simulation">
        <div className="atlas-console-head">
          <div><span>PROJECTION / 001</span><h2>Where the dots gather.</h2></div>
          <div className="atlas-total"><strong>{String(hits.length).padStart(2, "0")}</strong><span>SIMULATED<br />VISITORS</span></div>
        </div>
        <div className="atlas-actions">
          <button className="simulate-button" onClick={simulateVisitor}>Simulate visitor <b>＋</b></button>
          <button className="clear-map" onClick={() => { setHits([]); setSelected(null); }}>Clear field</button>
          <p>Each click selects one fixed city. The marker count remains in this browser.</p>
        </div>
        <div className="atlas-field">
          <svg viewBox="0 0 100 84" role="img" aria-label="Abstract world projection showing simulated visitor dots">
            <defs>
              <pattern id="atlas-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth=".16" /></pattern>
            </defs>
            <rect width="100" height="84" fill="url(#atlas-grid)" />
            <path className="land-shape" d="M8 21 C15 12 28 12 33 18 L39 25 34 31 28 29 23 35 16 31 10 34 5 28Z" />
            <path className="land-shape" d="M44 15 L54 12 60 17 57 25 63 30 61 39 55 42 51 35 46 34 44 27 39 24Z" />
            <path className="land-shape" d="M64 16 L77 12 89 19 94 28 86 34 79 30 73 35 67 29 61 27Z" />
            <path className="land-shape" d="M59 46 L68 49 73 58 69 66 65 74 59 69 56 58Z" />
            {hits.map((hit) => <circle key={hit.id} className={selected === hit.city ? "hit-dot selected" : "hit-dot"} cx={hit.x} cy={hit.y} r={selected === hit.city ? 1.8 : 1.15}><title>{hit.city}, {hit.country}</title></circle>)}
          </svg>
          <div className="field-label field-top">SYNTHETIC PROJECTION / LAT–LON OMITTED</div>
          <div className="field-label field-bottom">{selected ? `LAST MARK · ${selected.toUpperCase()}` : "NO LAST MARK"}</div>
        </div>
        <div className="atlas-register">
          <div className="register-title"><span>CITY REGISTER</span><span>MARKS / 40 MAX</span></div>
          {counts.map((city, index) => (
            <button key={city.city} className={selected === city.city ? "city-row selected" : "city-row"} onClick={() => setSelected(city.city)}>
              <span>{String(index + 1).padStart(2, "0")}</span><strong>{city.city}</strong><em>{city.country}</em><b>{String(city.count).padStart(2, "0")}</b>
            </button>
          ))}
        </div>
        <p className="atlas-note"><i /> Demo boundary: no IP lookup, map provider, remote analytics, or geographic accuracy is involved.</p>
      </section>

      <footer className="atlas-footer"><span>BOOKCHAOWALIT / VISITOR MAP</span><span>LOCAL SIMULATION · NO GEO CLAIM</span></footer>
    </main>
  );
}
