"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Artist.belongsToMany(models.Filter, {
        through: models.FilterArtist,
        as: "artistsFilters",
        foreignKey: "artistId",
        onDelete: "CASCADE",
      });
    }
  }
  Artist.init(
    {
      name: DataTypes.STRING,
      img_url: DataTypes.STRING,
      spotify_url: DataTypes.STRING,
      spotifyId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Artist",
    }
  );
  return Artist;
};
