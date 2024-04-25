const { instance } = require("@configs/objectMapping.config.js");
const { DataTypes } = require("sequelize");

module.exports = {
  role: instance.define(
    "role",
    {
      roleName: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
    },
    {
      freezeTableName: true,
    }
  ),
};
