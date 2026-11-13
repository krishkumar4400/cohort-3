import { StateGraph, START, END } from "@langchain/langgraph";
import * as z from "zod";
import { LLMNode } from "./node.js";
import readline from "../utils/readline.js";
import { HumanMessage, SystemMessage } from "langchain";

const state = z.object({
  messages: z.array(z.any()),
});

const graph = new StateGraph(state)
  .addNode("LLMNode", LLMNode)
  .addEdge(START, "LLMNode")
  .addEdge("LLMNode", END)
  .compile();

export default async function runGraph() {
  let messages = [
    new SystemMessage(
      "You are a helpful assistant and you always respond in a concise manner and the response should be under 20 words.",
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
    const response = await graph.invoke({ messages });
    messages = response.messages;
  }
}
