"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AccountMenu } from "@/features/accounts/components/AccountMenu";
import { getSupabaseBrowserClient } from "@/features/accounts/lib/supabase-browser";
import { FsboWorkspace } from "@/features/sellers/components/FsboWorkspace";

type SellingPath = "AGENT" | "FSBO";

type SellerInquiry = {
  id: string;
  selling_path: SellingPath;
  property_address: string;
  timeline: string;
  notes: string | null;
  status: "NEW" | "CONTACTED" | "CLOSED";
  created_at: string;
};

type FsboTask = {
  id: string;
  seller_inquiry_id: string;
  title: string;
  completed: boolean;
};

const fsboTaskTitles = [
  "Review recent comparable sales and local market trends",
  "Set a documented price range and target price",
  "Complete repairs, cleaning, and disclosure preparation",
  "Prepare professional-quality photos and listing details",
  "Choose where and how to market the home",
  "Create a showing plan and safety process",
  "Prepare a process for reviewing offers and contingencies",
  "Confirm contract, title, and closing support",
];

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
  const [userId, setUserId] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<SellerInquiry[]>([]);
  const [fsboTasks, setFsboTasks] = useState<FsboTask[]>([]);
  const [loadedForUserId, setLoadedForUserId] = useState<string | null>(null);
  const [dashboardMessage, setDashboardMessage] = useState("");
  const [inquiryVersion, setInquiryVersion] = useState(0);
  const content = pathContent[path];

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      return undefined;
    }

    function syncUser(nextUserId: string | undefined) {
      setUserId(nextUserId ?? null);
    }

    client.auth.getUser().then(({ data }) => syncUser(data.user?.id));
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => syncUser(session?.user?.id));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) return;
    void Promise.all([
      client.from("seller_inquiries")
        .select("id, selling_path, property_address, timeline, notes, status, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      client.from("seller_fsbo_tasks")
        .select("id, seller_inquiry_id, title, completed")
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
    ]).then(([inquiriesResult, tasksResult]) => {
      if (inquiriesResult.error || tasksResult.error) {
        setDashboardMessage("Your seller dashboard is not ready yet. Please apply the seller dashboard SQL migrations.");
        setInquiries([]);
        setFsboTasks([]);
      } else {
        setDashboardMessage("");
        setInquiries((inquiriesResult.data ?? []) as SellerInquiry[]);
        setFsboTasks((tasksResult.data ?? []) as FsboTask[]);
      }
      setLoadedForUserId(userId);
    });
  }, [inquiryVersion, userId]);

  const isLoadingDashboard = Boolean(userId && loadedForUserId !== userId);

  async function createFsboChecklist(inquiryId: string, ownerId: string) {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const { error } = await client.from("seller_fsbo_tasks").upsert(
      fsboTaskTitles.map((title) => ({ seller_inquiry_id: inquiryId, user_id: ownerId, title })),
      { onConflict: "seller_inquiry_id,title", ignoreDuplicates: true },
    );
    if (error) {
      setDashboardMessage("We could not create the FSBO checklist yet. Please try again.");
      return;
    }
    setInquiryVersion((current) => current + 1);
  }

  async function toggleFsboTask(task: FsboTask) {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const nextCompleted = !task.completed;
    setFsboTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed: nextCompleted } : item));
    const { error } = await client.from("seller_fsbo_tasks")
      .update({ completed: nextCompleted, updated_at: new Date().toISOString() })
      .eq("id", task.id);
    if (error) {
      setFsboTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed: task.completed } : item));
      setDashboardMessage("We could not update that task. Please try again.");
    }
  }

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
    setUserId(user.id);

    const { data: inquiry, error } = await client.from("seller_inquiries").insert({
      user_id: user.id,
      selling_path: path,
      property_address: address.trim(),
      timeline,
      notes: notes.trim() || null,
    }).select("id").single();
    if (error) {
      setStatus("We could not save your request yet. Please try again.");
      return;
    }

    setStatus(path === "AGENT"
      ? "Your agent-match request is saved. We will contact you when agent matching is available."
      : "Your selling plan is saved. Your checklist, pricing guidance, showing planner, and offer tracker are ready below.");
    setAddress("");
    setNotes("");
    if (path === "FSBO" && inquiry) await createFsboChecklist(inquiry.id, user.id);
    setInquiryVersion((current) => current + 1);
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

      <section className="seller-dashboard-section" aria-labelledby="seller-dashboard-title">
        <div className="seller-dashboard-inner">
          <div className="seller-dashboard-heading">
            <div><p className="eyebrow section-eyebrow">Your seller workspace</p><h2 id="seller-dashboard-title">Seller Dashboard</h2></div>
            {userId && <span>{inquiries.length} {inquiries.length === 1 ? "request" : "requests"}</span>}
          </div>
          {!userId ? (
            <div className="seller-dashboard-empty"><h3>Sign in to see your selling plans</h3><p>Your saved agent-match and FSBO requests will appear here.</p></div>
          ) : isLoadingDashboard ? (
            <div className="seller-dashboard-empty"><p>Loading your seller workspace…</p></div>
          ) : dashboardMessage ? (
            <div className="seller-dashboard-empty"><p>{dashboardMessage}</p></div>
          ) : inquiries.length === 0 ? (
            <div className="seller-dashboard-empty"><h3>No selling plans yet</h3><p>Use the form above to save an agent-match request or create an FSBO plan.</p></div>
          ) : (
            <div className="seller-request-grid">
              {inquiries.map((inquiry) => (
                <article className="seller-request-card" key={inquiry.id}>
                  <div className="seller-request-card-top"><span className={`seller-path-badge ${inquiry.selling_path.toLowerCase()}`}>{inquiry.selling_path === "AGENT" ? "Agent support" : "For sale by owner"}</span><span className={`seller-status ${inquiry.status.toLowerCase()}`}>{inquiry.status === "NEW" ? "Request received" : inquiry.status === "CONTACTED" ? "Contacted" : "Closed"}</span></div>
                  <h3>{inquiry.property_address}</h3>
                  <p>Timeline: <strong>{inquiry.timeline}</strong></p>
                  {inquiry.notes && <p className="seller-request-notes">{inquiry.notes}</p>}
                  <small>Saved {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(inquiry.created_at))}</small>
                  {inquiry.selling_path === "FSBO" && (() => {
                    const inquiryTasks = fsboTasks.filter((task) => task.seller_inquiry_id === inquiry.id);
                    return inquiryTasks.length > 0 ? (
                      <div className="seller-checklist"><strong>FSBO checklist · {inquiryTasks.filter((task) => task.completed).length}/{inquiryTasks.length} complete</strong>{inquiryTasks.map((task) => <label key={task.id}><input type="checkbox" checked={task.completed} onChange={() => void toggleFsboTask(task)} /><span>{task.title}</span></label>)}</div>
                    ) : (
                      <button type="button" className="seller-checklist-button" onClick={() => void createFsboChecklist(inquiry.id, userId!)}>Add FSBO checklist</button>
                    );
                  })()}
                  {inquiry.selling_path === "FSBO" && <FsboWorkspace inquiryId={inquiry.id} userId={userId!} />}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
