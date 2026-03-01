const db = require("./config/db");

class StatRepository {
    constructor(pool) {
        this.pool = pool;
    }

    // Method to get global statistics
    async getGlobalStats() {
        const query = `
            SELECT 
                COUNT(*) as total_reservations,
                SUM(CASE WHEN status != 'cancelled' THEN number_of_people ELSE 0 END) as total_guests,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as total_cancelled,
                IFNULL(ROUND((SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2), 0) as cancellation_rate
            FROM reservations`;
        const [rows] = await this.pool.query(query);
        return rows[0];
    }

    // Method to get number of clients per day
    async getClientsPerDay() {
        const query = `
            SELECT date, SUM(number_of_people) as daily_guests
            FROM reservations
            WHERE status != 'cancelled'
            GROUP BY date
            ORDER BY date DESC
            LIMIT 7`; 
        const [rows] = await this.pool.query(query);
        return rows;
    }

    // Method to get peak hours
    async getPeakHours() {
        const query = `
            SELECT time, COUNT(*) as reservation_count
            FROM reservations
            WHERE status != 'cancelled'
            GROUP BY time
            ORDER BY reservation_count DESC
            LIMIT 3`;
        const [rows] = await this.pool.query(query);
        return rows;
    }
}

module.exports = StatRepository;