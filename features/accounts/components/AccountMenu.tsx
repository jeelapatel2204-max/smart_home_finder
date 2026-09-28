"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../lib/supabase-browser";
import { deleteAccountData } from "../lib/account-data";

export function AccountMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmingDataDeletion, setConfirmingDataDeletion] = useState(false);
  const [confirmingAccountDeletion, setConfirmingAccountDeletion] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return undefined;
    function loadUser(nextUser: User | null) {
      setUser(nextUser);
      const nextFirstName = typeof nextUser?.user_metadata.first_name === "string" ? nextUser.user_metadata.first_name : "";
      const nextLastName = typeof nextUser?.user_metadata.last_name === "string" ? nextUser.user_metadata.last_name : "";
      const nextPhone = typeof nextUser?.user_metadata.phone === "string" ? nextUser.user_metadata.phone : "";
      setFirstName(nextFirstName);
      setLastName(nextLastName);
      setPhone(nextPhone);
      setNewEmail(nextUser?.email ?? "");

    }

    supabase.auth.getUser().then(({ data }) => loadUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => loadUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  async function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !firstName.trim() || !lastName.trim() || !email.trim()) return;

    setMessage("Creating your account…");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim() || undefined,
        },
      },
    });
    setMessage(error ? error.message : "Check your email for a secure link to finish signing in.");
  }

  async function signOut() {
    await getSupabaseBrowserClient()?.auth.signOut();
    setIsOpen(false);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !firstName.trim() || !lastName.trim()) return;

    setMessage("Saving your details…");
    const { data, error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || undefined,
      },
    });
    if (error) {
      setMessage(error.message);
      return;
    }

    setUser(data.user);
    setMessage("Your details have been saved.");
    setIsEditingProfile(false);
  }

  async function removeStoredData() {
    const client = getSupabaseBrowserClient();
    if (!client || !user) return;
    await deleteAccountData(client, user.id);
    setMessage("Your saved homes, rules, and searches have been deleted.");
    setConfirmingDataDeletion(false);
  }

  async function requestEmailChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    const nextEmail = newEmail.trim().toLowerCase();
    if (!client || !nextEmail || nextEmail === user?.email?.toLowerCase()) return;

    setMessage("Sending confirmation links…");
    const { error } = await client.auth.updateUser({ email: nextEmail });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Check your current and new email inboxes to confirm the change.");
    setIsChangingEmail(false);
  }

  async function deleteAccount() {
    const client = getSupabaseBrowserClient();
    if (!client) return;

    setMessage("Deleting your account…");
    const { error } = await client.functions.invoke("delete-account");
    if (error) {
      setMessage("Account deletion is not available yet. Deploy the delete-account Supabase function, then try again.");
      return;
    }

    await client.auth.signOut();
    setConfirmingAccountDeletion(false);
    setIsOpen(false);
  }

  return (
    <div className="account-menu">
      <button className="sign-in-button" type="button" onClick={() => { setMessage(""); setIsOpen((open) => !open); }}>
        {user ? "Account" : "Login / Sign in"}
      </button>
      {isOpen && (
        <div className="modal-backdrop account-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }} role="presentation">
          <div className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-title">
            <button className="modal-close-button" type="button" aria-label="Close account window" onClick={() => setIsOpen(false)}>×</button>
            {user ? (
              <>
                <p className="eyebrow section-eyebrow">Your account</p>
                <h2 id="account-title">You&apos;re signed in</h2>
                <p>{user.email}</p>
                {isEditingProfile ? (
                  <form className="account-form account-profile-form" onSubmit={saveProfile}>
                    <div className="account-name-fields">
                      <label><span>First name</span><input required autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} /></label>
                      <label><span>Last name</span><input required autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} /></label>
                    </div>
                    <label><span>Phone number <em>Optional</em></span><input type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(555) 123-4567" /></label>
                    <div className="account-form-actions">
                      <button type="submit" disabled={!firstName.trim() || !lastName.trim()}>Save details</button>
                      <button type="button" className="account-secondary-button" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="account-profile-summary">{firstName || lastName ? `${firstName} ${lastName}`.trim() : "Add your name to personalize your account."}</p>
                    <button type="button" className="account-secondary-button" onClick={() => { setMessage(""); setIsEditingProfile(true); }}>Edit personal details</button>
                  </>
                )}
                {isChangingEmail ? (
                  <form className="account-form account-profile-form" onSubmit={requestEmailChange}>
                    <label><span>New email address</span><input required type="email" autoComplete="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} /></label>
                    <div className="account-form-actions">
                      <button type="submit" disabled={!newEmail.trim() || newEmail.trim().toLowerCase() === user.email?.toLowerCase()}>Change email</button>
                      <button type="button" className="account-secondary-button" onClick={() => { setNewEmail(user.email ?? ""); setIsChangingEmail(false); }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <button type="button" className="account-secondary-button" onClick={() => { setMessage(""); setIsChangingEmail(true); }}>Change email</button>
                )}
                {confirmingDataDeletion ? (
                  <div className="account-danger-zone">
                    <p>Delete all saved homes, rules, and searches?</p>
                    <button type="button" onClick={removeStoredData}>Yes, delete my saved data</button>
                    <button type="button" onClick={() => setConfirmingDataDeletion(false)}>Cancel</button>
                  </div>
                ) : (
                  <button type="button" className="account-delete-button" onClick={() => setConfirmingDataDeletion(true)}>Delete saved data</button>
                )}
                {confirmingAccountDeletion ? (
                  <div className="account-danger-zone account-delete-account-zone">
                    <p>Delete your account permanently? This also removes all saved homes, rules, and searches.</p>
                    <button type="button" onClick={deleteAccount}>Yes, delete my account</button>
                    <button type="button" onClick={() => setConfirmingAccountDeletion(false)}>Cancel</button>
                  </div>
                ) : (
                  <button type="button" className="account-delete-account-button" onClick={() => { setMessage(""); setConfirmingAccountDeletion(true); }}>Delete my account</button>
                )}
                {message && <p className="account-message" aria-live="polite">{message}</p>}
                <button type="button" className="account-sign-out-button" onClick={signOut}>Sign out</button>
              </>
            ) : !isSupabaseConfigured() ? (
              <p>Account sign-in will be available when Supabase is connected.</p>
            ) : (
              <form className="account-form" onSubmit={createAccount}>
                <p className="eyebrow section-eyebrow">Your account</p>
                <h2 id="account-title">Create your account</h2>
                <p>Save your homes and searches, then access them on any device.</p>
                <div className="account-name-fields">
                  <label><span>First name</span><input required autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} /></label>
                  <label><span>Last name</span><input required autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} /></label>
                </div>
                <label><span>Email address</span><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
                <label><span>Phone number <em>Optional</em></span><input type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(555) 123-4567" /></label>
                <button type="submit" disabled={!firstName.trim() || !lastName.trim() || !email.trim()}>Create account</button>
                {message && <p className="account-message" aria-live="polite">{message}</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
