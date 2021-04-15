import devConfig from "./env/development"
import prodConfig from "./env/production";

const getConfig = () => {
  if (process.env.ENV === "production") {
    return prodConfig;
  }
  return devConfig;
}

export default getConfig()