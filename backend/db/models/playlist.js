"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    static associate(models) {
      Playlist.belongsToMany(models.Song, {
        through: models.PlaylistSong,
        as: "songs",
        foreignKey: "playlistId",
        onDelete: "CASCADE",
      });
      Playlist.belongsTo(models.Journal, {
        as: "journal",
        foreignKey: "journalId",
      });
    }
  }
  Playlist.init(
    {
      journalId: DataTypes.INTEGER,
      name: { type: DataTypes.STRING, defaultValue: "My Playlist" },
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
