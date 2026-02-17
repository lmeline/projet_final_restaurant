require('dotenv').config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY;

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const payload = jwt.verify(token, SECRET_KEY);
        req.user = { id: payload.userId, username: payload.username, role: payload.role };
        next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }

}

module.exports = authMiddleware;
