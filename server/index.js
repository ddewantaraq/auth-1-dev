const express = require("express");
const router = require("./routes");
const dotenv = require('dotenv');
const sequelize = require('./commons/db')
const redisClient = require('./commons/redis')
dotenv.config()

const app = express();

app.use(express.json())
app.use('/', router);

const port = process.env.API_PORT || 3232;

app.listen(port, async () => {
  try {
    redisClient.on("error", (error) => console.error(`Redis Error : ${error}`));
    await redisClient.connect();
    console.log('Redis has been established successfully.');
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    console.log(`server listening on http://localhost:${port}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
