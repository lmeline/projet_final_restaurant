const db = require("./config/db");

class MenuRepository {
    pool = db;
    async listMenu() {
        const rows = await this.pool.query("SELECT * FROM menu_items");
        return rows;
    }
}

module.exports = new MenuRepository();