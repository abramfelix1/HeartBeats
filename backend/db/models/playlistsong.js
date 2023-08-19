"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlaylistSong extends Model {
    static associate(models) {
      PlaylistSong.belongsTo(models.Playlist, {
        as: "Playlist",
        foreignKey: "playlistId",
        onDelete: "CASCADE",
      });
      PlaylistSong.belongsTo(models.Song, {
        as: "Song",
        foreignKey: "songId",
        onDelete: "CASCADE",
      });
    }
  }
  PlaylistSong.init(
    {
      songId: DataTypes.INTEGER,
      playlistId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PlaylistSong",
    }
  );
  return PlaylistSong;
};
