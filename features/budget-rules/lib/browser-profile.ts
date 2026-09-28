import {
  createDefaultBudgetProfile,
  isBudgetProfile,
  type BudgetProfile,
} from "./preference-profile";

const storageKey = "smart-home-finder:budget-profile:v1";

export function loadBudgetProfile() {
  try {
    const storedProfile = window.localStorage.getItem(storageKey);
    if (!storedProfile) {
      return createDefaultBudgetProfile();
    }

    const parsedProfile: unknown = JSON.parse(storedProfile);
    return isBudgetProfile(parsedProfile) ? parsedProfile : createDefaultBudgetProfile();
  } catch {
    return createDefaultBudgetProfile();
  }
}

export function saveBudgetProfile(profile: BudgetProfile) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(profile));
  } catch {
    // The profile remains usable for this session if browser storage is unavailable.
  }
}
