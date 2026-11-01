/**
 * CLI Agent
 */

import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import rl from "readline/promises";
import { tool, createAgent } from "langchain";
import * as z from "zod";
import { StateGraph, StateSchema, START, END } from "@langchain/langgraph";

// Create a Groq model that uses the OpenAI GPT-OSS-120B model
const model = new ChatGroq({
  model: "openai/gpt-oss-20b",
  apiKey: process.env.GROQ_API_KEY,
});

// Create a readline interface to read input from the command line
const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a function that prompts the user for input and returns the input
const events = [];

// Create a calendar tool that allows the agent to create events in a calendar
const calendarTool = tool(
  async function ({ date, title, description }) {
    events.push({
      date,
      title,
      description,
    });
    return "Event created";
  },
  {
    name: "create_event",
    description:
      "creates an event in the calendar with a date, title, and description",
    schema: z.object({
      date: z.string().describe("The date of the event"),
      title: z.string().describe("The title of the event"),
      description: z.string().describe("The description of the event"),
    }),
  },
);

// Tool to read all the events in the calendar
const readEventsTool = tool(
  async function ({}) {
    return events;
  },
  {
    name: "read_events",
    description: "reads all the events in the calendar",
    schema: z.object({}),
  },
);

// node
async function LLMNode(state) {
  console.log("LLM Node state: ", state);
  return {
    messages: [
      ...state.messages,
      {
        role: "assistant",
        content: "Hello, user",
      },
    ],
  };
}

const graph = new StateGraph(
  z.object({
    messages: z.array(
      z.object({
        role: z.string(),
        content: z.string(),
      }),
    ),
  }),
)
  .addNode("llm_node", LLMNode)
  .addEdge(START, "llm_node")
  .addEdge("llm_node", END)
  .compile();

const result = await graph.invoke({
  messages: [
    {
      role: "user",
      content: "Hello",
    },
  ],
});

console.log(result);
