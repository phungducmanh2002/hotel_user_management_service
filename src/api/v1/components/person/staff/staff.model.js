const { instance } = require("@configs/objectMapping.config.js");
const { DataTypes } = require("sequelize");

module.exports = {
  staff: instance.define(
    "staff",
    {
      idRole: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
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
