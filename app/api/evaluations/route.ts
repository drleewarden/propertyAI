import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Fetch evaluations for the selected state
    const evaluations = await prisma.propertyEvaluation.findMany({
      where: {
        state: state.toUpperCase(),
      },
      select: {
        id: true,
        state: true,
        city: true,
        suburb: true,
        houseMedianPrice: true,
        unitMedianPrice: true,
        houseYield: true,
        unitYield: true,
      },
      orderBy: {
        suburb: "asc",
      },
    });

    if (evaluations.length === 0) {
      console.warn(`No evaluations found for state: ${state}`);
    }

    return NextResponse.json(evaluations);
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    return NextResponse.json(
      { error: "Failed to fetch evaluations", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
