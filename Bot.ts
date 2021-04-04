import {
  Discord,
  Once,
  Client,
  ArgsOf,
  CommandNotFound,
  CommandMessage,
} from "@typeit/discord";
import { MessageEmbed } from "discord.js";
import * as Path from "path";

@Discord("!", {
  import: [
    Path.join(__dirname, "commands", "*.ts"),
    Path.join(__dirname, "functions", "*.ts")
  ],
})
export class Bot {
  @Once("ready")
  onReady(event: ArgsOf<"ready">, client: Client): void {
    console.info("Welcome to TDU21-Discord Bot...");
    client.user.setPresence({
      activity: {
        name: "キャンパス建築中...",
      },
    });
  }

  @CommandNotFound()
  onCommandNotFound(message: CommandMessage): void {
    message.channel.send({embed:
        new MessageEmbed()
          .setColor("#F24024")
          .setTitle("コマンドが見つかりませんでした")
          .setDescription("入力内容を確認してください")}
    );
  }
}