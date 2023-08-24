"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {
    static associate(models) {
      Journal.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });
      Journal.hasOne(models.Playlist, {
        as: "playlist",
        foreignKey: "journalId",
        onDelete: "CASCADE",
      });
    }
  }
  Journal.init(
    {
      userId: DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
        validate: {
          len: [1, 60],
        },
      },
      content: {
        type: DataTypes.TEXT,
        defaultValue: "I am feeling...",
      },
      image_url: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Journal",
    }
  );
  return Journal;
};
