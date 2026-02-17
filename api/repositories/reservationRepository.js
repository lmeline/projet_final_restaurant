const db = require("./config/db");


class ReservationRepository {
    pool = db;

    // Method to list all reservations
    async listReservations() {
        const rows = await this.pool.query("SELECT * FROM reservations");
        return rows;
    }

    // Method to get a specific reservation by ID
    async getReservation(user_id) {
        const rows = await this.pool.query("SELECT * FROM reservations WHERE user_id = ?", [user_id]);
        return rows;
    }


    // TODO : If possible, get user_id from token instead of getting it from the request body  
    async createReservation(user_id, number_of_people, date, time, note) {

        // Check if user_id is not null and if the id exists in the database
        const user = await this.pool.query("SELECT * FROM users WHERE id = ?", [user_id]);
        if (!user_id || user.length === 0) {
            throw new Error("user_id is required and must exist in the database");
        }

        //Check if the user already has a reservation for the same date and time
        const [existingReservation] = await this.pool.query(
            "SELECT * FROM reservations WHERE user_id = ? AND date = ? AND time = ?",
            [user_id, date, time]
        );

        if (existingReservation.length > 0) {
            throw new Error("User already has a reservation for this date and time");
        }

        //Check if  the number of people is greater than 0 or date and time are in the past
        if (number_of_people <= 0) {
            throw new Error("Number of people must be greater than 0");
        }
        if (new Date(`${date}T${time}`) < new Date()) {
            throw new Error("Date and time must be in the future");
        }

        // Check if the restaurant is already fully booked for the given date and time 
        const openingSlot = await this.pool.query(
            "SELECT available FROM opening_slots WHERE date_time = ?",
            [date + "T" + time]
        );

        if (openingSlot.length === 0 || openingSlot[0].available <= 0) {
            throw new Error("Restaurant is fully booked for the given date and time");
        }

        // Check if the total number of people is greater than the available seats for the given date and time
        const totalPeople = await this.pool.query(
            "SELECT SUM(number_of_people) as total FROM reservations WHERE date = ? AND time = ?",
            [date, time]
        );
        const totalSeats = await this.pool.query(
            "SELECT SUM(seats) as total FROM tables"
        );
        if (totalPeople[0].total + number_of_people > totalSeats[0].total) {
            throw new Error("Not enough available seats for the given date and time");
        }

        // Insert the new reservation into the database
        const [rows] = await this.pool.query(
            "INSERT INTO reservations (number_of_people, date, time, status, user_id, comment) VALUES (?, ?, ?, ?, ?, ?)",
            [number_of_people, date, time, "pending", user_id, note]
        );


        // Insert the reservation into the reservation_tables table to link it with a table
        const reservation_id = rows.insertId;
        const [tables] = await this.pool.query(
            "SELECT id FROM tables WHERE seats >= ? ORDER BY seats ASC",
            [number_of_people]
        );
        if (tables.length > 0) {
            const table_id = tables[0].id;
            await this.pool.query(
                "INSERT INTO reservation_tables (reservation_id, table_id) VALUES (?, ?)",
                [reservation_id, table_id]
            );
        }

        return rows[0];
    }

    //Method to update a reservation by ID
    async updateReservation(id, updates, user_id) {
        const [reservation] = await this.pool.query("SELECT * FROM reservations WHERE id = ?", [id]);
        if (reservation.length === 0) {
            throw new Error("Reservation not found");
        }
        if (reservation[0].user_id !== user_id) {
            throw new Error("Access denied");
        }
        if (reservation[0].status !== "pending") {
            throw new Error("Reservation is not pending");
        }

        const allowedFields = ["number_of_people", "date", "time", "comment", "status"];
        const fields = Object.keys(updates).filter(field => allowedFields.includes(field));

        if (fields.length === 0) {
            throw new Error("No valid fields provided for update");
        }

        const values = fields.map(field => updates[field]);
        const setClause = fields.map(field => `\`${field}\` = ?`).join(", "); 
        
        const query = `UPDATE reservations SET ${setClause} WHERE id = ?`;
        values.push(id);

        const [result] = await this.pool.query(query, values);
        
        return result;
    }


    // Method to delete a reservation by ID
    async deleteReservation(id, user_id) {
        const [reservation] = await this.pool.query("SELECT * FROM reservations WHERE id = ?", [id]);
        if (reservation.length === 0 || reservation[0].user_id !== user_id) {
            throw new Error("Reservation not found or access denied");
        }
        const rows = await this.pool.query("DELETE FROM reservation_tables WHERE reservation_id = ?", [id]);
        const rows2 = await this.pool.query("DELETE FROM reservations WHERE id = ?", [id]);
        return rows2;
    }

    // Method to validate a reservation by ID
    async validateReservation(id) {
        const [reservation] = await this.pool.query("SELECT * FROM reservations WHERE id = ?", [id]);
        if (reservation.length === 0) {
            throw new Error("Reservation not found");
        }
        await this.pool.query("UPDATE reservations SET status = 'confirmed' WHERE id = ?", [id]);
        return reservation;
    }
}

module.exports = new ReservationRepository();