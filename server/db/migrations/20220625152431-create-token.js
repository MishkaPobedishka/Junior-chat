'use strict';

const {DataTypes} = require("sequelize/types");
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tokens', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
            schema: 'public'
          },
          key: 'id'
        },
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      timestamps: false
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('tokens');
  }
};
