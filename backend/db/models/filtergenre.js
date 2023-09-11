"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FilterGenre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FilterGenre.belongsTo(models.Filter, {
        foreignKey: "filterId",
        as: "filter",
        onDelete: "CASCADE",
      });

      FilterGenre.belongsTo(models.Genre, {
        foreignKey: "genreId",
        as: "genre",
        onDelete: "CASCADE",
      });
    }
  }
  FilterGenre.init(
    {
      genreId: DataTypes.INTEGER,
      filterId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "FilterGenre",
    }
  );
  return FilterGenre;
};
