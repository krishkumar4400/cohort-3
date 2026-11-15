import { tool } from "langchain";
import * as z from "zod";
import fs from "fs/promises";

/**
 * Tool for reading and writing files (create/update multiple files at once and create one if not existed).
 * @param {Object} input - The input object containing action, filePath, and content.
 * @param {string} input.action - The action to perform: "read" or "write".
 */

export const upsertFilesTool = tool(
  async function ({ files }) {
    await Promise.all(
      files.map(async ({ filePath, content }) => {
        if (content !== undefined) {
          // Write content to the file (create or update)
          await fs.writeFile(filePath, content, "utf-8");
        } else {
          // Read content from the file
          const fileContent = await fs.readFile(filePath, "utf-8");
          console.log(`Content of ${filePath}:`, fileContent);
        }
      }),
    );

    return { message: "Files processed successfully." };
  },
  {
    name: "upsertFilesTool",
    description:
      "Tool for reading and writing files (create/update multiple files at once and create one if not existed).",
    schema: z.object({
      files: z
        .array(
          z.object({
            filePath: z
              .string()
              .describe(
                "The absolute path of the file to be created or updated.",
              ),
            content: z
              .string()
              .optional()
              .describe(
                "The content to write to the file. If not provided, the tool will read the file.",
              ),
          }),
        )
        .describe("An array of files to read or write."),
    }),
  },
);

export const deleteFilesTool = tool(
  async function ({ filePaths }) {
    await Promise.all(
      filePaths.map(async (filePath) => {
        await fs.unlink(filePath);
      }),
    );
    return { message: "Files deleted successfully." };
  },
  {
    name: "deleteFilesTool",
    description: "Tool for deleting files.",
    schema: z.object({
      filePaths: z
        .array(z.string())
        .describe("An array of absolute paths of the files to be deleted."),
    }),
  },
);

/**
 * list all the folder (recursive) and files in the current directory and return the list of files and folders in a JSON format.(ignore folders like node_modules and .env)
 */
export const listFilesTool = tool(
  async function ({ folder }) {
    const results = [];
    async function traverse(currentFolder) {
      const entries = await fs.readdir(currentFolder, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = `${currentFolder}/${entry.name}`;
        if (entry.isDirectory()) {
          if (entry.name === "node_modules") continue;
          await traverse(fullPath);
        } else {
          results.push(fullPath);
        }
      }
    }
    await traverse(folder);
    return JSON.stringify(results);
  },
  {
    name: "listFilesTool",
    description:
      "List all the folder (recursively) and files in the current folder (ignore folders like node_modules)",
    schema: z.object({
      folder: z.string().describe("absolute path of the folder to list"),
    }),
  },
);

/**
 * Read files tool for reading the content of multiple files at once.
 * @param {Object} input - The input object containing filePaths.
 * @param {string[]} input.filePaths - An array of absolute paths of the files to be read.
 * @returns {Promise<Object>} - A promise that resolves with an object containing the file contents.
 */

export const readFilesTool = tool(
  async function ({ filePaths }) {
    const fileContents = await Promise.all(
      filePaths.map(async (filePath) => {
        const content = await fs.readFile(filePath, "utf-8");
        return { filePath, content };
      }),
    );
    return JSON.stringify(fileContents, null, 2);
  },
  {
    name: "readFilesTool",
    description: "Tool for reading the content of multiple files at once.",
    schema: z.object({
      filePaths: z
        .array(z.string())
        .describe("An array of absolute paths of the files to be read."),
    }),
  },
);
