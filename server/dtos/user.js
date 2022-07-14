module.exports = class UserDTO {
    id;
    first_name;
    last_name;
    email;
    is_admin;
    is_blocked;
    admin;

    constructor(model) {
        this.id = model.id;
        this.first_name = model.first_name;
        this.last_name = model.last_name;
        this.email = model.email;
        this.is_admin = model.is_admin;
        this.is_blocked = model.is_blocked;
        this.admin_id = model.admin_id;
    }
}