const db = require("./config/db");

class TableRepository {
    pool = db;
    async listTables() {
        const rows = await this.pool.query("SELECT * FROM `tables`;");
        return rows;
    }

    async createTable(capacity) {
        const [id] = await this.pool.query("INSERT INTO `tables` (seats) VALUES (?)", [capacity]);
        return id;
    }

    async getTable(id) {
        const [row] = await this.pool.query("SELECT * FROM `tables` WHERE id = ?", [id]);
        return row;
    }
}

module.exports = new TableRepository();