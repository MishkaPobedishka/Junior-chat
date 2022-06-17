const {DataTypes} = require('sequelize');
const sequelize = require('../util/index');
const User = require('./user')

const Token = sequelize.define("token" , {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: false
});

User.hasOne(Token);
Token.belongsTo(User);

module.exports = Token;



