import { Command, CommandMessage } from "@typeit/discord";

export abstract class PingCommand {
  @Command("ping")
  async onPingCommand(message: CommandMessage) {
    message.react("✌");
    message.channel.send("Hello World!");
  }
}
