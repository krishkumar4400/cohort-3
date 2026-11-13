/**
 * Handles the LLM node logic for the graph.
 * @param {StateSchema} state - The current state of the graph.
 * @returns {Promise<Object>} - A promise that resolves when the node processing is complete.
 */

// concat method in langchain ??

import { ChatGroq } from "@langchain/groq";
import { getApiKey } from "../utils/file.js";
import { AIMessage } from "langchain";

export async function LLMNode(state) {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: (await getApiKey()).apiKey,
  });
  const stream = await model.stream(state.messages);

  let aiMessage = "";

  process.stdout.write("[AI]: ");
  for await (const message of stream) {
    process.stdout.write(message.text);
    aiMessage += message.text;
  }
  process.stdout.write("\n");

  return {
    messages: [...state.messages, new AIMessage(aiMessage)],
  };
}
