const db = require("../config/db");
const DiningTable = require("../models/DiningTable");

class TableRepository {
    pool = db;

    async list() {
        const [rows] = await this.pool.query("SELECT * FROM dining_tables");
        return rows.map(DiningTable.fromRow);
    }

    async create({ seats, label = null }) {
        const [result] = await this.pool.query(
            "INSERT INTO dining_tables (seats, label) VALUES (?, ?)",
            [seats, label]
        );
        return result.insertId;
    }

    async findById(id) {
        const [rows] = await this.pool.query(
            "SELECT * FROM dining_tables WHERE id = ?",
            [id]
        );
        return rows.length ? DiningTable.fromRow(rows[0]) : null;
    }

    /**
     * Return the active tables that are free on the [startsAt, endsAt[ interval.
     * Two reservations conflict on a table when their time intervals overlap:
     *   r.starts_at < endsAt AND r.ends_at > startsAt
     * When updating an existing reservation, pass its id to exclude it.
     */
    async findAvailable(startsAt, endsAt, excludeReservationId = null) {
        let sql = `
            SELECT t.id, t.seats
            FROM dining_tables t
            WHERE t.is_active = 1
              AND t.id NOT IN (
                  SELECT rt.table_id
                  FROM reservation_tables rt
                  JOIN reservations r ON rt.reservation_id = r.id
                  WHERE r.status NOT IN ('cancelled', 'no_show')
                    AND r.starts_at < ?
                    AND r.ends_at > ?`;
        const values = [endsAt, startsAt];

        if (excludeReservationId != null) {
            sql += " AND r.id <> ?";
            values.push(excludeReservationId);
        }

        sql += `
              )
            ORDER BY t.seats`;

        const [rows] = await this.pool.query(sql, values);
        return rows.map(DiningTable.fromRow);
    }
}

module.exports = new TableRepository();
