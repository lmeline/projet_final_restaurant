/**
 * User entity (domain object, no SQL here — see repositories/UserRepository).
 */
class User {
    constructor({ id, firstname, lastname, phone, email, role, passwordHash = null }) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.phone = phone;
        this.email = email;
        this.role = role;
        this.passwordHash = passwordHash;
    }

    static fromRow(row) {
        return new User({
            id: row.id,
            firstname: row.firstname,
            lastname: row.lastname,
            phone: row.phone,
            email: row.email,
            role: row.role,
            passwordHash: row.password_hash ?? null,
        });
    }

    isAdmin() {
        return this.role === "admin";
    }

    toJSON() {
        return {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            phone: this.phone,
            email: this.email,
            role: this.role,
        };
    }
}

module.exports = User;
