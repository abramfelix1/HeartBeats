"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    static associate(models) {
      Song.belongsToMany(models.Playlist, {
        through: models.PlaylistSong,
        as: "playlists",
        foreignKey: "songId",
        onDelete: "CASCADE",
      });
      Song.hasMany(models.UserFeedback, {
        as: "feedback",
        foreignKey: "songId",
      });
    }
  }
  Song.init(
    {
      name: DataTypes.STRING,
      artists: DataTypes.STRING,
      preview: DataTypes.STRING,
      img_url: DataTypes.STRING,
      spotifyId: DataTypes.STRING,
      spotify_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Song",
    }
  );
  return Song;
};
