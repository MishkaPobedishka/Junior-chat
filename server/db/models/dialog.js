const {DataTypes} = require('sequelize');
const sequelize = require('../../util');

const Dialog = sequelize.define("dialog" , {
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


module.exports = Dialog;