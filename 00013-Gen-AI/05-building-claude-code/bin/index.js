#!/usr/bin/env node

import readline from "node:readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  console.log("\n🚀 Welcome to My AI CLI!\n");

  while (true) {
    const input = await rl.question("You: ");

    if (input.toLowerCase() === "exit") {
      console.log("Goodbye!");
      break;
    }

    console.log(`You entered: ${input}`);
  }

  rl.close();
}

main();
