import { Department } from "../@types/department";
import departments_dev from "./departments.development";
import departments_prod from "./departments.production";

const getDepartments = () => {
  if (process.env.ENV === "production") {
    return departments_prod;
  }
  return departments_dev;
}

export default getDepartments();
