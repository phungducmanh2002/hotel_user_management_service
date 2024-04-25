const { instance } = require("@configs/objectMapping.config.js");
const { DataTypes } = require("sequelize");

module.exports = {
  resource: instance.define(
    "resource",
    {
      value: {
        type: DataTypes.BLOB,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  ),
};
