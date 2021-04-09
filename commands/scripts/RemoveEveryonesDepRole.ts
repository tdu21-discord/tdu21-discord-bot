import { CommandMessage } from "@typeit/discord";
import { Guild } from "discord.js";
import departments from "../../config/departments";
import { logger } from "../../utils/logger";

const RemoveEveryonesDepRole = async (message: CommandMessage) => {
  const guild = message.guild;
  const members = await guild.members.cache;
  let count = 0;
  members.forEach((member, key) => {
    if (!member.user.bot){
      member.roles.cache.forEach((role) => {
        departments.forEach((dep) => {
          if (dep.departmentRoleId === role.id) {
            logger.debug("Removed: " + member.user.username + " / " + role.name)
            member.roles.remove(role)
          }
        })
      })
    }
  })
}

export default RemoveEveryonesDepRole;