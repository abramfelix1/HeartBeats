"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Filters", {
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
          key: "id",
        },
        onDelete: "CASCADE",
      },
      fitler1: {
        type: Sequelize.STRING,
      },
      filter2: {
        type: Sequelize.STRING,
      },
      filter3: {
        type: Sequelize.STRING,
      },
      filter4: {
        type: Sequelize.STRING,
      },
      filter5: {
        type: Sequelize.STRING,
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Filters");
  },
};
