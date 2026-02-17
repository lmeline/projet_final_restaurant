const db = require("./config/db");

class UserRepository {
    pool = db;

    async listUser() {
        const rows = await this.pool.query("SELECT * FROM users");
        return rows;
    }

    async getUserByEmail(email) {
        const [row] = await this.pool.query(`
            SELECT *
            FROM users 
            WHERE email = ?`, 
            [email]
        );
        return row;
    }

    async createUser(firstname, lastname, email, phone, password_hash) {
        const [id] = await this.pool.query(`
            INSERT INTO users (firstname, lastname, email, phone, password_hash) VALUES 
            (?, ?, ?, ?, ?)`, 
            [firstname, lastname, email, phone, password_hash]
        );

        return id;
    }

    async updateUser(id) {
        throw new Error("Method not implemented.");
    }

    async deleteUser(id) {
        throw new Error("Method not implemented.");
    }
}

module.exports = new UserRepository();