import Link from "next/link";

export const metadata = { title: "Terms of Service | Smart Home Finder" };

export default function TermsPage() {
  return (
    <main className="legal-page">
      <Link className="legal-back" href="/">← Back to Smart Home Finder</Link>
      <p className="eyebrow"><span /> Legal</p>
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: September 28, 2026</p>
      <section><h2>Using Smart Home Finder</h2><p>Smart Home Finder helps people organize a home search. You are responsible for verifying property details, neighborhood information, availability, and pricing before making a decision.</p></section>
      <section><h2>Estimates and scores</h2><p>Monthly costs, market trends, property matches, and neighborhood scores are estimates based on available information and user-selected assumptions. They are not lending offers, appraisals, guarantees, or professional advice.</p></section>
      <section><h2>Accounts</h2><p>Keep access to your email account secure. You may delete your saved data or your account from the Account window.</p></section>
      <section><h2>Acceptable use</h2><p>Do not misuse the service, interfere with its operation, submit harmful content, or attempt to access another person&apos;s account or data.</p></section>
      <section><h2>Changes</h2><p>We may update these terms as the product evolves. Continued use after a change means you accept the updated terms.</p></section>
    </main>
  );
}
