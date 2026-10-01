"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ComparisonPanel } from "./ComparisonPanel";
import { loadComparisonIds, saveComparisonIds } from "../lib/browser-selection";
import { toggleComparisonSelection } from "../lib/selection";
import { properties } from "@/features/properties/data/properties";
import { createDefaultBudgetProfile, type BudgetProfile } from "@/features/budget-rules/lib/preference-profile";
import { loadBudgetProfile } from "@/features/budget-rules/lib/browser-profile";
import { evaluateProperty } from "@/features/property-matching/lib/evaluate-property";

export function ComparePage() {
  const [ids, setIds] = useState<number[]>([]); const [profile, setProfile] = useState<BudgetProfile>(createDefaultBudgetProfile);
  useEffect(() => { const timeoutId = window.setTimeout(() => { setIds(loadComparisonIds()); setProfile(loadBudgetProfile()); }, 0); return () => window.clearTimeout(timeoutId); }, []);
  const selected = properties.filter((property) => ids.includes(property.id));
  const matches = Object.fromEntries(properties.map((property) => [property.id, evaluateProperty(property, profile)]));
  function remove(id: number) { setIds((current) => { const next = toggleComparisonSelection(current, id); saveComparisonIds(next); return next; }); }
  return <main className="compare-page"><header className="site-header"><div className="header-inner"><Link className="brand" href="/">Smart Home Finder</Link><nav className="main-nav"><Link className="nav-link" href="/">Buy</Link><Link className="nav-link active" href="/compare">Compare</Link><Link className="nav-link" href="/sell">Sell</Link></nav></div></header><section className="compare-page-content"><p className="eyebrow">Your shortlist</p><h1>Compare your homes</h1><p>Keep up to four properties side by side and see the differences clearly.</p>{selected.length ? <ComparisonPanel properties={selected} matches={matches} onRemove={remove} /> : <div className="compare-empty"><h2>No homes selected yet</h2><p>Add homes from listing results to build your comparison list.</p><Link href="/">Browse homes</Link></div>}<p className="compare-limit-note">You can compare up to four homes at a time. To add another, remove a home from this list first.</p></section></main>;
}
