module.exports = class UpdateResultDTO {
    id;
    text;

    constructor(objectId, objectName, objectField, objectValue) {
        this.id = objectId;
        this.text = `У ${objectName} значение поля ${objectField} установление значение ${objectValue}`
    }
}