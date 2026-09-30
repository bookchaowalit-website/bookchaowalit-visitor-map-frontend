import { describe, expect, it } from "vitest";
import { addHit, cityForTimeZone, countByCity, MAX_HITS, parseHits, simulatedHit, type Hit } from "./visits";

describe("cityForTimeZone", () => {
  it("maps broad regions to the fixed city set", () => {
    expect(cityForTimeZone("Asia/Bangkok")?.city).toBe("Bangkok");
    expect(cityForTimeZone("Asia/Tokyo")?.city).toBe("Tokyo");
    expect(cityForTimeZone("Europe/London")?.city).toBe("Berlin");
    expect(cityForTimeZone("America/New_York")?.city).toBe("San Francisco");
    expect(cityForTimeZone("Australia/Sydney")?.city).toBe("Sydney");
  });

  it("returns null for unknown zones", () => {
    expect(cityForTimeZone("UTC")).toBeNull();
    expect(cityForTimeZone("")).toBeNull();
  });
});

describe("hits", () => {
  it("picks a simulated city from a random number within bounds", () => {
    expect(simulatedHit(0, "a").city).toBe("Bangkok");
    expect(simulatedHit(0.9999, "b").city).toBe("Sydney");
    expect(simulatedHit(1, "c").city).toBe("Sydney");
  });

  it("caps the log at MAX_HITS, dropping the oldest", () => {
    let hits: Hit[] = [];
    for (let i = 0; i < MAX_HITS + 2; i++) hits = addHit(hits, simulatedHit(0, String(i)));
    expect(hits).toHaveLength(MAX_HITS);
    expect(hits[0].id).toBe("2");
  });

  it("counts per city with self-reported visits split out", () => {
    const hits = [simulatedHit(0.5, "1"), { ...simulatedHit(0.5, "2"), source: "self" as const }, simulatedHit(0, "3")];
    const [top, second] = countByCity(hits);
    expect(top).toMatchObject({ city: "Berlin", count: 2, self: 1 });
    expect(second).toMatchObject({ city: "Bangkok", count: 1, self: 0 });
  });

  it("restores stored hits from the city name, ignoring tampered coordinates", () => {
    const raw = JSON.stringify([{ city: "Tokyo", id: "1", x: 999, y: -5 }, { city: "Atlantis", id: "2" }, { city: "Berlin", id: "3", source: "self" }]);
    expect(parseHits(raw)).toEqual([
      { city: "Tokyo", country: "JP", x: 79, y: 43, id: "1", source: "simulated" },
      { city: "Berlin", country: "DE", x: 50, y: 38, id: "3", source: "self" },
    ]);
  });
});

describe("edge cases", () => {
  it("maps legacy time-zone link names instead of dropping the visit", () => {
    expect(cityForTimeZone("Singapore")?.city).toBe("Bangkok");
    expect(cityForTimeZone("Hongkong")?.city).toBe("Bangkok");
    expect(cityForTimeZone("PRC")?.city).toBe("Bangkok");
    expect(cityForTimeZone("ROK")?.city).toBe("Tokyo");
  });

  it("puts American-side Atlantic islands in the Americas, not Europe", () => {
    expect(cityForTimeZone("Atlantic/Bermuda")?.city).toBe("San Francisco");
    expect(cityForTimeZone("Atlantic/Stanley")?.city).toBe("San Francisco");
    expect(cityForTimeZone("Atlantic/Reykjavik")?.city).toBe("Berlin");
  });

  it("always returns a real city for a NaN random value", () => {
    expect(simulatedHit(Number.NaN, "n").city).toBe("Bangkok");
  });

  it("drops stored hits that repeat an id", () => {
    const raw = JSON.stringify([{ id: "a", city: "Tokyo" }, { id: "a", city: "Berlin" }, { id: "b", city: "Berlin" }]);
    expect(parseHits(raw)?.map((hit) => hit.city)).toEqual(["Tokyo", "Berlin"]);
  });
});
