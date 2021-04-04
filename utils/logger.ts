import * as logdna from "@logdna/logger";

export const logger = logdna.createLogger(
    process.env.LOGDNA_TOKEN,
    {
        app: process.env.LOGDNA_APP
    }
)