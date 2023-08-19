'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Song.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    artists: DataTypes.STRING,
    preview: DataTypes.STRING,
    img_url: DataTypes.STRING,
    spotify_url: DataTypes.STRING,
    feedback: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Song',
  });
  return Song;
};