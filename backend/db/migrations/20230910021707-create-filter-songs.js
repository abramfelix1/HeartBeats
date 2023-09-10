"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FilterSongs", {
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
      songId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Songs",
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
    await queryInterface.dropTable("FilterSongs");
  },
};
