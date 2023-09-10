"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FilterSong extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FilterSong.belongsTo(models.Song, {
        foreignKey: "songId",
        as: "song",
        onDelete: "CASCADE",
      });

      FilterSong.belongsTo(models.Filter, {
        foreignKey: "filterId",
        as: "filter",
        onDelete: "CASCADE",
      });
    }
  }
  FilterSong.init(
    {
      filterId: DataTypes.INTEGER,
      songId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "FilterSong",
    }
  );
  return FilterSong;
};
