'use strict';

const {DataTypes} = require("sequelize/types");
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      },
      first_name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      last_name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      password_hash: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      timestamps: false
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('users');
  }
};
