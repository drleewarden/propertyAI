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

    // First check if we already have this suburb in the database
    const existingLocation = await prisma.location_data.findFirst({
      where: {
        suburbName: {
          equals: suburb,
          mode: "insensitive",
        },
        state: state ? state.toUpperCase() : undefined,
      },
    });

    if (existingLocation) {
      console.log("Suburb already exists in database:", suburb);
      return NextResponse.json({
        success: true,
        source: "database",
        data: existingLocation,
      });
    }

    // Call AWS location lambda via the main API
    console.log(`Fetching suburb data for ${suburb}, ${state} from AWS`);
    const response = await fetch(process.env.API_URL || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.AWS_API_KEY || "",
      },
      body: JSON.stringify({
        message: `Get real estate data for suburb ${suburb} in ${state || "QLD"}`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AWS API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch suburb data from AWS" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("AWS response:", JSON.stringify(data, null, 2));

    // Parse the response - bedrock_invoker returns { message, sessionId, agentType }
    // The message contains the AI response text
    const aiMessage = data.message || "";

    // Try to extract structured data from the AI response
    // The location_handler returns data in a specific format, but it comes through as text
    // We need to parse it or look for the data in the response

    // For now, we'll try to parse if there's JSON in the response
    let suburbData = null;
    try {
      // Look for JSON in the response
      const jsonMatch = aiMessage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        suburbData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log("Could not parse JSON from AI response");
    }

    // If we got structured data from the lambda, save it to database
    if (suburbData && suburbData.success) {
      const savedLocation = await prisma.location_data.create({
        data: {
          state: suburbData.state || state?.toUpperCase() || "QLD",
          cityDistrict: suburbData.cityDistrict || "",
          suburbName: suburb,
          medianHousePrice: suburbData.medianHousePrice || 0,
          medianUnitPrice: suburbData.medianUnitPrice || 0,
          rentalPriceHouse: suburbData.rentalPriceHouse || 0,
          rentalPriceUnit: suburbData.rentalPriceUnit || 0,
          vacancyRate: suburbData.vacancyRate || 0,
          notes: suburbData.schools || null,
        },
      });

      return NextResponse.json({
        success: true,
        source: "aws",
        data: savedLocation,
        aiResponse: aiMessage,
      });
    }

    // If we couldn't parse structured data, just return the AI response
    return NextResponse.json({
      success: true,
      source: "aws",
      aiResponse: aiMessage,
      note: "Data received but could not parse into structured format",
    });
  } catch (error) {
    console.error("Suburb data API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
