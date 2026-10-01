import type { Property } from "@/features/properties/data/properties";

export type AssignedAgent = { name: string; title: string; email: string; phone: string; initials: string };

const agents: AssignedAgent[] = [
  { name: "Maya Chen", title: "Property advisor", email: "maya.chen@example.com", phone: "(555) 014-2201", initials: "MC" },
  { name: "Jordan Rivera", title: "Property advisor", email: "jordan.rivera@example.com", phone: "(555) 014-2202", initials: "JR" },
  { name: "Avery Brooks", title: "Property advisor", email: "avery.brooks@example.com", phone: "(555) 014-2203", initials: "AB" },
];

export function getAssignedAgent(property: Property) {
  return agents[property.id % agents.length];
}
