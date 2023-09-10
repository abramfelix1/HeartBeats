"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FilterArtists", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      filterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Filters",
        },
        onDelete: "CASCADE",
      },
      artistId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Artists",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("FilterArtists");
  },
};
