import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    console.log("sdfdsfsdfdsfsdfsdfsdfsdf");
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, customPayload } = await request.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Build the request payload
    const payload = customPayload || {
      service: null,
      tone: "professional",
      content: "",
      action: "chat",
      useSystemPrompt: true,
      systemPrompt:
        "You are a helpful AI assistant for property investment questions.",
      userPrompt: question,
      model: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    };

    console.log("Sending to AWS:", JSON.stringify(payload, null, 2));

    // Call AWS endpoint
    const response = await fetch(
      "https://tsemecn3y3.execute-api.ap-southeast-2.amazonaws.com/staging/ask-ai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.AWS_API_KEY || "",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AWS API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Received from AWS:", JSON.stringify(data, null, 2));

    // Handle response body - AWS may return data in a "body" property
    let responseData = data;
    if (data.body) {
      // Check if body is a string (needs parsing) or already an object
      responseData =
        typeof data.body === "string" ? JSON.parse(data.body) : data.body;
    }

    console.log("Processed response:", JSON.stringify(responseData, null, 2));
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
