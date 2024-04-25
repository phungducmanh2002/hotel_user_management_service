const {
  GetEnvJwtTokenLifeTime,
  GetEnvJwtSecretKey,
} = require("../projectUtils");

const tokenLifeTime = GetEnvJwtTokenLifeTime();
const tokenSecretKey = GetEnvJwtSecretKey();

module.exports = {
  secret: tokenSecretKey,
  options: {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: tokenLifeTime, // 24 hours
  },
};
