require("dotenv").config();
module.exports = {
  GetEnvValueByKey: (key) => {
    return process.env[key];
  },
  GetEnvDBName: () => {
    return process.env.DATABASE_NAME;
  },
  GetEnvDBUserName: () => {
    return process.env.DATABASE_USERNAME;
  },
  GetEnvDBPassword: () => {
    return process.env.DATABASE_PASSWORD;
  },
  GetEnvJwtSecretKey: () => {
    return process.env.TOKEN_SECRET_KEY;
  },
  GetEnvJwtTokenLifeTime: () => {
    return process.env.TOKEN_LIFE_TIME;
  },
};
