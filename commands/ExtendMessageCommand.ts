
import { Command, CommandMessage, Guard } from "@typeit/discord";
import { MessageEmbed, TextChannel } from "discord.js";
import posts from "../config/posts";
import ModelatorOnly from "../guards/ModelatorOnlyGuard";
import ServerMessageOnly from "../guards/ServerMessageOnlyGuard";

export abstract class ExtendMessageCommand {

  @Command("extend :targetChannel :messageKey")
  // Guard は同期処理なので、かならず ModelatorOnly よりも先に ServerMessageOnly が処理されるようにする
  @Guard(
    ServerMessageOnly,
    ModelatorOnly
  )
  async onExtendMessageCommand(message: CommandMessage) {

    message.react("👀");

    if (!message.args.targetChannel || !message.args.messageKey) {
      message.channel.send({embed:
        new MessageEmbed()
          .setColor("#F24D24")
          .setTitle("引数おかしいよ？？？？？？")}
      );

      return;
    }

    const channelId = message.args.targetChannel.replace(/[^0-9]/g, "");
    const channel = message.guild.channels.cache.get(channelId) as TextChannel;

    if (!channel) {
      message.channel.send({embed:
        new MessageEmbed()
          .setColor("#F24D24")
          .setTitle("チャンネルねえよ？？？？？？")}
      );

      return;
    }

    const messageDatum = posts.find(
      (post) => post.name === message.args.messageKey
    );

    if (!messageDatum) {
      message.channel.send({embed:
        new MessageEmbed()
          .setColor("#F24D24")
          .setTitle("メッセージがねえよ？？？？？？")}
      );

      return;
    }

    for (let post of messageDatum.contents) {
      const getSendObject = (body: string | MessageEmbed) =>
        body instanceof MessageEmbed ? { embed: body }
        : body;
      const messageResponse = await channel.send(getSendObject(post.body));
      if (post.reactions) {
        for (let reactionId of post.reactions) {
          await messageResponse.react(reactionId);
        }
      }
    }

    await message.reactions.removeAll();

    message.react("✅");
  }
}
