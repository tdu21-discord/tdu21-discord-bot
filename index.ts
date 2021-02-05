import * as dotenv from "dotenv";
dotenv.config();
import { Client } from "@typeit/discord";

async function start() {
  const client = new Client({
    classes: [`${__dirname}/Bot.ts`, `${__dirname}/Bot.js`],
    silent: false,
    variablesChar: ":",
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });

  await client.login(process.env.DISCORD_BOT_TOKEN);

  process.on("SIGTERM", () => {
    console.log("session destroy...");
    client.destroy();
  });
}

start();
