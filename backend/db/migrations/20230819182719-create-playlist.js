'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Playlists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      songId: {
        type: Sequelize.INTEGER
      },
      journalId: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      spotify_url: {
        type: Sequelize.STRING
      },
      image_url: {
        type: Sequelize.STRING
      },
      instrumental: {
        type: Sequelize.INTEGER
      },
      mood: {
        type: Sequelize.INTEGER
      },
      energy: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Playlists');
  }
};