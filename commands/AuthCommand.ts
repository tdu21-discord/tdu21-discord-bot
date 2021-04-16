import { Command, CommandMessage, Guard } from "@typeit/discord";
import { MessageEmbed, User } from "discord.js";
import config from "../config";
import messages from "../config/auth/directMessage";
import { Status, Student } from "../database/entity/Student";
import { DendaiStudentAuth } from "../functions/auth/DendaiStudentAuth";
import ModelatorOnly from "../guards/ModelatorOnlyGuard";
import ServerMessageOnly from "../guards/ServerMessageOnlyGuard";
import { logger } from "../utils/logger";

export abstract class AuthCommand {

  @Command("auth status :targetMember")
  @Guard(
    ServerMessageOnly,
    ModelatorOnly
  )
  async onAuthStatusCommand(cmd: CommandMessage){
    if (!cmd.args.targetMember === undefined){
      await cmd.channel.send({
        embed: new MessageEmbed()
          .setTitle("エラー")
          .setDescription("ステータスを確認する対象のユーザーが指定されていません。\nユーザーはメンションもしくはユーザーIDで指定できます。")
          .setColor(15406156)
      })
      return;
    }

    const resMessage = await cmd.channel.send({
      content: "ユーザーを検索中..."
    })

    const targetMemberId = this.getUserIdFromMention(cmd.args.targetMember)
    const targetMember = cmd.guild.members.cache.get(targetMemberId);

    // サーバーにいないユーザーはスキップ
    if (targetMember === undefined) {
      await resMessage.edit({
        content: "",
        embed: new MessageEmbed()
          .setTitle("エラー")
          .setDescription("このユーザーはサーバーにいないため、ステータスを確認することはできません。")
          .setColor(15406156)
      })
      return;
    }

    const student = await Student.findOne({
      user_id: targetMemberId
    });

    if (student === undefined) {
      await resMessage.edit({
        content: "",
        embed: new MessageEmbed()
          .setTitle("エラー")
          .setDescription("対象のユーザーはデータベース上に記録されていません。")
          .setColor(15406156)
      })
      return;
    }

    await resMessage.edit({
      content: "",
      embed: new MessageEmbed()
          .setTitle(`${targetMember.user.username} (ID: ${student.user_id}) さんの認証ステータス`)
          .addField("ステータス", student.status)
          .addField("認証試行回数", student.threshold)
          .addField("学科/学部", student.department)
          .addField("偶奇フラグ", student.odd_even)
          .addField("作成日時", student.createdAt)
          .addField("更新日時", student.updatedAt)
          .setColor(431075)
    })

  }

  @Command("auth reset :targetMember")
  @Guard(
    ServerMessageOnly,
    ModelatorOnly
  )
  async onAuthStatusResetCommand(cmd: CommandMessage){

    if (cmd.args.targetMember === undefined){
      await cmd.channel.send({
        embed: new MessageEmbed()
          .setTitle("エラー")
          .setDescription("ステータスを確認する対象のユーザーが指定されていません。\nユーザーはメンションもしくはユーザーIDで指定できます。")
          .setColor(15406156)
      })
      return;
    }

    const resMessage = await cmd.channel.send({
      content: "ユーザーを検索中..."
    })

    const targetMemberId = this.getUserIdFromMention(cmd.args.targetMember)
    const targetMember = cmd.guild.members.cache.get(targetMemberId);

    // サーバーにいないユーザーはスキップ
    if (targetMember === undefined) {
      await resMessage.edit({
        content: "",
        embed: new MessageEmbed()
          .setTitle("エラー")
          .setDescription("このユーザーはサーバーにいないため、ステータスをリセットすることはできません。")
          .setColor(15406156)
      })
      return;
    }

    let student = await Student.findOne({
      user_id: targetMemberId
    });

    // ユーザーデータがまだ記録されていなかった場合
    if (student === undefined) {
      student = new Student();
      try {
        student.user_id = targetMemberId;
        await student.save();
      } catch (error) {
        logger.error(error);
        return;
      }
      await cmd.channel.send({
        content: "ユーザーデータが存在しなかったため、新たに作成されました。"
      })
    }

    // 認証をすべてリセットする

    student.student_id = null;
    student.department = null;
    student.odd_even = null;
    student.verifycode = null;
    student.status = Status.NEW_JOIN;
    student.save();

    // 役職をすべてリセットする

    const guildRoles = cmd.guild.roles;

    await targetMember.roles.remove([
      await guildRoles.fetch(config.roles.member.roleId),
      await guildRoles.fetch(config.roles.oddNumber.roleId),
      await guildRoles.fetch(config.roles.evenNumber.roleId)
    ])

    const oldDepRoles = config.departments.filter(
      (dep) => targetMember.roles.cache.has(dep.departmentRoleId)
    );

    for (let dep of oldDepRoles){
      await targetMember.roles.remove(await guildRoles.fetch(dep.departmentRoleId))
      await targetMember.roles.remove(await guildRoles.fetch(dep.facultyRoleId))
    }

    // メッセージを送信する
    this.sendDirectMessage(targetMember.user, "join")

    logger.info(`[CHANGED_BY_CMD][${student.id}] ${targetMember.user.username}(${targetMemberId}) / STATUS => NEW_JOIN`);

    await resMessage.edit({
      content: "",
      embed: new MessageEmbed()
          .setTitle("完了")
          .setDescription(`${targetMember.user.username} (ID: ${student.user_id}) さんの認証ステータスをリセットしました。\n認証試行回数は ${student.threshold} 回から変更されておりませんので、認証回数を変更する場合は\`!auth limit [@user/userId] [amount]\` を使用してください。`)
          .setColor(53380)
    })
  }

