import { ArgsOf, On, Client } from "@typeit/discord";
import * as emojiUnicode from "emoji-unicode";
import { MessageReaction, ReactionEmoji, Role } from "discord.js";
import { logger } from "../utils/logger";
import config from "../config";

export abstract class OptionalChannelRole {
  @On("messageReactionAdd")
  async onMessageReactionAdd(
    [reaction, preUser]: ArgsOf<"messageReactionAdd">,
    client: Client
  ) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (err) {
        logger.error("データ取得に失敗しました");
        return;
      }
    }
    const user = await preUser.fetch();
    const member = reaction.message.guild.member(user);

    // Bot ではないかどうか
    if (user.bot) return;

    const roles = await getTargetRoles(reaction)
    await member.roles.add(roles)
  }

  @On("messageReactionRemove")
  async onMessageReactionRemove(
    [reaction, preUser]: ArgsOf<"messageReactionAdd">,
    client: Client
  ) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (err) {
        logger.error("データ取得に失敗しました");
        return;
      }
    }
    const user = await preUser.fetch();
    const member = reaction.message.guild.member(user);

    // Bot ではないかどうか
    if (user.bot) return;

    const roles = await getTargetRoles(reaction)
    await member.roles.remove(roles)
  }
}

const getTargetRoles = async (reaction: MessageReaction): Promise<Role[]> => {

  let emojiId: string;
  if (reaction.emoji.id) {
    emojiId = reaction.emoji.id;
  } else {
    emojiId = emojiUnicode(reaction.emoji.name).toUpperCase();
  }

  const roles: Role[] = [];

  for (let mesReactRole of config.messageReactionRoles){
    if (mesReactRole.emojiId === emojiId && mesReactRole.messageId === reaction.message.id) {
      roles.push(await reaction.message.guild.roles.fetch(mesReactRole.roleId))
    }
  }

  for (let chReactRole of config.channelReactionRoles){
    if (chReactRole.emojiId === emojiId && chReactRole.channelId === reaction.message.channel.id) {
      roles.push(await reaction.message.guild.roles.fetch(chReactRole.roleId))
    }
  }

  return roles
}