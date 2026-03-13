const db = require("./config/db");

class UserRepository {
    pool = db;

    // Method to list all users
    async listUser() {
        const rows = await this.pool.query("SELECT id, firstname, lastname, phone, email, role FROM users where role = 'client'");
        return rows;
    }

    // Method to get a specific user by email
    async getUserByEmail(email) {
        const [row] = await this.pool.query(`
            SELECT id, firstname, lastname, phone, email, role 
            FROM users 
            WHERE email = ?`, 
            [email]
        );
        return row;
    }

    // Method to get a specific user by ID
    async createUser(firstname, lastname, email, phone, password_hash) {
        const [id] = await this.pool.query(`
            INSERT INTO users (firstname, lastname, email, phone, password_hash) VALUES 
            (?, ?, ?, ?, ?)`, 
            [firstname, lastname, email, phone, password_hash]
        );

        return id;
    }

}

module.exports = new UserRepository();