const {DataTypes} = require('sequelize');
const sequelize = require('../util/index');

const User = sequelize.define("user" , {
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


module.exports = User;
