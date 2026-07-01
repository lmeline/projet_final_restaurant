require('dotenv').config();
require('../log/logger');
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./doc/swaggerOptions");

const app = express();
app.use(express.json());
const port = 3000;

const userRouter = require("./http/routes/users");
const menuRouter = require("./http/routes/menu");
const authRouter = require("./http/routes/auth");
const reservationRouter = require("./http/routes/reservations");
const tableRouter = require("./http/routes/tables");
const statistiqueRouter = require("./http/routes/statistiques");
const authMiddleware = require("./http/middlewares/auth");
const adminMiddleware = require("./http/middlewares/admin");
const loggerMiddleware = require("./http/middlewares/log");

if (!process.env.JWT_SECRET_KEY) {
  console.error("Missing JWT_SECRET_KEY environment variable");
  process.exit(1);
}

app.use("/auth", loggerMiddleware, authRouter);
app.use("/users", authMiddleware, adminMiddleware, loggerMiddleware, userRouter);
app.use("/reservations", authMiddleware, loggerMiddleware, reservationRouter);
app.use("/menu", loggerMiddleware, menuRouter);
app.use("/tables", authMiddleware, adminMiddleware, loggerMiddleware, tableRouter);
app.use("/statistics", authMiddleware, adminMiddleware, loggerMiddleware, statistiqueRouter);

app.get("/", (req, res) => {
  res.send({
    greetings: "Welcome to API Restaurant :)",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

app.listen(port, () => {
  console.log(`Express server launched, listening on ${process.env.DB_HOST}:${port}`);
});
