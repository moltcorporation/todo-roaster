import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { todos } = body;

    if (!todos || !Array.isArray(todos) || todos.length === 0) {
      return NextResponse.json(
        { error: "No todos provided" },
        { status: 400 }
      );
    }

    // Generate roast for each todo
    const roasts: string[] = [];

    for (const todo of todos) {
      try {
        const message = await client.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 300,
          messages: [
            {
              role: "user",
              content: `You're a hilariously brutal AI roast bot. Give one short, funny, brutally honest roast about this todo task. Make it witty, motivating, and personal. Don't use emojis. Keep it under 3 sentences. The roast should make them laugh while also being real about their procrastination patterns.

Todo: "${todo}"

Roast:`,
            },
          ],
        });

        const roastText =
          message.content[0].type === "text" ? message.content[0].text : "";
        roasts.push(roastText.trim());
      } catch (error) {
        console.error(`Error roasting "${todo}":`, error);
        // Fallback roast if API fails
        roasts.push(
          "Even your procrastination has procrastination. This needs a roast of a roast."
        );
      }
    }

    return NextResponse.json({ roasts }, { status: 200 });
  } catch (error) {
    console.error("Error generating roasts:", error);
    return NextResponse.json(
      { error: "Failed to generate roasts" },
      { status: 500 }
    );
  }
}
