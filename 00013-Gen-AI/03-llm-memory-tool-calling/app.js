/**
 * LLM Memory
 * - We will create a Groq model that uses the OpenAI GPT-OSS-120B model.
 * - We will create a readline interface to read input from the command line.
 * - We will create a simple memory tool that allows the agent to remember information.
 *
 *
 */

import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import rl from "readline/promises";

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
});

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages = [];

while (true) {
  const userInput = await readline.question("Enter your question: ");

  messages.push({
    role: "user",
    content: userInput,
  });

  const response = await model.stream(messages);

  let aiResponse = "";

  for await (const chunk of response) {
    aiResponse += chunk.content;
    process.stdout.write(chunk.content);
  }
  process.stdout.write("\n");

  messages.push({
    role: "assistant",
    content: aiResponse,
  });
}
