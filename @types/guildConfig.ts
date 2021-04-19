import { Department } from "./department";
import { ServerRoles } from "./serverRole";

export type GuildConfig = {
  guildId: string;
  roles: ServerRoles;
  departments: Department[]
  channelReactionRoles: ChannelReactionRole[]
  messageReactionRoles: MessageReactionRole[]
}

export interface ReactionRole {
  roleId: string;
  roleName?: string;
  emojiId: string;
}

export interface ChannelReactionRole extends ReactionRole {
  channelId: string;
  channelName?: string;
}

export interface MessageReactionRole extends ReactionRole {
  messageId: string;
}