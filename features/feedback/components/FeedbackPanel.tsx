"use client";

import { useState, type FormEvent } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/features/accounts/lib/supabase-browser";

export function FeedbackPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("idea");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client) {
      setStatus("Feedback will be available when Supabase is connected.");
      return;
    }

    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      setStatus("Please sign in before sending feedback so we can keep feedback useful and prevent spam.");
      return;
    }

    const { error } = await client.from("feedback_submissions").insert({
      user_id: user.id,
      category,
      message: message.trim(),
    });
    if (error) {
      setStatus("We could not send your feedback. Please try again.");
      return;
    }

    setMessage("");
    setStatus("Thank you. Your feedback has been sent.");
  }

  return (
    <>
      <button className="footer-feedback-button" type="button" onClick={() => { setStatus(""); setIsOpen(true); }}>
        Send feedback
      </button>
      {isOpen && (
        <div className="modal-backdrop feedback-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          <div className="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
            <button className="modal-close-button" type="button" aria-label="Close feedback form" onClick={() => setIsOpen(false)}>×</button>
            <p className="eyebrow section-eyebrow">Help improve Smart Home Finder</p>
            <h2 id="feedback-title">Send feedback</h2>
            <p>Tell us what worked, what was confusing, or what you would like next.</p>
            <form onSubmit={submitFeedback}>
              <label><span>Feedback type</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="idea">Idea</option><option value="issue">Something is not working</option><option value="question">Question</option></select></label>
              <label><span>Your feedback</span><textarea required minLength={10} maxLength={2000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell us more…" /></label>
              <button type="submit" disabled={!isSupabaseConfigured() || message.trim().length < 10}>Send feedback</button>
              {status && <p className="feedback-status" aria-live="polite">{status}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
