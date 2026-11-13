import path from "path";
import { CONFIG_DIR, HOME_DIR } from "./constants.js";
import fs from "fs/promises";
import axios from "axios";

// this function returns the settings.json file content otherwise creates a new settings.json file and returns the empty object
export async function getSettingsFileContent() {
  try {
    // ensure the config directory exists
    await fs.access(CONFIG_DIR);
  } catch (error) {
    // If the file doesn't exist or there's an error reading it, return an empty object
    await fs.mkdir(CONFIG_DIR, { recursive: true });
    return {};
  }

  const settingsFilePath = path.join(CONFIG_DIR, "settings.json");
  try {
    const data = await fs.readFile(settingsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    await fs.writeFile(settingsFilePath, JSON.stringify({}), "utf-8");
    return {};
  }
}

// save api key to the settings.js file
export async function saveApiKey(apiKey) {
  const settingsFilePath = path.join(CONFIG_DIR, "settings.json");
  let settingsContent = await getSettingsFileContent();

  await fs.writeFile(
    settingsFilePath,
    JSON.stringify({ ...settingsContent, apiKey }),
    "utf-8",
  );
}

// get api key from the settings.js file
export async function getApiKey() {
  const settings = await getSettingsFileContent();
  const apiKey = settings.apiKey || null;
  if (!apiKey) {
    return {
      error: "API key not found in settings.json. Please set your API key.",
      message: "API key not found in settings.json. Please set your API key.",
    };
  }

  try {
    const { data } = await axios.get("https://api.groq.com/openai/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return { apiKey };
  } catch (error) {
    return {
      error: "Failed to validate API key.",
      message: "Failed to validate API key.",
    };
  }
}
