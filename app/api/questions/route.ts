import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PropertyQuestion } from "@prisma/client";

export async function GET() {
  try {
    const questions = await prisma.propertyQuestion.findMany({
      orderBy: { order: "asc" },
    });

    const formattedQuestions = questions.map((q: PropertyQuestion) => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : undefined,
    }));

    return NextResponse.json(formattedQuestions);
  } catch (error) {
    console.error("Questions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { question, type, options, required, order, category } =
      await request.json();

    const newQuestion = await prisma.propertyQuestion.create({
      data: {
        question,
        type,
        options: options ? JSON.stringify(options) : null,
        required,
        order,
        category,
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("Create question error:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
