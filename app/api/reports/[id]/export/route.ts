import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const report = await prisma.report.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    // TODO: Implement Google Docs export functionality
    // This would involve:
    // 1. Initialize Google Docs API client
    // 2. Create a new Google Doc
    // 3. Add content from report
    // 4. Share with user
    // 5. Return the Google Doc URL

    // For now, return a placeholder response
    return NextResponse.json({
      googleDocUrl: "https://docs.google.com/document/d/example",
      message: "Google Docs export feature coming soon",
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export report" },
      { status: 500 }
    );
  }
}
