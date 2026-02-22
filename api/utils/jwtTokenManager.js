require('dotenv').config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Function to generate a JWT token for a given user ID and role
function generateToken(userId, role, email) {
    return jwt.sign({ userId, role, email }, SECRET_KEY, { expiresIn: "1h" });
}

// Function to verify a JWT token and return the decoded payload
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };