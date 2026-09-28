import type { NeighborhoodContext as NeighborhoodContextData } from "@/features/neighborhoods/lib/context";

export function NeighborhoodContext({ context }: { context: NeighborhoodContextData | null }) {
  if (!context) {
    return <p className="neighborhood-context-note">Live neighborhood context is temporarily unavailable. The score breakdown remains sample data.</p>;
  }

  const radiusMiles = (context.radiusMeters / 1_609.344).toFixed(1);
  const metrics = [
    ["Schools", context.counts.schools],
    ["Parks", context.counts.parks],
    ["Groceries", context.counts.groceries],
    ["Healthcare", context.counts.healthcare],
    ["Transit stops", context.counts.transitStops],
  ];

  return (
    <div className="neighborhood-context" aria-label="Live neighborhood context">
      <div className="neighborhood-context-heading">
        <strong>Nearby places</strong>
        <span>Within {radiusMiles} mi · {context.source}</span>
      </div>
      <div className="neighborhood-context-grid">
        {metrics.map(([label, count]) => <span key={label}><strong>{count}</strong> {label}</span>)}
      </div>
      <p>These are live place counts, not quality or safety ratings. Safety and school-quality scores will stay unavailable until we add reliable sources.</p>
    </div>
  );
}
