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
import * as fileTools from "../tools/files.tool.js";
/**
 * fileTools is an object that contains all the file-related tools. It is used to bind the tools to the LLM model.
 * @type {Object}
 * @property {Function} upsertFilesTool - The tool for reading and writing files.
 * @property {Function} deleteFilesTool - The tool for deleting files.
 * 
 * fileTools = {
 *   upsertFilesTool: [Function: upsertFilesTool],
 *   deleteFilesTool: [Function: deleteFilesTool]
 * }
 */

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
    else aiMessage = aiMessage.concat(message.text);
    console.log(message);
  }
  process.stdout.write("\n");

  return {
    messages: [...state.messages, aiMessage ? new AIMessage(aiMessage) : null].filter(Boolean),
  };
}

/**
 * Handle the tool calls from the LLM node. This function is called when the LLM node invokes a tool.
 * @param {Object} toolCall - The tool call object containing the tool name and parameters.
 * @returns {Promise<Object>} - A promise that resolves with the tool's response.
 */
export async function ToolNode(state, config) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];
  const toolCalls = lastMessage?.tool_calls?.[0];


}