import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const suburb = searchParams.get("suburb");
    const state = searchParams.get("state");

    if (!suburb || !state) {
      return NextResponse.json(
        { error: "Suburb and state are required" },
        { status: 400 }
      );
    }

    // Find location data for this suburb and state (from any user)
    const locationData = await prisma.location_data.findFirst({
      where: {
        suburbName: {
          equals: suburb,
          mode: "insensitive",
        },
        state: {
          equals: state,
          mode: "insensitive",
        },
      },
      orderBy: {
        updatedAt: "desc", // Get the most recently updated one if multiple exist
      },
    });

    if (!locationData) {
      return NextResponse.json(
        { error: "Location data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: locationData,
    });
  } catch (error) {
    console.error("Location data API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
