const db = require("./config/db");

class ReservationRepository {
  pool = db;

  // Method to list all reservations
  async listReservations(parsedParams) {
    let sqlQuery = `SELECT
      r.*,
      group_concat(DISTINCT t.id) as tables_id
    FROM reservations r
    LEFT JOIN reservation_tables rt ON rt.reservation_id = r.id
    LEFT JOIN \`tables\` t ON rt.table_id = t.id`;
    let filters = [];
    let filtersValues = [];

    if (parsedParams.status) {
            filters.push("status = ?");
            filtersValues.push(parsedParams.status);
    }
    if (parsedParams.date) {
            filters.push("date = ?");
            const dateValue = (parsedParams.date instanceof Date) 
            ? parsedParams.date.toISOString().split('T')[0] 
            : parsedParams.date;
            filtersValues.push(dateValue); 
    }

    if (filters.length > 0) {
      sqlQuery += " WHERE " + filters.join(" AND ") + ";";
    }
    
    sqlQuery += " GROUP BY r.id";

    const rows = await this.pool.query(sqlQuery, filtersValues);
    return rows;
  }

  // Method to get reservations for a user
  async getReservationsForUser(user_id) {
    const [rows] = await this.pool.query(
      `SELECT
        r.*,
        group_concat(DISTINCT t.id) as tables_id
      FROM reservations r
      LEFT JOIN reservation_tables rt ON rt.reservation_id = r.id
      LEFT JOIN \`tables\` t ON rt.table_id = t.id
      WHERE r.user_id = ?
      GROUP BY r.id`,
      [user_id],
    );

    return rows;
  }

  // Method to create a new reservation
  async createReservation(user_id, number_of_people, date, time, note, assignedTables) {
    const connection = await this.pool.getConnection();
    
    try {
        await connection.beginTransaction();
        // 1. Vérifications de base 
        const [users] = await connection.query("SELECT id FROM users WHERE id = ?", [user_id]);

        if (users.length === 0) {
          let err = new Error("User does not exist.");
          err.status = 404
          throw err;
        }
        

        const [existing] = await connection.query(
            "SELECT id FROM reservations WHERE user_id = ? AND date = ? AND time = ? AND status != 'cancelled'",
            [user_id, date, time]
        );
        if (existing.length > 0) {
          let err = new Error("User already have a reservation at this time.");
          err.status = 409;
          throw err;
        }

        // Insérer la réservation
        const [resRow] = await connection.query(
            "INSERT INTO reservations (number_of_people, date, time, status, user_id, comment) VALUES (?, ?, ?, ?, ?, ?)",
            [number_of_people, date, time, "pending", user_id, note]
        );
      
        if (!resRow.insertId) throw new Error("Failed to create reservation.");

      for (const table of assignedTables) {
          const [result] = await connection.query(
                "INSERT INTO reservation_tables (reservation_id, table_id) VALUES (?, ?)",
                [resRow.insertId, table.id]
            );
            if (result.affectedRows != 1) throw new Error("Failed to create reservation..");
        }

        await connection.commit();
        return { id: resRow.insertId };

      } catch (error) {
          await connection.rollback();
          throw error;
      } finally {
          connection.release();
      }
  }

  //Method to update a reservation by ID
  async updateReservation(id, newReservation, assignedTables = null) {
    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      if (assignedTables) {
        
        await connection.query(
          "DELETE FROM reservation_tables WHERE reservation_id = ?",
          [id]
        )
  
        for (const table of assignedTables) {
          const [result] = await connection.query(
            "INSERT INTO reservation_tables (reservation_id, table_id) VALUES (?, ?)",
            [id, table.id]
          );
          if (result.affectedRows != 1) throw new Error("Failed to update reservation.");
        }
      }

      const [result] = await connection.query(
        `UPDATE reservations 
        SET number_of_people = ?, date = ?, time = ?, comment = ?
        WHERE id = ?`,
        [newReservation.number_of_people, newReservation.date, newReservation.time, newReservation.note, id]
      )

      if (result.affectedRows != 1) throw new Error("Failed to update reservation.")
      
      await connection.commit();
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Method to delete a reservation by ID
  async deleteReservation(id) {
      const result = await this.pool.query(
        "UPDATE reservations SET status = 'cancelled' WHERE id = ?",
        [id],
      );
    
      return result
  }

  // Method to validate a reservation by ID
  async validateReservation(id) {
    let [reservation] = await this.pool.query(
      "SELECT * FROM reservations WHERE id = ?",
      [id],
    );

    if (reservation.length === 0) {
      let err = new Error("Reservation does not exist.");
      err.status = 404
      throw err;
    }

    const [result] = await this.pool.query(
      "UPDATE reservations SET status = 'confirmed' WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 1) {
      reservation[0].status = "confirmed";
    }
  
    return reservation;
  }
  
  async checkOpenSlotAvailability(date, time) {
    const [slot] = await this.pool.query(
      `select 
        IF(COUNT(os.id) > 0, 1, 0) as availability
      from opening_slots os
      where 
        TIMESTAMP(?, ?) BETWEEN os.date_time and DATE_ADD(os.date_time, INTERVAL os.duration MINUTE)`,
      [date, time])
    
    return slot[0].availability === 1;
  }
  
  async getReservationById(id) {
    const [reservation] = await this.pool.query(
      `SELECT
        r.*,
        group_concat(DISTINCT t.id) as tables_id
      FROM reservations r
      LEFT JOIN reservation_tables rt ON rt.reservation_id = r.id
      LEFT JOIN \`tables\` t ON rt.table_id = t.id
      WHERE r.id = ?
      GROUP BY r.id`,
      [id],
    );

    return reservation;
  }
  
  
}

module.exports = new ReservationRepository();
