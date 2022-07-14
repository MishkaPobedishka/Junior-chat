module.exports = class DeleteResultDTO {
    id;
    text;

    constructor(objectId) {
        this.id = objectId;
        this.text = `Объект ${objectId} был успешно удален`
    }
}