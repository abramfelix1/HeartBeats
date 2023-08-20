"use strict";

const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Journal, {
        as: "Journals",
        foreignKey: "userId",
      });
      User.hasMany(models.UserFeedback, {
        as: "Feedback",
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [8, 60],
        },
      },
      spotify: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: null },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
