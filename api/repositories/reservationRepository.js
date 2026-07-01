const db = require("../config/db");
const Reservation = require("../models/Reservation");

const SELECT_WITH_TABLES = `
    SELECT r.*, GROUP_CONCAT(DISTINCT rt.table_id) AS tables_id
    FROM reservations r
    LEFT JOIN reservation_tables rt ON rt.reservation_id = r.id`;

class ReservationRepository {
    pool = db;

    async list(filters = {}) {
        let sql = SELECT_WITH_TABLES;
        const where = [];
        const values = [];

        if (filters.status) {
            where.push("r.status = ?");
            values.push(filters.status);
        }
        if (filters.date) {
            where.push("DATE(r.starts_at) = ?");
            values.push(filters.date);
        }

        if (where.length > 0) {
            sql += " WHERE " + where.join(" AND ");
        }
        sql += " GROUP BY r.id ORDER BY r.starts_at";

        const [rows] = await this.pool.query(sql, values);
        return rows.map(Reservation.fromRow);
    }

    async findByUser(userId) {
        const [rows] = await this.pool.query(
            `${SELECT_WITH_TABLES} WHERE r.user_id = ? GROUP BY r.id ORDER BY r.starts_at`,
            [userId]
        );
        return rows.map(Reservation.fromRow);
    }

    async findById(id) {
        const [rows] = await this.pool.query(
            `${SELECT_WITH_TABLES} WHERE r.id = ? GROUP BY r.id`,
            [id]
        );
        return rows.length ? Reservation.fromRow(rows[0]) : null;
    }

    async existsForUserAt(userId, startsAt) {
        const [rows] = await this.pool.query(
            `SELECT id FROM reservations
             WHERE user_id = ? AND starts_at = ? AND status <> 'cancelled'`,
            [userId, startsAt]
        );
        return rows.length > 0;
    }

    /**
     * Create a reservation and its table links in a single transaction.
     * @returns the inserted reservation id.
     */
    async create({ slotId, userId, numberOfPeople, startsAt, endsAt, comment, tableIds }) {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `INSERT INTO reservations
                    (slot_id, user_id, number_of_people, starts_at, ends_at, status, comment)
                 VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
                [slotId, userId, numberOfPeople, startsAt, endsAt, comment ?? null]
            );

            const reservationId = result.insertId;
            await this.#insertTableLinks(connection, reservationId, tableIds);

            await connection.commit();
            return reservationId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Update a reservation. When `tableIds` is provided, the table links are
     * fully replaced. The whole thing runs in a transaction.
     */
    async update(id, { numberOfPeople, startsAt, endsAt, slotId, comment }, tableIds = null) {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();

            if (tableIds) {
                await connection.query(
                    "DELETE FROM reservation_tables WHERE reservation_id = ?",
                    [id]
                );
                await this.#insertTableLinks(connection, id, tableIds);
            }

            await connection.query(
                `UPDATE reservations
                 SET number_of_people = ?, starts_at = ?, ends_at = ?, slot_id = ?, comment = ?
                 WHERE id = ?`,
                [numberOfPeople, startsAt, endsAt, slotId, comment ?? null, id]
            );

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async cancel(id) {
        const [result] = await this.pool.query(
            "UPDATE reservations SET status = 'cancelled', cancelled_at = NOW() WHERE id = ?",
            [id]
        );
        return result.affectedRows;
    }

    async confirm(id) {
        const [result] = await this.pool.query(
            "UPDATE reservations SET status = 'confirmed' WHERE id = ?",
            [id]
        );
        return result.affectedRows;
    }

    async #insertTableLinks(connection, reservationId, tableIds) {
        for (const tableId of tableIds) {
            const [result] = await connection.query(
                "INSERT INTO reservation_tables (reservation_id, table_id) VALUES (?, ?)",
                [reservationId, tableId]
            );
            if (result.affectedRows !== 1) {
                throw new Error("Failed to link reservation to table " + tableId);
            }
        }
    }
}

module.exports = new ReservationRepository();
