const {sequelize, Op } = require('sequelize');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const uuid = require('uuid')
const tokenService = require('./token')
const UserDTO = require('../dtos/user')
const ApiError = require('../exceptions/api-error')
const Dialog = require("../models/dialog");
const Message = require("../models/message");
const DialogDTO = require("../dtos/dialog");

class ChatService {
    async getDialogs(userId) {
        const dialogs = await Dialog.findAll({
            where : {
                users : {
                    [Op.contains] : [userId]
                }
            },
            order: [
                ['created_at', 'ASC']
            ]
        })
        if (!dialogs) {
            return dialogs;
        }
        let dialogDTOs = await Promise.all(dialogs.map(async dialog => {
            const dialogDTO = await this.getExtraDialogInfo(dialog, userId)
            return dialogDTO
        }))
        return {
            dialogs: dialogDTOs
        }
    }

    async getExtraDialogInfo(dialog, userId) {
        let receiver;
        dialog.users.map((user) => {
            if (user !== userId)
                receiver = user;
        })
        const last_message = await Message.findOne({
            where: {
                sender_id: {
                    [Op.in]: dialog.users
                }
            },
            order: [
                ['created_at', 'DESC']
            ]
        })
        let missed_messages;
        const {count, rows} = await Message.findAndCountAll({
            where: {
                [Op.and]: [
                    {sender_id: receiver},
                    {isRead: false}
                ]
            }
        })
        if (rows.length !== 0) {
            missed_messages = count;
        } else {
            missed_messages = 0;
        }
        const dialogDTO = new DialogDTO(dialog, userId, receiver, last_message, missed_messages);
        return dialogDTO;
    }
}

module.exports = new ChatService();