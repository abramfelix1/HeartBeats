"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {
    static associate(models) {
      Journal.belongsTo(models.User, {
        as: "User",
        foreignKey: "userId",
      });
      Journal.hasOne(models.Playlist, {
        as: "Playlist",
        foreignKey: "journalId",
      });
    }
  }
  Journal.init(
    {
      userId: DataTypes.INTEGER,
      playlistId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      content: DataTypes.STRING,
      image_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Journal",
    }
  );
  return Journal;
};
