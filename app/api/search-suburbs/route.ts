import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { suburb, state } = await request.json();

    if (!suburb || typeof suburb !== "string") {
      return NextResponse.json(
        { error: "Suburb is required" },
        { status: 400 }
      );
    }

    // Search suburbs directly from database
    const locations = await prisma.location_data.findMany({
      where: {
        AND: [
          {
            suburbName: {
              contains: suburb,
              mode: "insensitive",
            },
          },
          state
            ? {
                state: state.toUpperCase(),
              }
            : {},
        ],
      },
      select: {
        suburbName: true,
        state: true,
      },
      take: 10, // Limit to 10 suggestions
      orderBy: {
        suburbName: "asc",
      },
    });

    // Format suggestions as "Suburb, State"
    const suggestions = locations.map(
      (loc) => `${loc.suburbName}, ${loc.state}`
    );

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Search suburbs API error:", error);
    return NextResponse.json(
      { error: "Internal server error", suggestions: [] },
      { status: 500 }
    );
  }
}
