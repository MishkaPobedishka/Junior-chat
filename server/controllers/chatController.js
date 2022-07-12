const chatService = require("../service/chat");


class ChatController {
    async getNewDialogUsers(req, res, next) {
        try {
            const users = await chatService.getNewDialogsUsers(req.params.userId);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async addNewDialog(req, res, next) {
        try {
            const {userId, receiverId} = req.body;
            const dialog = await chatService.addNewDialog(userId, receiverId);
            return res.json(dialog);
        } catch (e) {
            next(e);
        }
    }

    async getDialogs(req, res, next) {
        try {
            const dialogs = await chatService.getDialogs(req.params.userId);
            return res.json(dialogs);
        } catch (e) {
            next(e);
        }
    }

    async sendMessage(req, res, next) {
        try {
            const {sender_id, dialog_id, newMessageText} = req.body;
            const message = await chatService.sendMessage(sender_id, dialog_id, newMessageText)
            return res.json(message);
        } catch (e) {
            next(e);
        }
    }

    async getMessages(req, res, next) {
        try {
            const messages = await chatService.getMessages(req.params.dialogId);
            return res.json(messages);
        } catch (e) {
            next(e);
        }
    }

    async setMessagesReaded(req, res, next) {
        try {
            const {messages} = req.body;
            const updated = await chatService.setMessagesReaded(messages);
            return res.json(updated);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ChatController();