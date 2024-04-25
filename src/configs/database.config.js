const {
  GetEnvDBName,
  GetEnvDBUserName,
  GetEnvDBPassword,
} = require("../projectUtils");

const databaseName = GetEnvDBName();
const databaseUsername = GetEnvDBUserName();
const databasePassword = GetEnvDBPassword();

module.exports = {
  mssql: {
    host: "localhost",
    user: databaseUsername,
    password: databasePassword,
    database: databaseName,
    dialect: "mssql",
  },
};
