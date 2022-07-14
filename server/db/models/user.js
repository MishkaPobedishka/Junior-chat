const {DataTypes} = require('sequelize');
const sequelize = require('../../util');

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
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  is_blocked: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  admin_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
}, {
  timestamps: false
});


module.exports = User;