  @Command("auth limit :targetMember :value")
  @Guard(
    ServerMessageOnly,
    ModelatorOnly
  )
  async onAuthChangeLimitCommand(cmd: CommandMessage){

    if (cmd.args.targetMember === undefined){
      await cmd.channel.send({
        embed: new MessageEmbed()
          .setTitle("エラー")
          .setDescription("ステータスを確認する対象のユーザーが指定されていません。\nユーザーはメンションもしくはユーザーIDで指定できます。")
          .setColor(15406156)
      })
      return;
    }

    if (cmd.args.value === undefined){
      await cmd.channel.send({
        embed: new MessageEmbed()
          .setTitle("エラー")
          .setDescription("設定する試行回数が入力されていません。")
          .setColor(15406156)
      })
      return;
    }

    if (!Number.isInteger(cmd.args.value)){
      await cmd.channel.send({
        embed: new MessageEmbed()
          .setTitle("エラー")
          .setDescription("試行回数は数字で入力してください。")
          .setColor(15406156)
      })
      return;
    }

    const value = parseInt(cmd.args.value)

    const resMessage = await cmd.channel.send({
      content: "ユーザーを検索中..."
    })

    const targetMemberId = this.getUserIdFromMention(cmd.args.targetMember)
    const targetMember = cmd.guild.members.cache.get(targetMemberId);

    // サーバーにいないユーザーはスキップ
    if (targetMember === undefined) {
      await resMessage.edit({
        content: "",
        embed: new MessageEmbed()
          .setTitle("エラー")
          .setDescription("このユーザーはサーバーにいないため、ステータスをリセットすることはできません。")
          .setColor(15406156)
      })
      return;
    }

    const student = await Student.findOne({
      user_id: targetMemberId
    });

    if (student === undefined) {
      await resMessage.edit({
        content: "",
        embed: new MessageEmbed()
          .setTitle("エラー")
          .setDescription("このユーザーはデータベース上に記録されていません。ステータスリセット後に再度お試しください。")
          .setColor(15406156)
      })
      return;
    }

    logger.info(`[CHANGED_BY_CMD][${student.id}] ${targetMember.user.username}(${targetMemberId}) / THRESHOLD ${student.threshold} => ${value}`);

    student.threshold = value;
    student.save();

    await resMessage.edit({
      content: "",
      embed: new MessageEmbed()
          .setTitle("完了")
          .setDescription(`${targetMember.user.username} (ID: ${student.user_id}) さんの試行回数を \`${value}\` 回に変更しました。`)
          .setColor(53380)
    })
  }

  @Command("auth change :targetMember :status")
  @Guard(
    ServerMessageOnly,
    ModelatorOnly
  )
  async onAuthChangeStatusCommand(cmd: CommandMessage){

  }

  getUserIdFromMention(mention: string){

    if (typeof mention === "number") return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);

      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }

    }

    return mention;
  }

  async sendDirectMessage(
      user: User,
      messageName: string
  ) {
      const messageDatum = messages.find(
          (message) => message.name === messageName
      );

      for (let message of messageDatum.body) {
          await user.send(message);
      }
  }

}