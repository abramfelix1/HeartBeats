"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Playlists",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        journalId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Journals",
          },
          onDelete: "CASCADE",
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "My Playlist",
        },
        spotifyId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        spotify_url: {
          type: Sequelize.STRING,
        },
        image_url: {
          type: Sequelize.STRING,
        },
        instrumental: {
          type: Sequelize.INTEGER,
        },
        mood: {
          type: Sequelize.INTEGER,
        },
        energy: {
          type: Sequelize.INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Playlists");
  },
};
