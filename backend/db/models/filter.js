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
    }
  }
  Filter.init(
    {
      journalId: DataTypes.INTEGER,
      filter1: DataTypes.STRING,
      filter2: DataTypes.STRING,
      filter3: DataTypes.STRING,
      filter4: DataTypes.STRING,
      filter5: DataTypes.STRING,
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
