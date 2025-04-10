// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { getChatResponse, ChatMessage, SYSTEM_PROMPT as defaultSystemPrompt } from "@/lib/gemini";
import { Content } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { messages } = body;

    // Validate request body
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Ensure each message has a role and content
    if (!messages.every((msg: ChatMessage) => msg.role && msg.content)) {
      return NextResponse.json(
        { error: "Each message must have 'role' and 'content'" },
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Add timestamps if missing
    const chatMessages: ChatMessage[] = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp || new Date()
    }));

    // Prepare messages for Gemini API
    const geminiMessages: Content[] = [];
    const systemMessage = chatMessages.find(msg => msg.role === "system");
    if (systemMessage) {
      geminiMessages.push({ role: "system", parts: [{ text: systemMessage.content }] });
    } else {
      geminiMessages.push(defaultSystemPrompt);
    }
    geminiMessages.push(...chatMessages.filter(msg => msg.role !== "system").map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    })));

    // console.log("Sending messages to Gemini:", JSON.stringify(geminiMessages, null, 2));

    // Get response from Gemini
    const response = await getChatResponse(apiKey, chatMessages);

    // Return the AI response
    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Error in chat API route:", error);

    // Log detailed error information
    if (error.response) {
      console.error("API Error Details:", error.response.data);
    }

    console.error("Error stack:", error.stack || error);

    return NextResponse.json(
      { error: "Failed to get response from assistant", details: error.message },
      { status: 500 }
    );
  }
}