"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AccountMenu } from "@/features/accounts/components/AccountMenu";
import { getSupabaseBrowserClient } from "@/features/accounts/lib/supabase-browser";

type Status = "NEW" | "CONTACTED" | "CLOSED";
type Inquiry = { id: string; selling_path: "AGENT" | "FSBO"; property_address: string; timeline: string; notes: string | null; status: Status; created_at: string };

export function SellerRequestManagement() {
  const [state, setState] = useState<"loading" | "signed-out" | "forbidden" | "ready" | "error">("signed-out");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    void (async () => {
      const client = getSupabaseBrowserClient();
      if (!client) return;
      const { data } = await client.auth.getUser();
      if (!data.user) { setState("signed-out"); return; }
      setState("loading");
      const admin = await client.from("seller_admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
      if (admin.error || !admin.data) { setState("forbidden"); return; }
      const results = await client.from("seller_inquiries").select("id, selling_path, property_address, timeline, notes, status, created_at").order("created_at", { ascending: false });
      if (results.error) { setState("error"); setMessage("We could not load seller requests."); }
      else { setInquiries((results.data ?? []) as Inquiry[]); setState("ready"); }
    })();
  }, []);
  async function updateStatus(inquiry: Inquiry, status: Status) { const client = getSupabaseBrowserClient(); if (!client) return; setInquiries((current) => current.map((item) => item.id === inquiry.id ? { ...item, status } : item)); const { error } = await client.from("seller_inquiries").update({ status }).eq("id", inquiry.id); if (error) { setInquiries((current) => current.map((item) => item.id === inquiry.id ? inquiry : item)); setMessage("The status did not save. Please try again."); } else setMessage("Request status updated."); }
  return <main className="seller-management-page"><header className="site-header"><div className="header-inner"><Link className="brand" href="/"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 36 36"><path d="m5 16 13-11 13 11v14H5V16Z" /><path d="M14 30V19h8v11M3 16 18 3l15 13" /></svg></span><span>Smart Home Finder</span></Link><nav className="main-nav" aria-label="Main navigation"><Link className="nav-link" href="/">Buy</Link><Link className="nav-link" href="/sell">Sell</Link></nav><AccountMenu /></div></header><section className="seller-management"><p className="eyebrow section-eyebrow">Owner workspace</p><h1>Seller request management</h1>{state === "loading" && <p>Loading request queue…</p>}{state === "signed-out" && <p>Sign in with an owner account to manage seller requests.</p>}{state === "forbidden" && <p>Your account does not have access to the seller request queue.</p>}{state === "error" && <p>{message}</p>}{state === "ready" && <><p className="seller-management-intro">Review incoming requests and keep each request’s contact status current.</p>{message && <p className="seller-form-status" aria-live="polite">{message}</p>}{inquiries.length === 0 ? <div className="seller-dashboard-empty"><p>No seller requests have been submitted yet.</p></div> : <div className="seller-admin-list">{inquiries.map((inquiry) => <article key={inquiry.id}><div><span className={`seller-path-badge ${inquiry.selling_path.toLowerCase()}`}>{inquiry.selling_path === "AGENT" ? "Agent support" : "FSBO"}</span><h2>{inquiry.property_address}</h2><p>{inquiry.timeline} · received {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(inquiry.created_at))}</p>{inquiry.notes && <p className="seller-request-notes">{inquiry.notes}</p>}</div><label>Request status<select value={inquiry.status} onChange={(event) => void updateStatus(inquiry, event.target.value as Status)}><option value="NEW">New</option><option value="CONTACTED">Contacted</option><option value="CLOSED">Closed</option></select></label></article>)}</div>}</>}</section></main>;
}
