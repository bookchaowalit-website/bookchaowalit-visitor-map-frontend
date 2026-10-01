"use client";

import { useMemo, useState } from "react";
import { addHit, cityForTimeZone, countByCity, MAX_HITS, parseHits, simulatedHit, type Hit } from "@/lib/visits";
import { useStoredState } from "@/lib/use-stored-state";

const STORAGE_KEY = "book-visitor-map-v2";
const EMPTY: Hit[] = [];

export default function VisitorMap() {
  const [hits, setHits] = useStoredState(STORAGE_KEY, EMPTY, parseHits);
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const counts = useMemo(() => countByCity(hits), [hits]);

  function simulateVisitor() {
    const hit = simulatedHit(Math.random(), crypto.randomUUID());
    setHits((current) => addHit(current, hit));
    setSelected(hit.city);
    setNotice(`Simulated visitor marked in ${hit.city}.`);
  }

  function markMyVisit() {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    const city = cityForTimeZone(zone);
    if (!city) { setNotice(`Your time zone (${zone || "unknown"}) is not near any city on this atlas.`); return; }
    setHits((current) => addHit(current, { ...city, id: crypto.randomUUID(), source: "self" }));
    setSelected(city.city);
    setNotice(`Your visit was marked near ${city.city}, based only on your browser time zone (${zone}).`);
  }

  return (
    <main className="atlas-shell">
      <header className="atlas-header">
        <div className="atlas-mark">B/13</div>
        <div className="atlas-brand"><strong>VISITOR ATLAS</strong><span>LOCAL MARKS / FIXED CITY SET</span></div>
        <div className="atlas-state"><i /> TIME-ZONE + SIMULATED · NOT LIVE</div>
      </header>

      <section className="atlas-hero">
        <div>
          <p className="atlas-kicker">BOOKCHAOWALIT / SMALL AUDIENCE INSTRUMENT</p>
          <h1>Read the room,<br /><em>lightly.</em></h1>
          <p className="atlas-lede">A quiet projection of visits to this browser: mark your own by time zone, or simulate a few — never enough to pretend it is analytics.</p>
        </div>
        <div className="atlas-coordinate" aria-label="Synthetic map coordinates"><span>FIELD</span><strong>13°</strong><b>FIXED / LOCAL</b></div>
      </section>

      <section className="atlas-console" aria-label="Visitor map simulation">
        <div className="atlas-console-head">
          <div><span>PROJECTION / 001</span><h2>Where the dots gather.</h2></div>
          <div className="atlas-total"><strong>{String(hits.length).padStart(2, "0")}</strong><span>MARKED<br />VISITS</span></div>
        </div>
        <div className="atlas-actions">
          <button type="button" className="simulate-button" onClick={markMyVisit}>Mark my visit <b aria-hidden="true">◎</b></button>
          <button type="button" className="clear-map" onClick={simulateVisitor}>Simulate visitor ＋</button>
          <button type="button" className="clear-map" onClick={() => { setHits([]); setSelected(null); setNotice("Field cleared."); }}>Clear field</button>
          <p role="status">{notice || "Mark your own visit (time zone only) or simulate one. Marks stay in this browser."}</p>
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
            {hits.map((hit) => <circle key={hit.id} className={`hit-dot${hit.source === "self" ? " self" : ""}${selected === hit.city ? " selected" : ""}`} cx={hit.x} cy={hit.y} r={selected === hit.city ? 1.8 : 1.15}><title>{hit.city}, {hit.country} · {hit.source === "self" ? "your visit" : "simulated"}</title></circle>)}
          </svg>
          <div className="field-label field-top">SYNTHETIC PROJECTION / LAT–LON OMITTED</div>
          <div className="field-label field-bottom">{selected ? `LAST MARK · ${selected.toUpperCase()}` : "NO LAST MARK"}</div>
        </div>
        <div className="atlas-register">
          <div className="register-title"><span>CITY REGISTER</span><span>MARKS / {MAX_HITS} MAX</span></div>
          {counts.map((city, index) => (
            <button type="button" key={city.city} aria-pressed={selected === city.city} className={selected === city.city ? "city-row selected" : "city-row"} onClick={() => setSelected(city.city)}>
              <span>{String(index + 1).padStart(2, "0")}</span><strong>{city.city}</strong><em>{city.country}{city.self ? ` · ${city.self} yours` : ""}</em><b>{String(city.count).padStart(2, "0")}</b>
            </button>
          ))}
        </div>
        <p className="atlas-note"><i /> Demo boundary: your mark uses only the browser time zone, snapped to the nearest listed city. No IP lookup, map provider, remote analytics, or geographic accuracy is involved.</p>
      </section>

      <footer className="atlas-footer"><span>BOOKCHAOWALIT / VISITOR MAP</span><span>LOCAL SIMULATION · NO GEO CLAIM</span></footer>
    </main>
  );
}
