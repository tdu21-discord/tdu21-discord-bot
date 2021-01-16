import { ArgsOf, On, Client } from "@typeit/discord";
import * as optRoles from "../config/optionalChannels.json";
import * as emojiUnicode from "emoji-unicode";
import { ReactionEmoji } from "discord.js";

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
        console.error("データ取得に失敗しました");
        return;
      }
    }
    const user = await preUser.fetch();
    const member = reaction.message.guild.member(user);

    // Bot ではないかどうか
    if (user.bot) return;

    // 対象のチャンネルを検索
    const targetChannel = optRoles[reaction.message.channel.id];
    if (targetChannel === undefined) return;

    // 対象のメッセージIDを検索
    const targets = targetChannel.targetMessages.filter(
      (message) => message.messageId
    );
    if (targets.length === 0) return;

    // 絵文字をUnicodeに変換
    let emojiId;
    if (reaction.emoji instanceof ReactionEmoji) {
      // 固有絵文字の場合は U+[ID](UpperCase)
      emojiId = emojiUnicode(reaction.emoji.name).toUpperCase();
    } else {
      // サーバー絵文字の場合は 内部ID
      emojiId = reaction.emoji.id;
    }

    // 対象の絵文字を検索し、ロールを付与する
    for (let target of targets) {
      if (target.emojiId === emojiId) {
        member.roles.add(
          await reaction.message.guild.roles.fetch(target.roleId)
        );
      }
    }
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
        console.error("データ取得に失敗しました");
        return;
      }
    }
    const user = await preUser.fetch();
    const member = reaction.message.guild.member(user);

    // Bot ではないかどうか
    if (user.bot) return;

    // 対象のチャンネルを検索
    const targetChannel = optRoles[reaction.message.channel.id];
    if (targetChannel === undefined) return;

    // 対象のメッセージIDを検索
    const targets = targetChannel.targetMessages.filter(
      (message) => message.messageId
    );
    if (targets.length === 0) return;

    // 絵文字をUnicodeに変換
    let emojiId;
    if (reaction.emoji instanceof ReactionEmoji) {
      // 固有絵文字の場合は U+[ID](UpperCase)
      emojiId = emojiUnicode(reaction.emoji.name).toUpperCase();
    } else {
      // サーバー絵文字の場合は 内部ID
      emojiId = reaction.emoji.id;
    }

    // 対象の絵文字を検索し、ロールを除去する
    for (let target of targets) {
      if (target.emojiId === emojiId) {
        member.roles.remove(
          await reaction.message.guild.roles.fetch(target.roleId)
        );
      }
    }
  }
}
