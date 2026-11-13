import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import * as z from "zod";
import { LLMNode } from "./node.js";
import readline from "../utils/readline.js";
import { HumanMessage } from "langchain";


const state = z.object({
  messages: z.array(z.any()),
});

const graph = new StateGraph(state)
  .addNode("LLMNode", LLMNode)
  .addEdge(START, "LLMNode")
  .addEdge("LLMNode", END)
  .compile();

export default async function runGraph() {
  while (true) {
    const userInput = await readline.question(
      "Enter your message (or type 'exit' to quit): ",
    );
    if (userInput.toLowerCase() === "exit") {
      console.log("Exiting...");
      readline.close();
      process.exit(0);
    }
    const response = await graph.invoke({
      messages: [new HumanMessage(userInput)],
    });
    console.log(
      "Response:",
      response.messages[response.messages.length - 1].content,
    );
  }
}
