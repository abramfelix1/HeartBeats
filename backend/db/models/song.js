"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    static associate(models) {
      Song.hasMany(models.Playlist, {
        as: "Playlist",
        foreignKey: "playlistId",
      });
    }
  }
  Song.init(
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      artists: DataTypes.STRING,
      preview: DataTypes.STRING,
      img_url: DataTypes.STRING,
      spotify_url: DataTypes.STRING,
      feedback: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Song",
    }
  );
  return Song;
};
