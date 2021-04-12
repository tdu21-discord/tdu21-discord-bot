import { Command, CommandMessage, Guard } from "@typeit/discord";
import ModelatorOnly from "../guards/ModelatorOnlyGuard";
import ServerMessageOnly from "../guards/ServerMessageOnlyGuard";
import RemoveEveryonesDepRole from "./scripts/RemoveEveryonesDepRole";
import SendDirectMessageEveryone from "./scripts/SendDirectMessageEveryone";

export abstract class ScriptCommand {
  @Command("script :name")
  @Guard(
    ServerMessageOnly,
    ModelatorOnly
  )
  async onScriptCommand(message: CommandMessage) {
    const scriptName: string = message.args.name
    if (process.env.ENV !== "development") {
      message.reply('このBotでは利用できません')
      return;
    }
    // クソ実装かもしれないけどごめんね
    switch (scriptName) {
      case "sendeveryone":
        SendDirectMessageEveryone(message);
        message.react("✅")
        break;
      case "removeroles":
        RemoveEveryonesDepRole(message);
        message.react("✅")
        break;
    }
  }
}
