"use server";

import { Anthropic } from "@anthropic-ai/sdk";

export async function streamMessage(msg: string) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error("Anthropic API key not found");
    }

    const anthropic = new Anthropic({
      apiKey,
    });

    if (!msg) {
      throw new Error("Message is required");
    }

    const stream = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [{ role: "user", content: msg }],
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        fullResponse += chunk.delta.text;
      }
    }
    return fullResponse;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error processing your request");
  }
}
