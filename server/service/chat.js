const { Op } = require('sequelize');
const User = require('../db/models/user');
const uuid = require('uuid')
const UserDTO = require('../dtos/user')
const ApiError = require('../exceptions/api-error')
const Dialog = require("../db/models/dialog");
const Message = require("../db/models/message");
const DialogDTO = require("../dtos/dialog");
const UpdateResultDTO = require("../dtos/updateResult");
const DeleteResultDTO = require("../dtos/deleteResult");

class ChatService {
    async getNewDialogsUsers(userId) {
        const existedDialogs = await Dialog.findAll({
            attributes: ['users'],
            where: {
                users: {
                    [Op.contains] : [userId]
                }
            }
        })
        const existedUsersDialogs = [];
        existedDialogs.map(dialog => {
            dialog.users.map(user => {
                if (user !== userId)
                    existedUsersDialogs.push(user);
            })
        })
        const users = await User.findAll({
            where: {
                [Op.and]: [
                    {
                        id: {
                            [Op.notIn]: existedUsersDialogs
                        }
                    },
                    {
                        id: {
                            [Op.ne]: userId
                        }
                    }
                ]
            }
        })
        return users.map(user => {
            return new UserDTO(user);
        });
    }

    async addNewDialog(userId, receiverId) {
        const created_id = uuid.v4();
        const created_at = new Date(Date.now()).toISOString();

        return await Dialog.create({
            id: created_id,
            users: [userId, receiverId],
            created_at: created_at
        })
    }

    async getDialogs(filter, userId) {
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
        const dialogDTOs = await Promise.all(dialogs.map(async dialog => {
            return await this.getExtraDialogInfo(dialog, userId, filter)
        }))
        let filteredDialogDTOs;
        if(filter !== ''){
            filteredDialogDTOs = this.getFilteredDialogs(dialogDTOs, filter);
        }
        else {
            filteredDialogDTOs = dialogDTOs;
        }
        return {
            dialogs: filteredDialogDTOs
        }
    }

    getFilteredDialogs(dialogs, filter) {
        console.log(dialogs, filter);
        return dialogs.filter(dialog => dialog.receiver_name.includes(filter));
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

    async getAdminUsers(userId) {
        const users = await User.findAll({
            where: {
                id: {
                    [Op.ne]: userId
                }
            }
        })
        return users.map(user => {
            return new UserDTO(user);
        });
    }

    async blockUser(adminId, userId, blockStatus) {
        const admin_id = blockStatus ? adminId : null;
        await User.update({is_blocked: blockStatus, admin_id}, {
            where: {
                id: userId
            }
        });
        return new UpdateResultDTO(userId, 'User', 'isBlocked', blockStatus);
    }

    async getBlockInfo(adminId) {
        const admin = await User.findOne({
            where: {
                id: adminId
            }
        })
        return {
            userName: admin.first_name + ' ' + admin.last_name,
            userEmail: admin.email
        }

    }

    async deleteUser(userId) {
        await User.destroy({
            where: {
                id: userId
            }
        })
        return new DeleteResultDTO(userId);
    }
}

module.exports = new ChatService();