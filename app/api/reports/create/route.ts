import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { canCreateReport } from "@/lib/stripe";

export async function POST(request: NextRequest) {
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

    // Check if user can create report
    const canCreate = await canCreateReport(user.id);
    if (!canCreate) {
      return NextResponse.json(
        { error: "Subscription expired or trial ended. Please upgrade to Pro." },
        { status: 403 }
      );
    }

    const { answers } = await request.json();

    // Create report
    const report = await prisma.report.create({
      data: {
        userId: user.id,
        title: "Property Investment Analysis",
        status: "draft",
      },
    });

    // Store answers
    const answerPromises = Object.entries(answers).map(([questionId, answer]) =>
      prisma.propertyAnswer.create({
        data: {
          reportId: report.id,
          questionId,
          answer: String(answer),
        },
      })
    );

    await Promise.all(answerPromises);

    // TODO: Call AI service to generate analysis
    // For now, we'll set a placeholder analysis
    await prisma.report.update({
      where: { id: report.id },
      data: {
        summary: "Analysis pending...",
        status: "draft",
      },
    });

    return NextResponse.json({
      reportId: report.id,
      message: "Report created successfully",
    });
  } catch (error) {
    console.error("Create report error:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
