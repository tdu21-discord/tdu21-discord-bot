import * as dotenv from "dotenv";
dotenv.config();
import { Client } from "@typeit/discord";
import * as express from 'express'
import { TextChannel } from "discord.js";
const app: express.Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

async function start() {
  const client = new Client({
    classes: [`${__dirname}/Bot.ts`, `${__dirname}/Bot.js`],
    silent: false,
    variablesChar: ":",
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });

  await client.login(process.env.DISCORD_BOT_TOKEN);

  app.listen(3000, () => {
    console.log("Webhookサーバー起動")
  })

  app.get('/webhook', async (req, res) => {
    const guild = client.guilds.cache.find((guild) => guild.id === "796374774158065674")
    console.log(guild)
    const channel = guild.channels.cache.find((ch) => ch.id === "797070664988491807") as TextChannel
    console.log(channel)
    await channel.send("テスト")
    res.end();
  })

  process.on("SIGTERM", () => {
    console.log("session destroy...");
    client.destroy();
  });
}

start();
