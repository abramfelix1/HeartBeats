"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Filter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Filter.belongsTo(models.Journal, {
        as: "journal",
        foreignKey: "journalId",
      });
      Filter.belongsToMany(models.Artist, {
        through: models.FilterArtist,
        as: "artists",
        foreignKey: "filterId",
        onDelete: "CASCADE",
      });
      Filter.belongsToMany(models.Song, {
        through: models.FilterSong,
        as: "songs",
        foreignKey: "filterId",
        onDelete: "CASCADE",
      });
      Filter.belongsToMany(models.Genre, {
        through: models.FilterGenre,
        as: "genres",
        foreignKey: "filterId",
        onDelete: "CASCADE",
      });
    }
  }
  Filter.init(
    {
      journalId: DataTypes.INTEGER,
      valence: DataTypes.DECIMAL(10, 6),
      energy: DataTypes.DECIMAL(10, 6),
    },
    {
      sequelize,
      modelName: "Filter",
    }
  );
  return Filter;
};
