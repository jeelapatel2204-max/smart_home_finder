import type { Property } from "@/features/properties/data/properties";
import { calculateNeighborhoodScore } from "@/features/neighborhoods/lib/score";
import type { MatchResult } from "@/features/property-matching/lib/evaluate-property";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function ComparisonPanel({
  properties,
  matches,
  onRemove,
}: {
  properties: Property[];
  matches: Record<number, MatchResult>;
  onRemove: (propertyId: number) => void;
}) {
  if (properties.length === 0) return null;

  return (
    <section className="comparison-panel" aria-labelledby="comparison-title">
      <div className="comparison-heading">
        <div>
          <p className="eyebrow section-eyebrow">Your shortlist</p>
          <h2 id="comparison-title">Compare homes</h2>
        </div>
        <span>{properties.length} selected</span>
      </div>
      <div className="comparison-scroll">
        <table>
          <thead><tr><th>Home</th>{properties.map((property) => <th key={property.id}><div className="comparison-home-heading"><div className="comparison-home-photo" role="img" aria-label={property.imageAlt} style={{ backgroundImage: `url("${property.image}")` }} /><span>{property.address}</span><small>{property.city}, {property.state}</small></div></th>)}</tr></thead>
          <tbody>
            <tr><th>Listing price</th>{properties.map((property) => <td key={property.id}>{currency.format(property.price)}</td>)}</tr>
            <tr><th>Beds / baths</th>{properties.map((property) => <td key={property.id}>{property.beds} bd · {property.baths} ba</td>)}</tr>
            <tr><th>Match score</th>{properties.map((property) => <td key={property.id}>{matches[property.id].evaluatedRuleCount > 0 ? `${matches[property.id].score}%` : "Set filters"}</td>)}</tr>
            <tr><th>Neighborhood score</th>{properties.map((property) => <td key={property.id}>{calculateNeighborhoodScore(property.neighborhood).score}/100</td>)}</tr>
            <tr><th> </th>{properties.map((property) => <td key={property.id}><button type="button" onClick={() => onRemove(property.id)}>Remove</button></td>)}</tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
