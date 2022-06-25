const chatService = require("../service/chat");


class ChatController {
    async getDialogs(req, res, next) {
        try {
            const {id} = req.body
            const dialogs = await chatService.getDialogs(id);
            return res.json(dialogs);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ChatController();