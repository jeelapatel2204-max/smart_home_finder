"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AccountMenu } from "@/features/accounts/components/AccountMenu";
import { getSupabaseBrowserClient } from "@/features/accounts/lib/supabase-browser";

type SellingPath = "AGENT" | "FSBO";

const pathContent: Record<SellingPath, { eyebrow: string; title: string; description: string; benefits: string[]; submit: string }> = {
  AGENT: {
    eyebrow: "Sell with an agent",
    title: "Get local guidance without the pressure.",
    description: "Tell us about your home and timeline. We will prepare your request for a local-agent match when that network is available.",
    benefits: ["Pricing strategy based on local market context", "A plan for photos, showings, and offers", "Support through negotiations and closing"],
    submit: "Request an agent match",
  },
  FSBO: {
    eyebrow: "Sell it yourself",
    title: "Build a practical plan to sell on your own.",
    description: "Start with your home details and timeline. We will save your request so you can return to your selling checklist.",
    benefits: ["Prepare your pricing and home details", "Organize showing and offer tasks", "Know when to bring in a local professional"],
    submit: "Create my selling plan",
  },
};

export function SellerLanding() {
  const [path, setPath] = useState<SellingPath>("AGENT");
  const [address, setAddress] = useState("");
  const [timeline, setTimeline] = useState("1-3 months");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const content = pathContent[path];

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client) {
      setStatus("Create an account first so we can save your private selling request.");
      return;
    }

    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      setStatus("Please use Login / Sign in first, then return here to save your request.");
      return;
    }

    const { error } = await client.from("seller_inquiries").insert({
      user_id: user.id,
      selling_path: path,
      property_address: address.trim(),
      timeline,
      notes: notes.trim() || null,
    });
    if (error) {
      setStatus("We could not save your request yet. Please try again.");
      return;
    }

    setStatus(path === "AGENT"
      ? "Your agent-match request is saved. We will contact you when agent matching is available."
      : "Your selling plan request is saved. You can return to this page as we add FSBO tools.");
    setAddress("");
    setNotes("");
  }

  return (
    <main className="seller-page">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="Smart Home Finder home">
            <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 36 36"><path d="m5 16 13-11 13 11v14H5V16Z" /><path d="M14 30V19h8v11M3 16 18 3l15 13" /></svg></span>
            <span>Smart Home Finder</span>
          </Link>
          <nav className="main-nav" aria-label="Main navigation"><Link className="nav-link" href="/">Buy</Link><Link className="nav-link active" href="/sell">Sell</Link></nav>
          <AccountMenu />
        </div>
      </header>

      <section className="seller-hero">
        <div className="seller-hero-inner">
          <p className="eyebrow"><span /> Your next move, made clearer</p>
          <h1>Sell your home with a plan that fits you.</h1>
          <p>Choose the support you want. Your address stays private and nothing is published from this request.</p>
        </div>
      </section>

      <section className="seller-content" aria-labelledby="sell-path-title">
        <div className="seller-path-picker" role="tablist" aria-label="Selling paths">
          <button type="button" role="tab" aria-selected={path === "AGENT"} className={path === "AGENT" ? "active" : ""} onClick={() => { setPath("AGENT"); setStatus(""); }}>Work with an agent</button>
          <button type="button" role="tab" aria-selected={path === "FSBO"} className={path === "FSBO" ? "active" : ""} onClick={() => { setPath("FSBO"); setStatus(""); }}>For sale by owner</button>
        </div>
        <div className="seller-grid">
          <div className="seller-path-copy">
            <p className="eyebrow section-eyebrow">{content.eyebrow}</p>
            <h2 id="sell-path-title">{content.title}</h2>
            <p>{content.description}</p>
            <ul>{content.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
            <p className="seller-disclosure">Smart Home Finder does not set your listing price, represent you in a sale, or guarantee an outcome.</p>
          </div>
          <form className="seller-inquiry-form" onSubmit={submitInquiry}>
            <h2>{path === "AGENT" ? "Tell us about your home" : "Start your selling plan"}</h2>
            <label><span>Home address</span><input required value={address} onChange={(event) => setAddress(event.target.value)} placeholder="123 Main Street, City, ST 12345" autoComplete="street-address" /></label>
            <label><span>When would you like to sell?</span><select value={timeline} onChange={(event) => setTimeline(event.target.value)}><option>As soon as possible</option><option>1-3 months</option><option>3-6 months</option><option>More than 6 months</option><option>Just exploring</option></select></label>
            <label><span>Anything else we should know? <em>Optional</em></span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={2000} placeholder="For example: home updates, preferred contact time, or goals." /></label>
            <button type="submit">{content.submit}</button>
            {status && <p className="seller-form-status" aria-live="polite">{status}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}
