const db = require("./config/db");
const { getRequiredTableSizes } = require('../utils/tableAssigner');

class ReservationRepository {
  pool = db;

  // Method to list all reservations
  async listReservations(parsedParams) {
    let sqlQuery = "SELECT * FROM reservations";
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

    const rows = await this.pool.query(sqlQuery, filtersValues);
    return rows;
  }

  // Method to get a specific reservation by ID
  async getReservation(user_id) {
    const rows = await this.pool.query(
      "SELECT * FROM reservations WHERE user_id = ?",
      [user_id],
    );
    return rows;
  }

  // Method to create a new reservation
  async createReservation(user_id, number_of_people, date, time, note) {
      const connection = await this.pool.getConnection();
      
      try {
          await connection.beginTransaction();

          const [users] = await connection.query("SELECT id FROM users WHERE id = ?", [user_id]);
          if (users.length === 0) throw new Error("L'utilisateur n'existe pas.");

          // Vérification des doublons
          const [existing] = await connection.query(
              "SELECT id FROM reservations WHERE user_id = ? AND date = ? AND time = ? AND status != 'cancelled'",
              [user_id, date, time]
          );
          if (existing.length > 0) throw new Error("Vous avez déjà une réservation à cette heure-là.");

          // Algo d'affectation des tables
          const tableNeeds = getRequiredTableSizes(number_of_people);
          const tablesToReserve = [];
          const durationHours = "02:00:00"; 

          // Recherche de disponibilité réelle
          for (const [size, count] of Object.entries(tableNeeds)) {
              const [available] = await connection.query(`
                  SELECT id FROM tables 
                  WHERE seats = ? 
                  AND id NOT IN (
                      SELECT rt.table_id 
                      FROM reservation_tables rt
                      JOIN reservations r ON rt.reservation_id = r.id
                      WHERE r.date = ? 
                      AND r.status != 'cancelled'
                      AND r.time < ADDTIME(?, ?)
                      AND ADDTIME(r.time, ?) > ?
                  )
                  LIMIT ?`, 
                  [size, date, time, durationHours, durationHours, time, parseInt(count)]
              );

              if (available.length < count) {
                  throw new Error(`Plus de table de ${size} places disponible.`);
              }
              tablesToReserve.push(...available.map(t => t.id));
          }

          const [resRow] = await connection.query(
              "INSERT INTO reservations (number_of_people, date, time, status, user_id, comment) VALUES (?, ?, ?, ?, ?, ?)",
              [number_of_people, date, time, "pending", user_id, note]
          );
          
          const reservation_id = resRow.insertId;

          for (const table_id of tablesToReserve) {
              await connection.query(
                  "INSERT INTO reservation_tables (reservation_id, table_id) VALUES (?, ?)",
                  [reservation_id, table_id]
              );
          }

          await connection.commit();
          return { id: reservation_id, tablesAssigned: tablesToReserve };

      } catch (error) {
          await connection.rollback();
          throw error;
      } finally {
          connection.release();
      }
  }

  //Method to update a reservation by ID
  async updateReservation(id, updates, user_id) {
    const [reservation] = await this.pool.query(
      "SELECT * FROM reservations WHERE id = ?",
      [id],
    );
    if (reservation.length === 0) {
      throw new Error("Reservation not found");
    }
    if (reservation[0].user_id !== user_id) {
      throw new Error("Access denied");
    }
    if (reservation[0].status !== "pending") {
      throw new Error("Reservation is not pending");
    }

    const allowedFields = [
      "number_of_people",
      "date",
      "time",
      "comment",
      "status",
    ];
    const fields = Object.keys(updates).filter((field) =>
      allowedFields.includes(field),
    );

    if (fields.length === 0) {
      throw new Error("No valid fields provided for update");
    }

    const values = fields.map((field) => updates[field]);
    const setClause = fields.map((field) => `\`${field}\` = ?`).join(", ");

    const query = `UPDATE reservations SET ${setClause} WHERE id = ?`;
    values.push(id);

    const [result] = await this.pool.query(query, values);

    return result;
  }

  // Method to delete a reservation by ID
  async deleteReservation(id, user_id) {
    const [reservation] = await this.pool.query(
      "SELECT * FROM reservations WHERE id = ?",
      [id],
    );
    if (reservation.length === 0 || reservation[0].user_id !== user_id) {
      throw new Error("Reservation not found or access denied");
    }
    const rows = await this.pool.query(
      "DELETE FROM reservation_tables WHERE reservation_id = ?",
      [id],
    );
    const rows2 = await this.pool.query(
      "DELETE FROM reservations WHERE id = ?",
      [id],
    );
    return rows2;
  }

  // Method to validate a reservation by ID
  async validateReservation(id) {
    const [reservation] = await this.pool.query(
      "SELECT * FROM reservations WHERE id = ?",
      [id],
    );
    if (reservation.length === 0) {
      throw new Error("Reservation not found");
    }
    await this.pool.query(
      "UPDATE reservations SET status = 'confirmed' WHERE id = ?",
      [id],
    );
    return reservation;
  }
}

module.exports = new ReservationRepository();
