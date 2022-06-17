module.exports = class UserDTO {
    id;
    first_name;
    last_name;
    email;

    constructor(model) {
        this.id = model.id;
        this.first_name = model.first_name;
        this.last_name = model.last_name;
        this.email = model.email;
    }
}