"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserFeedback extends Model {
    static associate(models) {
      UserFeedback.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      UserFeedback.belongsTo(models.Song, {
        foreignKey: "songId",
        onDelete: "CASCADE",
      });
    }
  }
  UserFeedback.init(
    {
      recommendAgain: DataTypes.BOOLEAN,
      like: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserFeedback",
    }
  );
  return UserFeedback;
};
