// WIP

import { CommandMessage } from "@typeit/discord";
import { Guild } from "discord.js";

const SendDirectMessageEveryone = async (message: CommandMessage) => {
  const guild = message.guild;
  const members = await guild.members.cache;
  // WIP
  /*let count = 0;
  members.forEach((member, key) => {
    count++;
    console.log(count + " / " + member.displayName)
  })*/
}

export default SendDirectMessageEveryone;