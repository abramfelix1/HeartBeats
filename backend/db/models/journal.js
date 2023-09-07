"use strict";
const Sequelize = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {
    static associate(models) {
      Journal.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });
    }
  }
  Journal.init(
    {
      userId: DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
        validate: {
          len: [1, 60],
        },
        defaultValue: () => {
          let date = new Date();
          let year = date.getUTCFullYear();
          let month = ("0" + (date.getUTCMonth() + 1)).slice(-2); // Months are 0-based
          let day = ("0" + date.getUTCDate()).slice(-2);
          let hours = ("0" + date.getUTCHours()).slice(-2);
          let minutes = ("0" + date.getUTCMinutes()).slice(-2);
          let seconds = ("0" + date.getUTCSeconds()).slice(-2);

          // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          return "Untitled";
        },
      },
      content: {
        type: DataTypes.TEXT,
        defaultValue: "I am feeling...",
      },
      image_url: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
      },
      mood: DataTypes.DECIMAL(10, 6),
      energy: DataTypes.DECIMAL(10, 6),
    },
    {
      sequelize,
      modelName: "Journal",
    }
  );
  return Journal;
};
