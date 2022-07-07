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
}