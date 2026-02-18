const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY;

function generateToken(userId, role) {
    return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: "1h" });
}

function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
}


module.exports = { generateToken, verifyToken };