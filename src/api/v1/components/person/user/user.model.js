const { instance } = require("@configs/objectMapping.config.js");
const { DataTypes } = require("sequelize");

module.exports = {
  user: instance.define(
    "user",
    {
      firstName: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          len: [0, 30],
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          len: [0, 30],
          notEmpty: true,
        },
      },
      gender: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isIn: [[0, 1, 2]],
          /**
           * Nam
           * Nữ
           * Khác
           */
        },
      },
      birthDay: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountStatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isIn: [[0, 1, 2]],
          /**
           * Chưa kích hoạt
           * Đang hoạt động
           * Đã khóa
           */
        },
      },
      idResource: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      idCustomer: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      idHotelier: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      idStaff: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      activationCode: {
        type: DataTypes.STRING(5),
        allowNull: true,
        validate: {
          isNumeric: true,
          len: [5, 5],
        },
      },
      changePassCode: {
        type: DataTypes.STRING(5),
        allowNull: true,
        validate: {
          isNumeric: true,
          len: [5, 5],
        },
      },
    },
    {
      freezeTableName: true,
    }
  ),
};
