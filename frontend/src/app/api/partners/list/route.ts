import { NextResponse } from "next/server";

const placeholderPartners = [
  { _id: "1", name: "Mthunzi Trust Partner 1", logo: "/images/mthunzi-trust-logo.png" },
  { _id: "2", name: "Mthunzi Trust Partner 2", logo: "/images/mthunzi-trust-logo.png" },
  { _id: "3", name: "Mthunzi Trust Partner 3", logo: "/images/mthunzi-trust-logo.png" },
  { _id: "4", name: "Mthunzi Trust Partner 4", logo: "/images/mthunzi-trust-logo.png" },
  { _id: "5", name: "Mthunzi Trust Partner 5", logo: "/images/mthunzi-trust-logo.png" },
];

export async function GET() {
  return NextResponse.json(placeholderPartners);
}