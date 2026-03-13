const db = require("./config/db");

class TableRepository {
    pool = db;

    // Method to list all tables
    async listTables() {
        const rows = await this.pool.query("SELECT * FROM `tables`;");
        return rows;
    }

    // Method to create a new table
    async createTable(capacity) {
        const [id] = await this.pool.query("INSERT INTO `tables` (seats) VALUES (?)", [capacity]);
        return id;
    }

    // Method to get a specific table by ID
    async getTable(id) {
        const [row] = await this.pool.query("SELECT * FROM `tables` WHERE id = ?", [id]);
        return row;
    }
  
  async getAvailableTables(date, time, reservation_id = null) {

    const [rows] = await this.pool.query(`
        SELECT 
          t.id,
          t.seats
        FROM 
          tables t
        WHERE
          t.id NOT IN (
            SELECT rt.table_id FROM reservation_tables rt
            JOIN reservations r ON rt.reservation_id = r.id
            WHERE r.date = ?
            AND r.status != 'cancelled'
            AND r.time BETWEEN ? and ADDTIME(?, '2:00:00')
            AND r.id != ?
          )`,
        [date, time, time, reservation_id]
      );

      return rows;
    }

    async deleteTable(id) {
      try {
        const [result] = await this.pool.query(`
          DELETE t FROM tables t
          LEFT JOIN reservation_tables rt ON t.id = rt.table_id
          LEFT JOIN reservations r ON rt.reservation_id = r.id
          WHERE t.id = ? 
          AND (
              r.id IS NULL
              OR 
              CONCAT(r.date, ' ', r.time) < NOW()
          );
        `,[id]
        );

        return result;
      } catch (error) {
        throw error;
      }
    }
    
}

module.exports = new TableRepository();