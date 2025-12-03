import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { canCreateReport } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { canCreateReport: false },
        { status: 200 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { canCreateReport: false },
        { status: 200 }
      );
    }

    const canCreate = await canCreateReport(user.id);

    return NextResponse.json({ canCreateReport: canCreate });
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json(
      { canCreateReport: false },
      { status: 200 }
    );
  }
}
