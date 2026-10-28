import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import rl from "readline";

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
});

// const response = await model.invoke("Hey, How are you ?");
// console.log(response.content);


const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = await readline.question("Enter your input: ");
console.log(input);
readline.close();

while(true) {

}