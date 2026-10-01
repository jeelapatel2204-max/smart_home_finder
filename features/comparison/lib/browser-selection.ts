import { comparisonLimit } from "./selection";

const storageKey = "smart-home-finder:comparison-ids:v1";

export function loadComparisonIds() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as unknown;
    return Array.isArray(stored) ? stored.filter((id): id is number => Number.isInteger(id)).slice(0, comparisonLimit) : [];
  } catch { return []; }
}

export function saveComparisonIds(ids: number[]) {
  try { window.localStorage.setItem(storageKey, JSON.stringify(ids.slice(0, comparisonLimit))); } catch { /* session-only fallback */ }
}
