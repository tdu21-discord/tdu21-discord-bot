import { Department } from "../@types/department";
import { ServerRoles } from "../@types/serverRole";
import * as devConfig from "./env/development"
import * as prodConfig from "./env/production";

const getConfig = () => {
  if (process.env.ENV === "production") {
    return {
      departments: prodConfig.departments,
      roles: prodConfig.roles,
      serverId: prodConfig.serverId
    };
  }
  return {
    departments: devConfig.departments,
    roles: devConfig.roles,
    serverId: devConfig.serverId
  };
}

export default getConfig()