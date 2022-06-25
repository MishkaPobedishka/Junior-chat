import api from "../http";

export default class ChatService {
    static async getDialogs() {
        return api.post('/dialogs')
    }
}