import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, parentId } = await request.json();

    // Validate input
    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Invalid email or password (min 8 characters)" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Verify parent exists if parentId provided
    if (parentId) {
      const parentUser = await prisma.user.findUnique({
        where: { id: parentId },
      });
      if (!parentUser) {
        return NextResponse.json(
          { error: "Parent user not found" },
          { status: 400 }
        );
      }
    }

    // Create user
    const user = await createUser(email, password, name, parentId);

    // Create subscription with free trial
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: "free",
        status: "active",
        trialEndDate,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
