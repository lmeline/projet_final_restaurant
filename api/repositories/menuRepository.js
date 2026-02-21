const db = require("./config/db");

class MenuRepository {
    pool = db;

    // Method to list all menu items with optional filters
    async listMenu(parsedParams) {
        let sqlQuery = "SELECT * FROM menu_items";
        let filters = [];
        let filtersValues = [];

        if (parsedParams.category) {
            filters.push(`category = ?`);
            filtersValues.push(parsedParams.category);
        }
        if (parsedParams["max-price"]) {
            filters.push(`price <= ?`);
            filtersValues.push(parsedParams["max-price"]);
        }

        if (filters.length > 0) {
            sqlQuery += " WHERE " + filters.join(" AND ") + ";";
        }

        const rows = await this.pool.query(sqlQuery, filtersValues);
        return rows;
    }
}

module.exports = new MenuRepository();