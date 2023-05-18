# Nodejs App One Device Authentication

### Instructions 
  - Assume you have Node 18 on your local machine.
  - GOTO server directory, find config directory.
  - copy config.json.example to config.json.
  - update config.json for necessary information.
  - on root directory, copy .env.example to .env and fill the necessary information.
  - GOTO docker directory.
  - on root directory, copy .env.example to .env and fill the necessary information.
  - Please run the command below under root directory:
    ```js
    docker compose up
    ```
  - GOTO server directory, Run the command below for migrations:
    ```js
    npx sequelize-cli db:migrate
    ```
  - More about Sequelize migrations: https://sequelize.org/docs/v6/other-topics/migrations/
  