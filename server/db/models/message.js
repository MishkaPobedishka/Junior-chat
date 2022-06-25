const {DataTypes} = require('sequelize');
const sequelize = require('../../util');
const Dialog = require("./dialog");

const Message = sequelize.define("message" , {
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
            model: {
                tableName: 'dialog',
                schema: 'public'
            },
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

Dialog.hasMany(Message, { foreignKey: 'dialog_id' });
Message.belongsTo(Dialog, { foreignKey: 'dialog_id' });

module.exports = Message;