"use strict";
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Filters",
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
        valence: {
          type: Sequelize.DECIMAL(10, 6),
        },
        energy: {
          type: Sequelize.DECIMAL(10, 6),
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Filters");
  },
};
