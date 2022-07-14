module.exports = class DialogDTO {
    id;
    created_at;
    user_id;
    receiver_id;
    receiver_name;
    last_message = "";
    missed_messages;
    online;

    constructor(model, userId, receiverId, receiver_name, last_message, missed_messages) {
        this.id = model.id;
        this.created_at = model.created_at
        this.user_id = userId;
        this.receiver_id = receiverId;
        this.receiver_name = receiver_name;
        if (last_message) {
            this.last_message = last_message.text;
        }
        this.missed_messages = missed_messages;
        this.online = false;
    }
}