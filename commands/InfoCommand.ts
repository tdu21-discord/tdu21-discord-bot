import { Command, CommandMessage, Guard } from "@typeit/discord";
import { MessageEmbed, GuildMember } from "discord.js";
import ModelatorOnly from "../guards/ModelatorOnlyGuard";

export abstract class InfoCommand {
  @Command("info :username")
  @Guard(ModelatorOnly)
  async onInfoCommand(message: CommandMessage) {
    message.react("👀");

    const guildMembers = await message.guild.members.fetch({
      query: message.args.username,
      limit: 1,
    });

    const guildMember: GuildMember = guildMembers.first();

    if (!guildMember) {
      message.channel.send({embed:
        new MessageEmbed()
          .setColor("#F24D24")
          .setTitle("ユーザーが見つかりませんでした")}
      );

      return;
    }

    message.channel.send({embed:
      new MessageEmbed()
        .setColor("#249FF2")
        .setTitle(`${guildMember.displayName} さんのプロフィール`)
        .setImage(guildMember.user.avatarURL())}
    );
  }
}
