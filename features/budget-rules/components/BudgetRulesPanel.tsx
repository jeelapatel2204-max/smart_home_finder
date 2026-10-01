"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { loadBudgetProfile, saveBudgetProfile } from "../lib/browser-profile";
import {
  createDefaultBudgetProfile,
  ruleDefinitions,
  validateBudgetProfile,
  type BudgetProfile,
  type BudgetRuleKey,
  type PreferenceLevel,
} from "../lib/preference-profile";

const essentialRuleKeys: BudgetRuleKey[] = [
  "maxPurchasePrice",
  "maxMonthlyHousingCost",
  "minBedrooms",
  "minBathrooms",
  "minSquareFeet",
];

const advancedRuleKeys: BudgetRuleKey[] = ["maxAnnualPropertyTax", "maxMonthlyHoa"];

function PreferenceField({
  ruleKey,
  profile,
  onChange,
}: {
  ruleKey: BudgetRuleKey;
  profile: BudgetProfile;
  onChange: (ruleKey: BudgetRuleKey, changes: Partial<BudgetProfile["rules"][BudgetRuleKey]>) => void;
}) {
  const definition = ruleDefinitions[ruleKey];
  const rule = profile.rules[ruleKey];
  const unit = "unit" in definition ? definition.unit : undefined;

  function updateValue(event: ChangeEvent<HTMLInputElement>) {
    const rawValue = event.currentTarget.value;
    onChange(ruleKey, { value: rawValue === "" ? null : Number(rawValue) });
  }

  return (
    <div className="budget-rule-field">
      <label htmlFor={`budget-rule-${ruleKey}`}>{definition.label}</label>
      <div className="budget-rule-controls">
        <span className="budget-rule-input-wrap">
          {unit && <span aria-hidden="true">{unit}</span>}
          <input
            id={`budget-rule-${ruleKey}`}
            type="number"
            min={definition.minimum}
            step={ruleKey === "minBathrooms" ? "0.5" : "1"}
            inputMode="decimal"
            disabled={rule.level === "NO_PREFERENCE"}
            placeholder="No limit"
            value={rule.value ?? ""}
            onChange={updateValue}
          />
        </span>
        <select
          aria-label={`${definition.label} preference level`}
          value={rule.level}
          onChange={(event) => onChange(ruleKey, { level: event.target.value as PreferenceLevel })}
        >
          <option value="MUST_HAVE">Must have</option>
          <option value="PREFER">Prefer</option>
          <option value="NO_PREFERENCE">No preference</option>
        </select>
      </div>
    </div>
  );
}

export function BudgetRulesPanel({
  onProfileChange,
  onSearch,
  onReset,
  profileOverride,
  storageKey,
  savedStatusLabel,
}: {
  onProfileChange?: (profile: BudgetProfile) => void;
  onSearch?: (profile: BudgetProfile) => void;
  onReset?: () => void;
  profileOverride?: BudgetProfile | null;
  storageKey?: string;
  savedStatusLabel?: string;
}) {
  const [profile, setProfile] = useState<BudgetProfile>(createDefaultBudgetProfile);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setProfile(loadBudgetProfile(storageKey));
      setHasLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [storageKey]);

  useEffect(() => {
    if (!profileOverride) return undefined;

    const timeoutId = window.setTimeout(() => setProfile(profileOverride), 0);
    return () => window.clearTimeout(timeoutId);
  }, [profileOverride]);

  useEffect(() => {
    if (hasLoaded) {
      saveBudgetProfile(profile, storageKey);
    }
  }, [hasLoaded, profile, storageKey]);

  useEffect(() => {
    if (hasLoaded) {
      onProfileChange?.(profile);
    }
  }, [hasLoaded, onProfileChange, profile]);

  const errors = validateBudgetProfile(profile);

  function updateRule(
    ruleKey: BudgetRuleKey,
    changes: Partial<BudgetProfile["rules"][BudgetRuleKey]>,
  ) {
    setProfile((current) => ({
      ...current,
      rules: {
        ...current.rules,
        [ruleKey]: { ...current.rules[ruleKey], ...changes },
      },
    }));
  }

  function resetRules() {
    const defaultProfile = createDefaultBudgetProfile();
    setProfile(defaultProfile);
    onProfileChange?.(defaultProfile);
    onReset?.();
  }

  return (
    <section className="budget-rules-panel" aria-labelledby="budget-rules-title">
      <div className="budget-rules-heading">
        <div>
          <p className="eyebrow section-eyebrow">Your decision criteria</p>
          <h2 id="budget-rules-title">Decision criteria</h2>
          <p>
            Mark non-negotiables as Must Have, softer priorities as Prefer, or leave a rule out.
          </p>
        </div>
          <span className="budget-rules-status" aria-live="polite">
          {hasLoaded ? savedStatusLabel ?? "Saved on this device" : "Loading your rules"}
          </span>
      </div>

      {errors.length > 0 && (
        <p className="budget-rules-error" role="alert">{errors[0]}</p>
      )}

      <div className="budget-rules-grid">
        {essentialRuleKeys.map((ruleKey) => (
          <PreferenceField key={ruleKey} ruleKey={ruleKey} profile={profile} onChange={updateRule} />
        ))}
      </div>

      <button
        className="budget-rules-advanced-toggle"
        type="button"
        aria-expanded={showAdvanced}
        aria-controls="advanced-budget-rules"
        onClick={() => setShowAdvanced((current) => !current)}
      >
        {showAdvanced ? "Hide additional cost rules" : "Add property-tax and HOA rules"}
      </button>

      {showAdvanced && (
        <div id="advanced-budget-rules" className="budget-rules-grid budget-rules-advanced">
          {advancedRuleKeys.map((ruleKey) => (
            <PreferenceField key={ruleKey} ruleKey={ruleKey} profile={profile} onChange={updateRule} />
          ))}
        </div>
      )}

      <div className="budget-rules-footer">
        <span>Search shows homes that meet your Must Have rules and score 70% or higher.</span>
        <button type="button" onClick={resetRules}>
          Reset rules
        </button>
      </div>

      {onSearch && (
        <button
          className="budget-rules-search-button"
          type="button"
          disabled={!hasLoaded || errors.length > 0}
          onClick={() => onSearch(profile)}
        >
          Search matching homes
        </button>
      )}
    </section>
  );
}
