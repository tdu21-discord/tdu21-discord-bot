import * as dotenv from "dotenv";
dotenv.config();

import { Client } from "@typeit/discord";
import { logger } from "./utils/logger";

async function start() {
  const client = new Client({
    classes: [`${__dirname}/Bot.ts`, `${__dirname}/Bot.js`],
    silent: false,
    variablesChar: ":",
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });

  await client.login(process.env.DISCORD_BOT_TOKEN);

  logger.info("Welcome to TDU21-Discord Bot...");

  process.on("SIGTERM", () => {
    logger.info("Bye, shutdown TDU21-Discord Bot...");
    client.destroy();
  });
}

start();
