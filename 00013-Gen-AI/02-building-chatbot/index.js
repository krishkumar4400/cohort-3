import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import rl from "readline/promises";

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/*
const userInput = await readline.question("Enter your input: ");
console.log(userInput);


const response = await model.invoke(userInput);

console.log("AI Response: ", response.text);

readline.close();
*/

// while (true) {
//   const userInput = await readline.question("Enter your input: ");

//   const response = await model.invoke(userInput);

//   console.log("AI Response: ", response.text);
// }

while (true) {
  const userInput = await readline.question("Enter your input: ");

  const response = await model.stream([
    {
      role: "user",
      content: userInput,
    },
  ]);

  for await (const chunk of response) {
    // console.log(chunk.content);
    process.stdout.write(chunk.content);
  }

  process.stdout.write("\n");

  //   console.log("AI Response: ", response.text);
}
