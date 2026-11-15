/**
 * Handles the LLM node logic for the graph.
 * @param {StateSchema} state - The current state of the graph.
 * @returns {Promise<Object>} - A promise that resolves when the node processing is complete.
 */

// concat method in langchain ??

import { ChatGroq } from "@langchain/groq";
import { getApiKey } from "../../utils/file.js";
import { AIMessage, ToolMessage } from "langchain";
import {
  upsertFilesTool,
  readFilesTool,
  listFilesTool,
} from "../tools/files.tool.js";
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
  // console.log(config);
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: (await getApiKey()).apiKey,
  });

  const modelWithTool = model.bindTools([
    upsertFilesTool,
    readFilesTool,
    listFilesTool,
  ]);

  // const stream = await modelWithTool.stream(state.messages);

  // let aiMessage = null;

  // process.stdout.write("[AI]: ");
  // for await (const message of stream) {
  //   process.stdout.write(message.text);
  //   if (!aiMessage) aiMessage = message.text;
  //   else aiMessage = aiMessage.concat(message.text);
  //   // console.log(message);
  // }
  // process.stdout.write("\n");

  // return {
  //   messages: [...state.messages, aiMessage ? new AIMessage(aiMessage) : null].filter(Boolean),
  // };

  // const stream = await modelWithTool.stream(state.messages);

  // let chunks = [];

  // for await (const chunk of stream) {
  //   console.log("\nSTREAM CHUNK:", chunk);
  //   chunks.push(chunk);
  // }

  // const fullMessage = AIMessage.concat(chunks);

  // console.log("\nFULL MESSAGE:", fullMessage);
  // console.log("\nTOOL CALLS:", fullMessage.tool_calls);

  // return {
  //   messages: [...state.messages, fullMessage],
  // };

  const response = await modelWithTool.invoke(state.messages);

  // console.log("\n========== RAW AI RESPONSE ==========");
  // console.dir(response, { depth: null });

  // console.log("\n========== TOOL CALLS ==========");
  // console.dir(response.tool_calls, { depth: null });

  return {
    messages: [...state.messages, response],
  };
}

/**
 * Handle the tool calls from the LLM node. This function is called when the LLM node invokes a tool.
 * @param {Object} toolCall - The tool call object containing the tool name and parameters.
 * @returns {Promise<Object>} - A promise that resolves with the tool's response.
 */

/**
 * toolCalls = [
 *  {
 *    name: "toolName",
 *    args: { files: [
 *                      {
 *        path1: "path/to/file1",
 *        content1: "file content 1"
 *            },
 *        ]
 *      },
 * id: "234tghji9ik",
 * type: "toolCall"
 *  }
 * ]
 *
 *
 */
export async function ToolNode(state, config) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];

  const toolCalls = lastMessage?.tool_calls ?? [];

  const toolResults = await Promise.all(
    toolCalls.map(async (toolCall) => {
      console.log("Executing tool:", toolCall.name);

      const selectedTool = fileTools[toolCall.name];

      if (!selectedTool) {
        throw new Error(`Tool not found: ${toolCall.name}`);
      }

      const result = await selectedTool.invoke(toolCall.args);

      console.log("Tool result:", result);

      return new ToolMessage({
        content: JSON.stringify(result),
        tool_call_id: toolCall.id,
      });
    }),
  );

  return {
    messages: [...state.messages, ...toolResults],
  };
}
