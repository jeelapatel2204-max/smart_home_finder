import Link from "next/link";

export default function NotFound() {
  return (
    <main className="route-state" aria-labelledby="not-found-title">
      <p className="eyebrow">404</p>
      <h1 id="not-found-title">We couldn&apos;t find that home.</h1>
      <p>
        The listing may no longer be available, or the link may be incomplete.
      </p>
      <Link className="route-state-action" href="/">
        Browse homes
      </Link>
    </main>
  );
}
