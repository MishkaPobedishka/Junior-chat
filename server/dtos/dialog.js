module.exports = class DialogDTO {
    id;
    created_at
    user_id;
    receiver_id
    last_message;
    missed_messages;

    constructor(model, userId, receiverId, last_message, missed_messages) {
        this.id = model.id;
        this.created_at = model.created_at
        this.user_id = userId;
        this.receiver_id = receiverId;
        this.last_message = last_message;
        this.missed_messages = missed_messages;
    }
}