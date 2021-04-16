import { Command, CommandMessage, Guard } from "@typeit/discord";
import ServerMessageOnly from "../guards/ServerMessageOnlyGuard";

export abstract class PingCommand {
  @Command("ping")
  @Guard(ServerMessageOnly)
  async onPingCommand(message: CommandMessage) {
    message.react("✌");
    message.channel.send("Hello World!");
  }
}
