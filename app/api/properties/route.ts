import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get user session
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch properties (or reports with property data)
    // Adjust based on your actual data structure
    // This is a placeholder - modify according to your Prisma schema
    const properties = await prisma.report.findMany({
      where: {
        userId: user.id,
        status: { not: "archived" },
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        // Add these fields if they exist in your schema
        // address: true,
        // price: true,
        // latitude: true,
        // longitude: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform to include default coordinates if not present
    // Modify this based on your actual data structure
    const transformedProperties = properties.map((prop) => ({
      id: prop.id,
      title: prop.title,
      address: prop.title || "Property",
      price: 0,
      latitude: 0,
      longitude: 0,
      status: prop.status as "draft" | "completed" | "archived",
      createdAt: prop.createdAt,
    }));

    return NextResponse.json(transformedProperties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
