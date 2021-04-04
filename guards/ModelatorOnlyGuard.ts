import { GuardFunction } from "@typeit/discord";
import { MessageEmbed } from "discord.js";

const ModelatorOnly: GuardFunction<"message"> = async (
  [message],
  client,
  next
) => {
  if (message.member.roles.cache.find((role) => role.id === process.env.MODERATOR_ROLE_ID) === undefined) {
    message.channel.send({embed:
      new MessageEmbed()
        .setColor("#F24D24")
        .setTitle("このコマンドを実行する権限がありません。")
        .setDescription("このコマンドはモデレーターのみが実行可能です")}
    );
  } else {
    await next();
  }
}

export default ModelatorOnly;