const db = require("../config/db");
const OpeningSlot = require("../models/OpeningSlot");

class OpeningSlotRepository {
    pool = db;

    /**
     * Return the available opening slot that covers the given datetime, i.e. the
     * service the restaurant is open for at that moment, or null if closed.
     * `datetime` must be a "YYYY-MM-DD HH:MM:SS" string.
     */
    async findCovering(datetime) {
        const [rows] = await this.pool.query(
            `SELECT *
             FROM opening_slots
             WHERE available = 1
               AND ? >= date_time
               AND ? < DATE_ADD(date_time, INTERVAL duration MINUTE)
             LIMIT 1`,
            [datetime, datetime]
        );
        return rows.length ? OpeningSlot.fromRow(rows[0]) : null;
    }
}

module.exports = new OpeningSlotRepository();
