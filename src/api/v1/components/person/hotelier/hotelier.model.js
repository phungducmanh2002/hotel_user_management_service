const { instance } = require("@configs/objectMapping.config.js");
const { DataTypes } = require("sequelize");

module.exports = {
  hotelier: instance.define(
    "hotelier",
    {
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isIn: [[0, 1]],
          /**
           * Hoạt động
           * Đóng
           */
        },
      },
    },
    {
      freezeTableName: true,
    }
  ),
};
