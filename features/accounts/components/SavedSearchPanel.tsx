"use client";

import { useEffect, useState } from "react";
import {
  createSavedSearch,
  deleteSavedSearch,
  listSavedSearches,
  type SavedSearch,
  type SavedSearchCriteria,
} from "../lib/account-data";
import { getSupabaseBrowserClient } from "../lib/supabase-browser";

export function SavedSearchPanel({
  userId,
  criteria,
  onApply,
}: {
  userId: string | null;
  criteria: SavedSearchCriteria;
  onApply: (criteria: SavedSearchCriteria) => void;
}) {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      const timeoutId = window.setTimeout(() => setSearches([]), 0);
      return () => window.clearTimeout(timeoutId);
    }

    const client = getSupabaseBrowserClient();
    if (!client) return undefined;
    void listSavedSearches(client, userId).then(setSearches);
    return undefined;
  }, [userId]);

  async function saveSearch() {
    const client = getSupabaseBrowserClient();
    if (!client || !userId || !name.trim()) return;

    const { error } = await createSavedSearch(client, userId, name.trim(), criteria);
    if (error) {
      setMessage(error.message);
      return;
    }
    setSearches(await listSavedSearches(client, userId));
    setName("");
    setMessage("Search saved.");
  }

  async function removeSearch(searchId: string) {
    const client = getSupabaseBrowserClient();
    if (!client || !userId) return;
    await deleteSavedSearch(client, userId, searchId);
    setSearches((current) => current.filter((search) => search.id !== searchId));
  }

  return (
    <section className="saved-search-panel" aria-labelledby="saved-searches-title">
      <div>
        <p className="eyebrow section-eyebrow">Your account</p>
        <h2 id="saved-searches-title">Saved searches</h2>
      </div>
      {!userId ? (
        <p>Sign in to save this search and use it on any device.</p>
      ) : (
        <>
          <div className="saved-search-create">
            <input value={name} maxLength={80} onChange={(event) => setName(event.target.value)} placeholder="Name this search" aria-label="Saved search name" />
            <button type="button" disabled={!name.trim()} onClick={saveSearch}>Save search</button>
          </div>
          {message && <p className="saved-search-message" aria-live="polite">{message}</p>}
          {searches.length > 0 && (
            <ul className="saved-search-list">
              {searches.map((search) => (
                <li key={search.id}>
                  <button type="button" onClick={() => onApply(search.criteria)}>{search.name}</button>
                  <button type="button" aria-label={`Delete ${search.name}`} onClick={() => removeSearch(search.id)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
