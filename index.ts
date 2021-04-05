import * as dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";

import { Client } from "@typeit/discord";
import { logger } from "./utils/logger";
import { connectDatabase } from "./utils/database";
import { getConnection } from "typeorm";

async function start() {
  const client = new Client({
    classes: [`${__dirname}/Bot.ts`, `${__dirname}/Bot.js`],
    silent: false,
    variablesChar: ":",
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });

  console.info("Try login discord...");
  await client.login(process.env.DISCORD_BOT_TOKEN);

  try {
    console.info("Try connectoin database...");
    await connectDatabase();
  } catch (error) {
    console.error("Database connectoin error...");
    process.exit();
  }

  logger.info("Welcome to TDU21-Discord Bot...");

  process.on("SIGINT", async () => {
    logger.info("Shutdown TDU21-Discord Bot...");

    await getConnection().close();
    logger.info("Close database connectoin...");

    client.destroy();
  });
}

start();
