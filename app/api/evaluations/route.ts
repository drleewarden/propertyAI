import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper function to calculate yield percentage
function calculateYield(rentalPrice: number, medianPrice: number): string | null {
  if (!rentalPrice || !medianPrice || medianPrice === 0) {
    return null;
  }
  // Annual rental income / property price * 100
  const annualRental = rentalPrice * 52; // Weekly rental * 52 weeks
  const yieldPercent = (annualRental / medianPrice) * 100;
  return yieldPercent.toFixed(2);
}

// Helper function to format price
function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)} M`;
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(0)} K`;
  }
  return `$${price}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state") || "QLD";

    if (!state) {
      return NextResponse.json(
        { error: "State parameter is required" },
        { status: 400 }
      );
    }

    // Fetch location data for the selected state
    const locationData = await prisma.location_data.findMany({
      where: {
        state: state.toUpperCase(),
      },
      select: {
        id: true,
        state: true,
        cityDistrict: true,
        suburbName: true,
        medianHousePrice: true,
        medianUnitPrice: true,
        rentalPriceHouse: true,
        rentalPriceUnit: true,
        vacancyRate: true,
        notes: true,
        demographicLifestyle: true,
        schools: true,
      },
      orderBy: {
        suburbName: "asc",
      },
    });

    if (locationData.length === 0) {
      console.warn(`No location data found for state: ${state}`);
    }

    // Transform the data to match the expected interface
    const evaluations = locationData.map((location: typeof locationData[0]) => ({
      id: location.id,
      state: location.state,
      city: location.cityDistrict || "N/A",
      suburb: location.suburbName,
      houseMedianPrice: formatPrice(location.medianHousePrice),
      unitMedianPrice: formatPrice(location.medianUnitPrice),
      houseYield: calculateYield(location.rentalPriceHouse, location.medianHousePrice),
      unitYield: calculateYield(location.rentalPriceUnit, location.medianUnitPrice),
      rentalPriceHouse: location.rentalPriceHouse,
      rentalPriceUnit: location.rentalPriceUnit,
      vacancyRate: location.vacancyRate,
      demographicLifestyle: location.demographicLifestyle,
      schools: location.schools,
      notes: location.notes,
    }));

    return NextResponse.json(evaluations);
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    return NextResponse.json(
      { error: "Failed to fetch evaluations", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
