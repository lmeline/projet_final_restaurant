const db = require("../config/db");
const User = require("../models/User");

class UserRepository {
    pool = db;

    async listClients() {
        const [rows] = await this.pool.query(
            `SELECT id, firstname, lastname, phone, email, role
             FROM users
             WHERE role = 'client'`
        );
        return rows.map(User.fromRow);
    }

    async findByEmail(email) {
        const [rows] = await this.pool.query(
            `SELECT id, firstname, lastname, phone, email, password_hash, role
             FROM users
             WHERE email = ?`,
            [email]
        );
        return rows.length ? User.fromRow(rows[0]) : null;
    }

    async create({ firstname, lastname, email, phone, passwordHash }) {
        const [result] = await this.pool.query(
            `INSERT INTO users (firstname, lastname, email, phone, password_hash)
             VALUES (?, ?, ?, ?, ?)`,
            [firstname, lastname, email, phone ?? null, passwordHash]
        );
        return result.insertId;
    }
}

module.exports = new UserRepository();
