import Link from "next/link";

export const metadata = { title: "Privacy Policy | Smart Home Finder" };

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link className="legal-back" href="/">← Back to Smart Home Finder</Link>
      <p className="eyebrow"><span /> Legal</p>
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: September 28, 2026</p>
      <section><h2>Information we collect</h2><p>When you create an account, we collect your name, email address, optional phone number, saved homes, saved searches, budget rules, and feedback you choose to send.</p></section>
      <section><h2>How we use it</h2><p>We use this information to provide your account, save your preferences across devices, and improve the product. We do not sell personal information.</p></section>
      <section><h2>Data sources</h2><p>Property, neighborhood, and market information may come from sample data, public datasets, or third-party providers. Scores and cost estimates are informational estimates and should not be treated as financial, legal, or investment advice.</p></section>
      <section><h2>Your choices</h2><p>You can edit your profile, delete saved data, or delete your account from the Account window. Account deletion removes associated stored data.</p></section>
      <section><h2>Contact</h2><p>Use the in-app feedback form for privacy questions until a dedicated support contact is published.</p></section>
    </main>
  );
}
