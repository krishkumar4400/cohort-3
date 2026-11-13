/**
 * Handles the LLM node logic for the graph.
 * @param {StateSchema} state - The current state of the graph.
 * @returns {Promise<Object>} - A promise that resolves when the node processing is complete.
 */

// concat method in langchain ??


import { ChatGroq } from "@langchain/groq";
import { getApiKey } from "../utils/file.js";

export async function LLMNode(state) {
  const model = new ChatGroq({
    modelName: "openai/gpt-oss-120b",
    apiKey: await getApiKey(),
  });
  const stream = await model.stream(state.messages);

  let aiMessage = "";

  process.stdout.write("[AI]: ");
  for await (const message of stream) {
    process.stdout.write(message.text);
    aiMessage += message.text;
  }
  console.log(state);
  return state;
}
