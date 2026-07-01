const eventBus = require("../../../eventBus");

function loggerMiddleware(req, res, next) {
    eventBus.emit("route:access", {
        endpoint: req.baseUrl,
        method: req.method,
        email: req.user ? req.user.email : null,
        ip: req.ip,
    });
    next();
}

module.exports = loggerMiddleware;
