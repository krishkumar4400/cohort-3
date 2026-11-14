/**
 * Handles the LLM node logic for the graph.
 * @param {StateSchema} state - The current state of the graph.
 * @returns {Promise<Object>} - A promise that resolves when the node processing is complete.
 */

// concat method in langchain ??

import { ChatGroq } from "@langchain/groq";
import { getApiKey } from "../../utils/file.js";
import { AIMessage } from "langchain";
import { upsertFilesTool } from "../tools/files.tool.js";

export async function LLMNode(state, config) {
  console.log(config);
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: (await getApiKey()).apiKey,
  });

  const modelWithTool = model.bindTools([upsertFilesTool]);

  const stream = await modelWithTool.stream(state.messages);

  let aiMessage = null;

  process.stdout.write("[AI]: ");
  for await (const message of stream) {
    process.stdout.write(message.text);
    if (!aiMessage) aiMessage = message.text;
    else aiMessage += message.text;
    console.log(message);
  }
  process.stdout.write("\n");

  return {
    messages: [...state.messages, aiMessage ? new AIMessage(aiMessage) : null].filter(Boolean),
  };
}
