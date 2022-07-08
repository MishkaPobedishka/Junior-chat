const {Sequelize, Op } = require('sequelize');
const User = require('../db/models/user');
const bcrypt = require("bcrypt");
const uuid = require('uuid')
const tokenService = require('./token')
const UserDTO = require('../dtos/user')
const ApiError = require('../exceptions/api-error')
const Dialog = require("../db/models/dialog");
const Message = require("../db/models/message");
const DialogDTO = require("../dtos/dialog");
const UpdateResultDTO = require("../dtos/updateResult");

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
            return await this.getExtraDialogInfo(dialog, userId)
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
                [Op.and]: [
                    {
                        sender_id: {
                        [Op.in]: dialog.users
                        }
                    },
                    {dialog_id: dialog.id}
                ]
            },
            order: [
                ['created_at', 'DESC']
            ]
        })
        const receiver_info = await User.findOne({
            where: {
                id: receiver
            }
        })
        let missed_messages;
        const {count, rows} = await Message.findAndCountAll({
            where: {
                [Op.and]: [
                    {sender_id: receiver},
                    {is_read: false},
                    {dialog_id: dialog.id}
                ]
            }
        })
        if (rows.length !== 0) {
            missed_messages = count;
        } else {
            missed_messages = 0;
        }
        return new DialogDTO(
            dialog,
            userId,
            receiver,
            receiver_info.first_name + ' ' + receiver_info.last_name,
            last_message,
            missed_messages);
    }

    async getMessages(dialogId) {
        return await Message.findAll({
            where: {
                dialog_id: dialogId
            },
            order: [
                ['created_at', 'ASC']
            ]
        });
    }

    async sendMessage(sender_id, dialog_id, text) {
        const created_id = uuid.v4();
        const is_read = false;
        const created_at = new Date(Date.now()).toISOString();

        return await Message.create({
            id: created_id,
            sender_id: sender_id,
            dialog_id: dialog_id,
            text: text,
            is_read: is_read,
            created_at: created_at
        })
    }

    async setMessagesReaded(messages) {
        if(Array.isArray(messages)) {
            let result = [];
            messages.map(async message => {
                await Message.update({is_read: true}, {
                    where: {
                        id: message
                    }
                })
                result.push(new UpdateResultDTO(message, 'Message', 'isRead', 'true'))
            })
            return result;
        }
        await Message.update({is_read: true}, {
            where: {
                id: messages
            }
        });
        return new UpdateResultDTO(messages, 'Message', 'isRead', 'true');
    }
}

module.exports = new ChatService();