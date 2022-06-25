'use strict';

const {DataTypes} = require("sequelize/types");
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('dialogs', {
      id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      sender_id: {
        type: DataTypes.UUIDV4,
        allowNull: false
      },
      dialog_id: {
        type: DataTypes.UUIDV4,
        references: {
          model: 'dialog',
          key: 'id'
        },
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      isRead: {
        type: DataTypes.BOOLEAN,
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
