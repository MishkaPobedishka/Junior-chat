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

    static async getAdminUsers(userId) {
        return api.get('/admin/' + userId);
    }

    static async blockUser(adminId, userId, blockStatus) {
        return api.patch('/admin', {adminId, userId, blockStatus})
    }

    static async getBlockInfo(adminId) {
        return api.get('/blocked/' + adminId);
    }

    static async deleteUser(userId) {
        return api.delete('/admin/' + userId)
    }
}