const db = require("../config/db");

class StatRepository {
    pool = db;

    async getGlobalStats() {
        const [rows] = await this.pool.query(
            `SELECT
                COUNT(*) AS total_reservations,
                SUM(CASE WHEN status <> 'cancelled' THEN number_of_people ELSE 0 END) AS total_guests,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS total_cancelled,
                IFNULL(ROUND((SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2), 0) AS cancellation_rate
             FROM reservations`
        );
        return rows[0];
    }

    async getClientsPerDay() {
        const [rows] = await this.pool.query(
            `SELECT DATE(starts_at) AS date, SUM(number_of_people) AS daily_guests
             FROM reservations
             WHERE status <> 'cancelled'
             GROUP BY DATE(starts_at)
             ORDER BY date DESC
             LIMIT 7`
        );
        return rows;
    }

    async getPeakHours() {
        const [rows] = await this.pool.query(
            `SELECT TIME(starts_at) AS time, COUNT(*) AS reservation_count
             FROM reservations
             WHERE status <> 'cancelled'
             GROUP BY TIME(starts_at)
             ORDER BY reservation_count DESC
             LIMIT 3`
        );
        return rows;
    }
}

module.exports = new StatRepository();
