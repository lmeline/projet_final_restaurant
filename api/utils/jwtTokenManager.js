require('dotenv').config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY;

function generateToken(userId, role, email) {
    return jwt.sign({ userId, role, email }, SECRET_KEY, { expiresIn: "1h" });
}

function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };
