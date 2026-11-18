import { McpServer } from "@modelcontextprotocol/server";
import z from "zod";
import {StdioServerTransport } from "@modelcontextprotocol/server/stdio";

const EVENTS = [];

// ------ MCP Server ------
const server = new McpServer({ name: "calender-server", version: "1.0.0" });

server.registerTool(
  "create_event",
  {
    description: "Create a new calendar event",
    inputSchema: z.object({
      title: z.string().describe("Title of the event"),
      start: z.string().describe("Start time of the event"),
      end: z.string().describe("End time of the Event"),
    }),
  },
  async ({ title, start, end }) => {
    const event = { title, start, end };
    EVENTS.push(event);
    return {
      content: [
        {
          type: "text",
          text: `Created ${event.id}: ${title} from ${start} to ${end}`,
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
