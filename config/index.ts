import { Department } from "../@types/department";
import { ServerRoles } from "../@types/serverRole";
import * as devConfig from "./env/development"
import * as prodConfig from "./env/production";

type serverConfig = {
  departments: Department[]
  roles: ServerRoles
}

const getConfig = () => {
  if (process.env.ENV === "production") {
    return {
      departments: prodConfig.departments,
      roles: prodConfig.roles
    };
  }
  return {
    departments: devConfig.departments,
    roles: devConfig.roles
  };
}

export default getConfig()