/**
 * Tools are a way to extend the capabilities of an agent. They allow the agent to interact with external systems, such as APIs or databases, to perform tasks that it cannot do on its own. In this example, we will create a simple calendar tool that allows the agent to create events in a calendar.
 *
 * - We will create a Groq model that uses the OpenAI GPT-OSS-120B model.
 * - We will create a readline interface to read input from the command line.
 * - We will create a calendar tool that allows the agent to create events in a calendar.
 *
 * Agent: An agent is an entity that can perform tasks on behalf of a user. In this example, the agent will be able to create events in a calendar using the calendar tool. The agent will be able to understand natural language input and extract the necessary information to create an event, such as the date, title, and description.
 *
 *
 * agent will be able to use the calendar tool to create events in a calendar. The agent will be able to understand natural language input and extract the necessary information to create an event, such as the date, title, and description.
 *
 * Agents can use tools to perform tasks that they cannot do on their own. In this example, the agent will be able to create events in a calendar using the calendar tool. The agent will be able to understand natural language input and extract the necessary information to create an event, such as the date, title, and description.
 *
 * Agents can use tools to perform tasks that they cannot do on their own. In this example, the agent will be able to create events in a calendar using the calendar tool. The agent will be able to understand natural language input and extract the necessary information to create an event, such as the date, title, and description.
 *
 * why zod: Zod is a TypeScript-first schema declaration and validation library. It allows you to define schemas for your data and validate that data against those schemas. In this example, we will use Zod to define the schema for the calendar tool, which will ensure that the agent provides the necessary information to create an event, such as the date, title, and description.
 */

import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import rl from "readline/promises";
import { tool, createAgent } from "langchain";
import * as z from "zod";

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

// Create an agent that uses the calendar tool
const agent = createAgent({
  model,
  tools: [calendarTool, readEventsTool],
});

// invoke the agent with a prompt and return the response
while (true) {
  const prompt = await readline.question("Enter a prompt: ");
  const response = await agent.invoke({
    messages: [{ role: "user", content: prompt }],
  });
  console.log(response.messages[response.messages.length - 1].content);
}
