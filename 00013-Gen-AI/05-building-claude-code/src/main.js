import { getApiKey, getSettingsFileContent, saveApiKey } from "./utils/file.js";
import readline from "./utils/readline.js";

async function main() {
  const settings = await getSettingsFileContent();
  //   console.log(settings);

  if (!settings.apiKey) {
    console.log("API key not found in settings.json. Please set your API key.");
    // Here you can prompt the user to enter their API key and save it to settings.json
    const apiKey = await readline.question("Enter your API key: ");
    await saveApiKey(apiKey);
  }

  const response = await getApiKey();
  if (response.error) {
    console.error(response.error);
    const apiKey = await readline.question("Enter your API key: ");
    await saveApiKey(apiKey);
    console.log("API key saved to settings.json.");
    return main(); // Restart the process to validate the new API key
  }

  const apiKey = response.apiKey;
  console.log("API key is valid:", apiKey);
  readline.close();
}

export default main;
