const db = require("./config/db");

class UserRepository {
    pool = db;

    async listUser() {
        const rows = await this.pool.query("SELECT * FROM users");
        return rows;
    }

    async getUser(id) {
        throw new Error("Method not implemented.");
    }

    async createUser() {
        throw new Error("Method not implemented.");
    }

    async updateUser(id) {
        throw new Error("Method not implemented.");
    }

    async deleteUser(id) {
        throw new Error("Method not implemented.");
    }
}

module.exports = new UserRepository();