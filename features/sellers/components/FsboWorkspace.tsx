"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/features/accounts/lib/supabase-browser";

type Plan = { target_price: number | null; low_price: number | null; high_price: number | null; pricing_notes: string | null };
type Showing = { id: string; starts_at: string; visitor_name: string; notes: string | null };
type Offer = { id: string; buyer_name: string; offer_price: number; financing: string; closing_date: string | null; status: "RECEIVED" | "COUNTERED" | "ACCEPTED" | "DECLINED"; notes: string | null };

function money(value: number | null) {
  return value === null ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function FsboWorkspace({ inquiryId, userId }: { inquiryId: string; userId: string }) {
  const [plan, setPlan] = useState<Plan>({ target_price: null, low_price: null, high_price: null, pricing_notes: null });
  const [showings, setShowings] = useState<Showing[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    void Promise.all([
      client.from("seller_fsbo_plans").select("target_price, low_price, high_price, pricing_notes").eq("seller_inquiry_id", inquiryId).maybeSingle(),
      client.from("seller_fsbo_showings").select("id, starts_at, visitor_name, notes").eq("seller_inquiry_id", inquiryId).order("starts_at"),
      client.from("seller_fsbo_offers").select("id, buyer_name, offer_price, financing, closing_date, status, notes").eq("seller_inquiry_id", inquiryId).order("created_at", { ascending: false }),
    ]).then(([planResult, showingsResult, offersResult]) => {
      if (planResult.error || showingsResult.error || offersResult.error) setMessage("Apply the latest seller workspace migration to use pricing, showings, and offers.");
      else {
        setPlan((planResult.data as Plan | null) ?? { target_price: null, low_price: null, high_price: null, pricing_notes: null });
        setShowings((showingsResult.data ?? []) as Showing[]);
        setOffers((offersResult.data ?? []) as Offer[]);
      }
    });
  }, [inquiryId]);

  async function savePricing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const target_price = Number(form.get("targetPrice")) || null;
    const low_price = Number(form.get("lowPrice")) || null;
    const high_price = Number(form.get("highPrice")) || null;
    if (low_price && high_price && low_price > high_price) { setMessage("Your low price needs to be at or below your high price."); return; }
    const client = getSupabaseBrowserClient(); if (!client) return;
    const next = { seller_inquiry_id: inquiryId, user_id: userId, target_price, low_price, high_price, pricing_notes: String(form.get("pricingNotes") || "").trim() || null, updated_at: new Date().toISOString() };
    const { error } = await client.from("seller_fsbo_plans").upsert(next);
    if (error) setMessage("We could not save your pricing plan. Please try again."); else { setPlan(next); setMessage("Pricing plan saved."); }
  }

  async function addShowing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const client = getSupabaseBrowserClient(); if (!client) return;
    const { data, error } = await client.from("seller_fsbo_showings").insert({ seller_inquiry_id: inquiryId, user_id: userId, starts_at: form.get("startsAt"), visitor_name: String(form.get("visitorName")).trim(), notes: String(form.get("showingNotes") || "").trim() || null }).select("id, starts_at, visitor_name, notes").single();
    if (error) setMessage("We could not add that showing. Please try again."); else { setShowings((current) => [...current, data as Showing].sort((a, b) => a.starts_at.localeCompare(b.starts_at))); event.currentTarget.reset(); }
  }

  async function addOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const client = getSupabaseBrowserClient(); if (!client) return;
    const { data, error } = await client.from("seller_fsbo_offers").insert({ seller_inquiry_id: inquiryId, user_id: userId, buyer_name: String(form.get("buyerName")).trim(), offer_price: Number(form.get("offerPrice")), financing: String(form.get("financing")).trim(), closing_date: form.get("closingDate") || null, notes: String(form.get("offerNotes") || "").trim() || null }).select("id, buyer_name, offer_price, financing, closing_date, status, notes").single();
    if (error) setMessage("We could not add that offer. Please try again."); else { setOffers((current) => [data as Offer, ...current]); event.currentTarget.reset(); }
  }

  return <div className="fsbo-workspace">
    <div className="fsbo-section"><div><h4>Pricing guidance</h4><p>Compare recent similar sales, account for condition and concessions, then choose a range you can explain. This is a planning tool—not an appraisal.</p></div><form onSubmit={savePricing} className="fsbo-compact-form"><label>Low <input name="lowPrice" type="number" min="1" defaultValue={plan.low_price ?? ""} placeholder="$" /></label><label>Target <input name="targetPrice" type="number" min="1" defaultValue={plan.target_price ?? ""} placeholder="$" /></label><label>High <input name="highPrice" type="number" min="1" defaultValue={plan.high_price ?? ""} placeholder="$" /></label><label className="fsbo-full">Why this range <textarea name="pricingNotes" maxLength={1000} defaultValue={plan.pricing_notes ?? ""} placeholder="Comparable homes, updates, or terms to consider" /></label><button type="submit">Save pricing plan</button></form>{plan.target_price !== null && <p className="fsbo-summary">Working range {money(plan.low_price)}–{money(plan.high_price)} · target {money(plan.target_price)}</p>}</div>
    <div className="fsbo-section"><div><h4>Showing planner</h4><p>Keep appointment details in one place and confirm access, safety, and follow-up before each visit.</p></div><form onSubmit={addShowing} className="fsbo-compact-form"><label>Date & time <input name="startsAt" type="datetime-local" required /></label><label>Visitor <input name="visitorName" required maxLength={160} placeholder="Name or agent" /></label><label className="fsbo-full">Notes <input name="showingNotes" maxLength={1000} placeholder="Contact details or follow-up" /></label><button type="submit">Add showing</button></form>{showings.length > 0 && <ul className="fsbo-record-list">{showings.map((showing) => <li key={showing.id}><strong>{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(showing.starts_at))}</strong><span>{showing.visitor_name}{showing.notes ? ` · ${showing.notes}` : ""}</span></li>)}</ul>}</div>
    <div className="fsbo-section"><div><h4>Offer tracker</h4><p>Record price, financing, timing, and notes so you can compare the full terms—not just the headline price.</p></div><form onSubmit={addOffer} className="fsbo-compact-form"><label>Buyer or agent <input name="buyerName" required maxLength={160} /></label><label>Offer price <input name="offerPrice" type="number" required min="1" /></label><label>Financing <input name="financing" required maxLength={120} placeholder="Cash, conventional…" /></label><label>Closing date <input name="closingDate" type="date" /></label><label className="fsbo-full">Notes <input name="offerNotes" maxLength={1000} placeholder="Contingencies, earnest money, or counter details" /></label><button type="submit">Add offer</button></form>{offers.length > 0 && <ul className="fsbo-record-list">{offers.map((offer) => <li key={offer.id}><strong>{money(offer.offer_price)} · {offer.status.toLowerCase()}</strong><span>{offer.buyer_name} · {offer.financing}{offer.closing_date ? ` · closes ${offer.closing_date}` : ""}{offer.notes ? ` · ${offer.notes}` : ""}</span></li>)}</ul>}</div>
    {message && <p className="seller-form-status" aria-live="polite">{message}</p>}
  </div>;
}
