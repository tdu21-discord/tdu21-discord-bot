import { On, ArgsOf, Client } from "@typeit/discord";
import { GuildMember, ReactionUserManager, Role, User } from "discord.js";

const roleIdByReactionId: object = {
  "796584431078342697": "796549994785275905", // AJ
  "796584431229468772": "796550069066661958", // AD
  "796584431312699413": "796550096405266443", // FA
  "796584431409168404": "796550147437625364", // FI
  "796584431360016424": "796550189950959616", // FR
  "796584431250046976": "796550215125041152", // EJ
  "796584430902312971": "796550261635678228", // EH
  "796584431472607232": "796550287510863902", // ES
  "796584431149383741": "796550320657662010", // EK
  "796584431342321674": "796550324578943017", // EF
  "796584431154364446": "796550368061423667", // EC
  "796584431422406676": "796550391500243024", // NE
  "796584431536046080": "796550497078738987", // NM
  "796584431594111017": "796550517714976768", // NC
  "796584433783537736": "796550936590942209", // RU
  "796584431599091743": "796550971165507595", // RB
  "796584431661482004": "796550977561559071", // RD
  "796584432575709205": "796550980157571075", // RM
  "796584431803957268": "796550983060684880", // RE
  "796584431842099250": "796550985761685534", // RG
};

export abstract class DepartmentRole {
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

    // Bot ではないかどうか
    if (user.bot) return;

    // 自分自身に付けられたリアクションかどうか
    if (reaction.message.author.id !== "796596910215397386") return;

    // チャンネルが #学科設定 かどうか
    if (reaction.message.channel.id !== "796380475324629003") return;

    // リアクションに対応する役職があるかどうか
    if (!roleIdByReactionId[reaction.emoji.id]) return;

    // 既に学科ロールがついている => その学科ロールは外す
    const member = reaction.message.guild.member(user);
    const userRoles: Role[] = await member.roles.cache.array();
    const roleIds = Object.values(roleIdByReactionId);
    for (let role of userRoles) {
      if (roleIds.includes(role.id)) {
        let beRemovedRole = await reaction.message.guild.roles.fetch(role.id);
        member.roles.remove(beRemovedRole);
      }
    }

    // リアクションに対応する役職を付与する
    const beAddedRole = await reaction.message.guild.roles.fetch(
      roleIdByReactionId[reaction.emoji.id]
    );
    member.roles.add(beAddedRole);

    // リアクションの除去
    reaction.users.remove(user);
  }
}
