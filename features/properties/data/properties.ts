import type { PropertyFinancials } from "@/features/financials/lib/true-monthly-cost";

export type NeighborhoodMetrics = {
  schools: number;
  safety: number;
  amenities: number;
  accessibility: number;
  housingValue: number;
};

export type Property = {
  id: number;
  price: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  squareFeet: number;
  propertyType: string;
  score: number;
  latitude: number;
  longitude: number;
  neighborhood: NeighborhoodMetrics;
  image: string;
  imageAlt: string;
  label: string;
  description: string;
  financials: PropertyFinancials;
  estimatedMonthlyRent: number;
  defaultVacancyRate: number;
  defaultMaintenanceRate: number;
  defaultAnnualAppreciationRate: number;
  defaultDownPaymentPercent: number;
  defaultInterestRate: number;
};

export const properties: Property[] = [
  {
    id: 1,
    price: 1285000,
    address: "1842 Valencia Street",
    city: "San Francisco",
    state: "CA",
    zip: "94110",
    beds: 3,
    baths: 2,
    squareFeet: 1840,
    propertyType: "Single-family home",
    score: 92,
    latitude: 37.7587,
    longitude: -122.4211,
    neighborhood: {
      schools: 94,
      safety: 89,
      amenities: 93,
      accessibility: 90,
      housingValue: 95,
    },
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Sunlit modern home with a landscaped front garden",
    label: "Open Sunday",
    description:
      "This light-filled three-bedroom home combines classic San Francisco charm with thoughtful modern updates, including a renovated kitchen, warm wood finishes, and a welcoming backyard for relaxed evenings at home.",
    financials: {
      annualPropertyTax: 12420,
      monthlyInsurance: 290,
      monthlyHoa: 0,
      estimatedMonthlyMaintenance: 700,
    },
    estimatedMonthlyRent: 5900,
    defaultVacancyRate: 5,
    defaultMaintenanceRate: 6,
    defaultAnnualAppreciationRate: 3.2,
    defaultDownPaymentPercent: 20,
    defaultInterestRate: 6.75,
  },
  {
    id: 2,
    price: 785000,
    address: "2716 West 25th Avenue",
    city: "Denver",
    state: "CO",
    zip: "80211",
    beds: 4,
    baths: 3,
    squareFeet: 2260,
    propertyType: "Two-story home",
    score: 88,
    latitude: 39.7542,
    longitude: -105.0216,
    neighborhood: {
      schools: 90,
      safety: 86,
      amenities: 88,
      accessibility: 84,
      housingValue: 90,
    },
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Contemporary white home framed by mature trees",
    label: "New this week",
    description:
      "This contemporary family home offers an airy layout with generous bedrooms, a spacious kitchen, and a private outdoor area designed for weekend gatherings and everyday comfort.",
    financials: {
      annualPropertyTax: 9360,
      monthlyInsurance: 240,
      monthlyHoa: 0,
      estimatedMonthlyMaintenance: 425,
    },
    estimatedMonthlyRent: 3600,
    defaultVacancyRate: 5,
    defaultMaintenanceRate: 6,
    defaultAnnualAppreciationRate: 3.5,
    defaultDownPaymentPercent: 20,
    defaultInterestRate: 6.65,
  },
  {
    id: 3,
    price: 649000,
    address: "3908 Berkman Drive",
    city: "Austin",
    state: "TX",
    zip: "78723",
    beds: 3,
    baths: 2,
    squareFeet: 1715,
    propertyType: "Single-family home",
    score: 85,
    latitude: 30.3036,
    longitude: -97.7068,
    neighborhood: {
      schools: 84,
      safety: 83,
      amenities: 88,
      accessibility: 82,
      housingValue: 87,
    },
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Warm modern home with a shaded outdoor patio",
    label: "Price reduced",
    description:
      "A warm, modern home with a comfortable open-plan living area, rich finishes, and a shaded patio that makes indoor-outdoor living feel easy year-round.",
    financials: {
      annualPropertyTax: 7440,
      monthlyInsurance: 220,
      monthlyHoa: 175,
      estimatedMonthlyMaintenance: 400,
    },
    estimatedMonthlyRent: 3100,
    defaultVacancyRate: 6,
    defaultMaintenanceRate: 7,
    defaultAnnualAppreciationRate: 3.8,
    defaultDownPaymentPercent: 20,
    defaultInterestRate: 6.8,
  },
  {
    id: 4,
    price: 715000,
    address: "5123 Northeast 27th Avenue",
    city: "Portland",
    state: "OR",
    zip: "97211",
    beds: 3,
    baths: 2,
    squareFeet: 1960,
    propertyType: "Craftsman home",
    score: 90,
    latitude: 45.5576,
    longitude: -122.6378,
    neighborhood: {
      schools: 91,
      safety: 87,
      amenities: 90,
      accessibility: 92,
      housingValue: 89,
    },
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Inviting craftsman-style home surrounded by greenery",
    label: "Open Saturday",
    description:
      "This charming craftsman offers original character with updated systems, bright living spaces, and a leafy front yard that creates a welcoming first impression.",
    financials: {
      annualPropertyTax: 7800,
      monthlyInsurance: 230,
      monthlyHoa: 0,
      estimatedMonthlyMaintenance: 450,
    },
    estimatedMonthlyRent: 3250,
    defaultVacancyRate: 5,
    defaultMaintenanceRate: 6,
    defaultAnnualAppreciationRate: 3.1,
    defaultDownPaymentPercent: 20,
    defaultInterestRate: 6.7,
  },
  {
    id: 5,
    price: 925000,
    address: "1412 East Boulevard",
    city: "Charlotte",
    state: "NC",
    zip: "28203",
    beds: 4,
    baths: 3,
    squareFeet: 2480,
    propertyType: "Traditional home",
    score: 87,
    latitude: 35.1941,
    longitude: -80.8407,
    neighborhood: {
      schools: 88,
      safety: 85,
      amenities: 86,
      accessibility: 83,
      housingValue: 89,
    },
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Bright brick home with a leafy front yard",
    label: "Just listed",
    description:
      "A bright, inviting home with a flexible floor plan, a spacious kitchen, and plenty of room for both entertaining and everyday family routines.",
    financials: {
      annualPropertyTax: 8640,
      monthlyInsurance: 260,
      monthlyHoa: 195,
      estimatedMonthlyMaintenance: 525,
    },
    estimatedMonthlyRent: 4100,
    defaultVacancyRate: 6,
    defaultMaintenanceRate: 6,
    defaultAnnualAppreciationRate: 3.6,
    defaultDownPaymentPercent: 20,
    defaultInterestRate: 6.65,
  },
  {
    id: 6,
    price: 1050000,
    address: "6321 24th Avenue Northwest",
    city: "Seattle",
    state: "WA",
    zip: "98107",
    beds: 3,
    baths: 2.5,
    squareFeet: 2110,
    propertyType: "Modern residence",
    score: 94,
    latitude: 47.6734,
    longitude: -122.3865,
    neighborhood: {
      schools: 95,
      safety: 92,
      amenities: 96,
      accessibility: 93,
      housingValue: 95,
    },
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Modern wood-and-glass house with a garden entrance",
    label: "Open Sunday",
    description:
      "This modern residence blends clean lines, quality materials, and a laid-back Seattle lifestyle with ample natural light, polished finishes, and seamless indoor-outdoor flow.",
    financials: {
      annualPropertyTax: 11160,
      monthlyInsurance: 310,
      monthlyHoa: 0,
      estimatedMonthlyMaintenance: 575,
    },
    estimatedMonthlyRent: 4650,
    defaultVacancyRate: 5,
    defaultMaintenanceRate: 6,
    defaultAnnualAppreciationRate: 3.4,
    defaultDownPaymentPercent: 20,
    defaultInterestRate: 6.7,
  },
];

export function getPropertyById(id: number): Property | undefined {
  return properties.find((property) => property.id === id);
}
