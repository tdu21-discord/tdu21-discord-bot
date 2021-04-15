import { Command, CommandMessage, Guard } from "@typeit/discord";
import ModelatorOnly from "../guards/ModelatorOnlyGuard";
import ServerMessageOnly from "../guards/ServerMessageOnlyGuard";
import AllMemberReset from "./scripts/AllMemberReset";

export abstract class ScriptCommand {
  @Command("script :name")
  @Guard(
    ServerMessageOnly,
    ModelatorOnly
  )
  async onScriptCommand(message: CommandMessage) {
    const scriptName: string = message.args.name
    switch (scriptName) {
      case "allmemberreset":
        AllMemberReset(message);
        message.react("✅")
        break;
    }
  }
}
