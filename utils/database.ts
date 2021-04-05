import { createConnection } from "typeorm";

export const connectDatabase = async () => {
    await createConnection({
        type: "mysql",
        host: process.env.DB_HOST,
        port: 3306,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: true,
        entities: [
            process.cwd() + "/entity/*.ts"
        ]
    })
}