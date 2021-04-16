import { Command, CommandMessage, Guard } from "@typeit/discord";
import config from "../config";
import ModelatorOnly from "../guards/ModelatorOnlyGuard";
import ServerMessageOnly from "../guards/ServerMessageOnlyGuard";
import { logger } from "../utils/logger";

export abstract class CheckConfigCommand {
  @Command("config check")
  @Guard(
    ServerMessageOnly,
    ModelatorOnly
  )
  async onCheckConfigCommand(cmd: CommandMessage) {
    for (let dep of config.departments) {
      const depRole = await cmd.guild.roles.fetch(dep.departmentRoleId)
      const facRole = await cmd.guild.roles.fetch(dep.facultyRoleId)
      logger.log("---")
      logger.log(`役職名: ${dep.name}`)
      if (facRole === null){
        logger.log("学部役職: 学部役職がありません")
      } else {
        logger.log(`学部役職: ${facRole.name}`)
      }
      if (depRole === null){
        logger.log("学科役職: 学科役職がありません")
      } else {
        logger.log(`学科役職: ${depRole.name}`)
      }
    }
    logger.log("---")
  }
}