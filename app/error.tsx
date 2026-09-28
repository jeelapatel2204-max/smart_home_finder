"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="route-state" aria-labelledby="error-title">
      <p className="eyebrow">Something went wrong</p>
      <h1 id="error-title">We couldn&apos;t load this page.</h1>
      <p>Try again. If the problem continues, return to the home search.</p>
      <div className="route-state-actions">
        <button className="route-state-action" type="button" onClick={reset}>
          Try again
        </button>
        <Link className="route-state-link" href="/">
          Browse homes
        </Link>
      </div>
    </main>
  );
}
