import { Command, CommandMessage } from "@typeit/discord";
import { MessageEmbed, TextChannel } from "discord.js";
import posts from "../config/posts";

export abstract class ExtendMessageCommand {
  @Command("extend :targetChannel :messageKey")
  async onExtendMessageCommand(message: CommandMessage) {
    if (
      message.guild.members.cache
        .find((user) => user.id === message.author.id)
        .roles.cache.find((role) => role.id === "796375044334419969") ===
      undefined
    )
      return;

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
