const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME
const host = process.env.DB_HOST

const sequelize = new Sequelize(`postgres://${dbUser}:${dbPass}@${host}:5432/${dbName}`, {
  pool: {
    max: 5,
    min: 0,
    idle: 200000,
    acquire: 1000000,
  }
})

module.exports = sequelize;