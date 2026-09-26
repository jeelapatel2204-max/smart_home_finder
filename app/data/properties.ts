export type NeighborhoodMetrics = {
  schools: number;
  safety: number;
  amenities: number;
  accessibility: number;
  housingValue: number;
};

export type MonthlyCost = {
  mortgage: number;
  propertyTaxes: number;
  insurance: number;
  hoa: number;
  total: number;
};

export type Property = {
  id: number;
  price: number;
  address: string;
  city: string;
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
  monthlyCost: MonthlyCost;
};

export const properties: Property[] = [
  {
    id: 1,
    price: 1285000,
    address: "1842 Valencia Street",
    city: "San Francisco",
    zip: "94110",
    beds: 3,
    baths: 2,
    squareFeet: 1840,
    propertyType: "Single-family home",
    score: 92,
    latitude: 39.1485,
    longitude: -84.5526,
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
    monthlyCost: {
      mortgage: 6420,
      propertyTaxes: 1035,
      insurance: 290,
      hoa: 0,
      total: 7745,
    },
  },
  {
    id: 2,
    price: 785000,
    address: "2716 West 25th Avenue",
    city: "Denver",
    zip: "80211",
    beds: 4,
    baths: 3,
    squareFeet: 2260,
    propertyType: "Two-story home",
    score: 88,
    latitude: 39.1643,
    longitude: -84.5059,
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
    monthlyCost: {
      mortgage: 3920,
      propertyTaxes: 780,
      insurance: 240,
      hoa: 0,
      total: 4940,
    },
  },
  {
    id: 3,
    price: 649000,
    address: "3908 Berkman Drive",
    city: "Austin",
    zip: "78723",
    beds: 3,
    baths: 2,
    squareFeet: 1715,
    propertyType: "Single-family home",
    score: 85,
    latitude: 39.1792,
    longitude: -84.4662,
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
    monthlyCost: {
      mortgage: 3250,
      propertyTaxes: 620,
      insurance: 220,
      hoa: 175,
      total: 4265,
    },
  },
  {
    id: 4,
    price: 715000,
    address: "5123 Northeast 27th Avenue",
    city: "Portland",
    zip: "97211",
    beds: 3,
    baths: 2,
    squareFeet: 1960,
    propertyType: "Craftsman home",
    score: 90,
    latitude: 39.1112,
    longitude: -84.4461,
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
    monthlyCost: {
      mortgage: 3585,
      propertyTaxes: 650,
      insurance: 230,
      hoa: 0,
      total: 4465,
    },
  },
  {
    id: 5,
    price: 925000,
    address: "1412 East Boulevard",
    city: "Charlotte",
    zip: "28203",
    beds: 4,
    baths: 3,
    squareFeet: 2480,
    propertyType: "Traditional home",
    score: 87,
    latitude: 39.1378,
    longitude: -84.5956,
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
    monthlyCost: {
      mortgage: 4630,
      propertyTaxes: 720,
      insurance: 260,
      hoa: 195,
      total: 5805,
    },
  },
  {
    id: 6,
    price: 1050000,
    address: "6321 24th Avenue Northwest",
    city: "Seattle",
    zip: "98107",
    beds: 3,
    baths: 2.5,
    squareFeet: 2110,
    propertyType: "Modern residence",
    score: 94,
    latitude: 39.1284,
    longitude: -84.6042,
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
    monthlyCost: {
      mortgage: 5285,
      propertyTaxes: 930,
      insurance: 310,
      hoa: 0,
      total: 6525,
    },
  },
];

export function getPropertyById(id: number): Property | undefined {
  return properties.find((property) => property.id === id);
}
