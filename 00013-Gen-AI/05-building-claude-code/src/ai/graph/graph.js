import { StateGraph, START, END } from "@langchain/langgraph";
import * as z from "zod";
import { LLMNode, ToolNode } from "./node.js";
import readline from "../../utils/readline.js";
import { HumanMessage, SystemMessage } from "langchain";

// console.log(process.cwd());

const state = z.object({
  messages: z.array(z.any()),
});

const graph = new StateGraph(state)
  .addNode("LLMNode", LLMNode)
  .addNode("ToolNode", ToolNode)
  .addEdge(START, "LLMNode")
  .addConditionalEdges(
    "LLMNode",
    (state) => {
      // Check if the last message has tool calls, if so, go to ToolNode, else end the graph.
      const lastMessage = state.messages[state.messages.length - 1];
      return lastMessage?.tool_calls?.length ? "ToolNode" : END;
    },
    ["ToolNode", "__end__"],
  )
  .addEdge("ToolNode", "LLMNode")
  .compile();

export default async function runGraph() {
  let messages = [
    new SystemMessage(
      `You are a helpful assistant and you always respond in a concise manner and the response should be under 20 words.
      - You have access to a tool called upsertFilesTool which can read and write files. Use it when necessary.
      - upsertFilesTool takes an array of files with filePath and content. If content is not provided, it reads the file.
      - You can use the tool by calling it with the appropriate parameters.
      - Always respond in a concise manner and the response should be under 20 words.
      - This is the absolute path ${process.cwd()} where you can read and write files.`,
    ),
  ];
  while (true) {
    const userInput = await readline.question(
      "Enter your message (or type 'exit' to quit): ",
    );
    if (userInput.toLowerCase() === "exit") {
      console.log("Exiting...");
      readline.close();
      process.exit(0);
    }
    messages.push(new HumanMessage(userInput));
    const response = await graph.invoke(
      { messages },
      { context: { username: "Krish" } },
    );
    console.log(
      "[AI]: ",
      response.messages[response.messages.length - 1].content,
    );
    messages = response.messages;
  }
}
