require('dotenv').config();
const { verifyToken } = require("../../utils/jwtTokenManager");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const payload = verifyToken(token);
        req.user = { id: payload.userId, role: payload.role, email: payload.email };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authMiddleware;
