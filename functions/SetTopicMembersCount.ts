import { ArgsOf, On } from "@typeit/discord";
import { Client, Role } from "discord.js";
import departments from "../departments";

export abstract class OptionalChannelRole {
  @On("guildMemberUpdate")
  async onGuildMemberUpdate(
    [beforeMember, afterMember]: ArgsOf<"guildMemberUpdate">,
    client: Client
  ) {
    // 役職一覧を結合
    const roles = beforeMember.roles.cache.concat(afterMember.roles.cache);

    // 変更があったかどうか確認する
    roles.forEach((role) => {
      const hasBefore = afterMember.roles.cache.has(role.id);
      const hasAfter = beforeMember.roles.cache.has(role.id);
      if ((hasBefore || hasAfter) && !(hasBefore && hasAfter)) {
        const deps = departments.filter((dep) => dep.roleId === role.id);
        if (deps[0]) {
          const dep = deps[0];
          const channel = beforeMember.guild.channels.cache.get(dep.channelId);
          const channelNumber = channel.name.match(/^[0-9]{3,4}/)[0];
          channel.setTopic(
            `[2号館-${channelNumber}] ${dep.name} ( ${role.members.size}人 ) の人だけが見れるチャンネルです。`
          );
        }
      }
    });
  }
}
