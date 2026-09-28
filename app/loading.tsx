export default function HomeLoading() {
  return (
    <main className="route-state" aria-busy="true" aria-live="polite">
      <p className="eyebrow">Loading homes</p>
      <h1>Finding homes worth a closer look.</h1>
      <p>Please wait a moment.</p>
    </main>
  );
}
