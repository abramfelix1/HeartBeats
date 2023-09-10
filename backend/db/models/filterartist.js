"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FilterArtist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FilterArtist.belongsTo(models.Artist, {
        as: "artist",
        foreignKey: "artistId",
        onDelete: "CASCADE",
      });

      FilterArtist.belongsTo(models.Filter, {
        as: "filter",
        foreignKey: "filterId",
        onDelete: "CASCADE",
      });
    }
  }
  FilterArtist.init(
    {
      filterId: DataTypes.INTEGER,
      artistId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "FilterArtist",
    }
  );
  return FilterArtist;
};
