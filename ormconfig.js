module.exports = {
    "type": "mysql",
    "host": process.env.DB_HOST,
    "port": 3306,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "synchronize": false,
    "entities": [
        "database/entity/*.ts"
    ],
    "migrations": [
        "database/migration/*.ts"
    ]
}