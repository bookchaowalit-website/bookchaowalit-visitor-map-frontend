"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

function Shell({
  title,
  subtitle,
  badge = "Portfolio demo · local-only",
  children,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{badge}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        </header>
        {children}
        <footer className="mt-10 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
          Honest demo: no multi-tenant backend. State (if any) stays in this browser.
        </footer>
      </div>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 " +
    className;
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      : variant === "secondary"
        ? "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700"
        : variant === "danger"
          ? "bg-red-600 text-white hover:bg-red-500"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900";
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, ready]);
  return [value, setValue] as const;
}

function uid() {
  return crypto.randomUUID();
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}


type Hit = { id: string; city: string; country: string; x: number; y: number };
const CITIES = [
  { city: "Bangkok", country: "TH", x: 72, y: 58 },
  { city: "Tokyo", country: "JP", x: 82, y: 42 },
  { city: "Berlin", country: "DE", x: 52, y: 38 },
  { city: "SF", country: "US", x: 18, y: 42 },
  { city: "Sydney", country: "AU", x: 88, y: 78 },
];
export default function Home() {
  const [hits, setHits] = useLocalStorage<Hit[]>("visitor-map-v1", []);
  const add = () => {
    const c = CITIES[Math.floor(Math.random() * CITIES.length)];
    setHits((p) => [{ id: uid(), ...c }, ...p].slice(0, 40));
  };
  return (
    <Shell title="Visitor Map" subtitle="Simulated visitor dots — demo only, not real analytics geo IP.">
      <div className="mb-3 flex gap-2">
        <Button onClick={add}>Simulate visitor</Button>
        <Button variant="secondary" onClick={() => setHits([])}>Clear</Button>
      </div>
      <div className="relative aspect-[2/1] overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-b from-sky-100 to-emerald-100 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
        {hits.map((h) => (
          <div key={h.id} className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 shadow" style={{ left: h.x + "%", top: h.y + "%" }} title={h.city} />
        ))}
        <div className="absolute bottom-2 left-2 rounded bg-white/80 px-2 py-1 text-xs dark:bg-black/50">{hits.length} hits (demo)</div>
      </div>
    </Shell>
  );
}
