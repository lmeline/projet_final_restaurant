const db = require("./config/db");

class UserRepository {
    pool = db;

    // Method to list all users
    async listUser() {
        const rows = await this.pool.query("SELECT * FROM users");
        return rows;
    }

    // Method to get a specific user by email
    async getUserByEmail(email) {
        const [row] = await this.pool.query(`
            SELECT *
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