"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    static associate(models) {
      Playlist.belongsToMany(models.Songs, {
        as: "Song",
        foreignKey: "songId",
      });
      Playlist.belongsTo(models.Journal, {
        as: "Journal",
        foreignKey: "journalId",
      });
    }
  }
  Playlist.init(
    {
      songId: DataTypes.INTEGER,
      journalId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      spotify_url: DataTypes.STRING,
      image_url: DataTypes.STRING,
      instrumental: DataTypes.INTEGER,
      mood: DataTypes.INTEGER,
      energy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Playlist",
    }
  );
  return Playlist;
};
