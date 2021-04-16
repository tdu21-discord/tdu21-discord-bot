import { CommandMessage } from "@typeit/discord";
import { Guild, User } from "discord.js";
import config from "../../config";
import messages from "../../config/auth/directMessage";
import { logger } from "../../utils/logger";

const AllMemberReset = async (message: CommandMessage) => {
  const guild = message.guild;
  const members = await guild.members.fetch();

  const memberRole = await message.guild.roles.fetch(config.roles.member.roleId);

  for (let [,member] of members){
    if (member.user.bot) return;
    if (!member.roles.cache.has(config.roles.member.roleId)) return;
    logger.log(`[RESET_SCRIPT] ${member.user.username} / START`)
    if (member.roles.cache.has(config.roles.modelator.roleId)){
      logger.log(`[RESET_SCRIPT] ${member.user.username} / END - USER HAS MODERATOR ROLE`)
      return;
    }

    const guildRoles = message.guild.roles;

    await member.roles.remove(memberRole)
    logger.log(`[RESET_SCRIPT] ${member.user.username} / PROGRESS - REMOVED GENERAL ROLES`)

    const oldDepRoles = config.departments.filter(
      (dep) => member.roles.cache.has(dep.departmentRoleId)
    );

    for (let dep of oldDepRoles){
      await member.roles.remove(await guildRoles.fetch(dep.departmentRoleId))
      await member.roles.remove(await guildRoles.fetch(dep.facultyRoleId))
      logger.log(`[RESET_SCRIPT] ${member.user.username} / PROGRESS - REMOVED ${dep.name} ROLE`)
    }

    await sendDirectMessage(member.user, "join")
    logger.log(`[RESET_SCRIPT] ${member.user.username} / END - COMPLETED`)

  }
}

const sendDirectMessage = async (
  user: User,
  messageName: string
) => {
  const messageDatum = messages.find(
      (message) => message.name === messageName
  );

  for (let message of messageDatum.body) {
    await user.send(message);
  }
}

export default AllMemberReset;