import { 
  MapPin, 
  Home, 
  DollarSign, 
  School, 
  Trees, 
  ShieldCheck, 
  Star 
} from "lucide-react";

// Import assets (using the generated paths)
import listing1 from "@assets/generated_images/modern_cozy_living_room.png";
import listing2 from "@assets/generated_images/apartment_exterior_with_playground.png";
import listing3 from "@assets/generated_images/spacious_family_kitchen.png";

export interface Amenity {
  icon: any;
  label: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  tags: string[];
  rating: number; // Safety/Family rating
  schoolDistrict: string;
  amenities: string[];
}

export const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Sunny Creek Apartments",
    price: 1250,
    address: "124 Maple Drive, Northwood",
    beds: 2,
    baths: 1.5,
    sqft: 950,
    image: listing1,
    tags: ["Near Park", "Top Rated School"],
    rating: 4.8,
    schoolDistrict: "Northwood Elementary (9/10)",
    amenities: ["Playground", "In-unit Laundry", "Secure Entry"]
  },
  {
    id: "2",
    title: "The Oakwood Family Complex",
    price: 1400,
    address: "88 Oak Avenue, Riverton",
    beds: 3,
    baths: 2,
    sqft: 1200,
    image: listing2,
    tags: ["Playground On-site", "Quiet Area"],
    rating: 4.5,
    schoolDistrict: "Riverton High (8/10)",
    amenities: ["Pool", "Community Center", "Pet Friendly"]
  },
  {
    id: "3",
    title: "Modern City Garden Unit",
    price: 1150,
    address: "45 Pine Lane, Westside",
    beds: 2,
    baths: 1,
    sqft: 850,
    image: listing3,
    tags: ["Budget Friendly", "Renovated"],
    rating: 4.2,
    schoolDistrict: "Westside Primary (7/10)",
    amenities: ["Dishwasher", "Parking Included", "Near Transit"]
  }
];

export const POPULAR_SEARCHES = [
  "Near Elementary Schools",
  "Under $1200/mo",
  "3+ Bedrooms",
  "Safe Neighborhoods",
  "Fenced Yards"
];
