import { Department } from "./department";
import { ServerRoles } from "./serverRole";

export type GuildConfig = {
  guildId: string;
  roles: ServerRoles;
  departments: Department[]
}