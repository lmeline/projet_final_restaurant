const db = require("../config/db");
const MenuItem = require("../models/MenuItem");

class MenuRepository {
    pool = db;

    async list(filters = {}) {
        let sql = "SELECT * FROM menu_items";
        const where = [];
        const values = [];

        if (filters.category) {
            where.push("category = ?");
            values.push(filters.category);
        }
        if (filters["max-price"] !== undefined) {
            where.push("price_cents <= ?");
            values.push(filters["max-price"]);
        }

        if (where.length > 0) {
            sql += " WHERE " + where.join(" AND ");
        }

        const [rows] = await this.pool.query(sql, values);
        return rows.map(MenuItem.fromRow);
    }
}

module.exports = new MenuRepository();
