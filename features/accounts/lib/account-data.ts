import type { SupabaseClient } from "@supabase/supabase-js";
import { isBudgetProfile, type BudgetProfile } from "@/features/budget-rules/lib/preference-profile";

export type SavedSearchCriteria = {
  location: string;
  maxPrice: number | null;
  budgetProfile: BudgetProfile;
};

export type SavedSearch = {
  id: string;
  name: string;
  criteria: SavedSearchCriteria;
};

export async function loadAccountData(client: SupabaseClient, userId: string) {
  const [favoritesResult, profileResult] = await Promise.all([
    client.from("favorites").select("property_id").eq("user_id", userId),
    client.from("buyer_profiles").select("rules").eq("user_id", userId).maybeSingle(),
  ]);

  const favorites = favoritesResult.data?.flatMap(({ property_id }) => {
    const propertyId = Number(property_id);
    return Number.isInteger(propertyId) ? [propertyId] : [];
  }) ?? [];
  const profile = isBudgetProfile(profileResult.data?.rules) ? profileResult.data.rules : null;

  return { favorites, profile };
}

export async function setAccountFavorite(
  client: SupabaseClient,
  userId: string,
  propertyId: number,
  isFavorite: boolean,
) {
  if (isFavorite) {
    return client.from("favorites").upsert({ user_id: userId, property_id: String(propertyId) });
  }

  return client.from("favorites").delete().eq("user_id", userId).eq("property_id", String(propertyId));
}

export async function saveAccountProfile(client: SupabaseClient, userId: string, profile: BudgetProfile) {
  return client.from("buyer_profiles").upsert({
    user_id: userId,
    rules: profile,
    updated_at: new Date().toISOString(),
  });
}

export async function listSavedSearches(client: SupabaseClient, userId: string): Promise<SavedSearch[]> {
  const { data } = await client.from("saved_searches")
    .select("id, name, criteria")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  return (data ?? []).flatMap((search) => {
    const criteria = search.criteria as Partial<SavedSearchCriteria> | null;
    return criteria
      && typeof criteria.location === "string"
      && (criteria.maxPrice === null || typeof criteria.maxPrice === "number")
      && isBudgetProfile(criteria.budgetProfile)
      ? [{ id: search.id, name: search.name, criteria: criteria as SavedSearchCriteria }]
      : [];
  });
}

export async function createSavedSearch(
  client: SupabaseClient,
  userId: string,
  name: string,
  criteria: SavedSearchCriteria,
) {
  return client.from("saved_searches").insert({ user_id: userId, name, criteria });
}

export async function deleteSavedSearch(client: SupabaseClient, userId: string, searchId: string) {
  return client.from("saved_searches").delete().eq("user_id", userId).eq("id", searchId);
}

export async function deleteAccountData(client: SupabaseClient, userId: string) {
  return Promise.all([
    client.from("favorites").delete().eq("user_id", userId),
    client.from("buyer_profiles").delete().eq("user_id", userId),
    client.from("saved_searches").delete().eq("user_id", userId),
  ]);
}
