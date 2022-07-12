import api from "../http";

export default class ChatService {
    static async getDialogs(userId) {
        return api.get('/dialogs/' + userId)
    }

    static async getMessages(dialogId) {
        return api.get('/messages/' + dialogId);
    }

    static async sendMessage(sender_id, dialog_id, newMessageText) {
        return api.post('/messages', {sender_id, dialog_id, newMessageText});
    }

    static async setMessageReaded(messages) {
        return api.patch('/messages', {messages})
    }

    static async getNewDialogUsers(userId) {
        return api.get('/dialogs/new/' + userId);
    }

    static async addNewDialog(userId, receiverId) {
        return api.post('/dialogs/new', {userId, receiverId})
    }
}