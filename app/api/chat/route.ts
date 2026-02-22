import { NextRequest, NextResponse } from "next/server";
import { createGeminiService } from "@/lib/gemini";
import type { ChatMessage } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequestBody {
  message: string;
  history: ChatMessage[];
  repoContext?: {
    summary: string;
    techStack: string[];
    architecture: string;
  } | null;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key");
    
    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }

    const body: ChatRequestBody = await request.json();
    const { message, history, repoContext } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const model = request.headers.get("x-model") || "gemini-1.5-flash";
    const gemini = createGeminiService(apiKey, model);

    let context = "";
    if (repoContext) {
      context = `
Repository: ${repoContext.summary}

Tech Stack: ${repoContext.techStack.join(", ")}

Architecture: ${repoContext.architecture}

Please use this context to answer questions about the codebase.
`;
    }

    const messagesForGemini = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const stream = gemini.streamChat(messagesForGemini, context);
          
          for await (const chunk of stream) {
            const data = JSON.stringify({ content: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Chat request failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "Chat API is running. Use POST to send messages." 
  });
}
