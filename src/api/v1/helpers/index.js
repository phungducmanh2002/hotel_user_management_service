const bcrypt = require("bcrypt");

module.exports = {
  generateNumericString: (length) => {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  hashString: (value) => {
    return bcrypt.hashSync(value, 8);
  },
  compareStringAndHash: (str, hashString) => {
    return bcrypt.compareSync(str, hashString);
  },
};
