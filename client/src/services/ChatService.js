import api from "../http";

export default class ChatService {
    static async fetchChats() {
        return api.get('/chats')
    }
}