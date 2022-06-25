'use strict';

const {DataTypes} = require("sequelize/types");
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('dialogs', {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      },
      users: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      timestamps: false
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('dialogs');
  }
};
