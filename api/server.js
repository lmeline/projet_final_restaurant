require('dotenv').config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./doc/swaggerOptions");

const app = express();
app.use(express.json());
const port = 3000;

// Importing routes and middlewares
const userRouter = require("./http/routes/users");
const menuRouter = require("./http/routes/menu");
const authRouter = require("./http/routes/auth");
const reservationRouter = require("./http/routes/reservations");
const tableRouter = require("./http/routes/tables");
const statistiqueRouter = require("./http/routes/statistiques");
const authMiddleware = require("./http/middlewares/auth");
const adminMiddleware = require("./http/middlewares/admin");

const { getRequiredTableSizes } = require("./utils/tableAssigner");
const { checkTablesAvailability } = require("./http/validators/tableValidator");

// Check the presence of the JWT_SECRET_KEY
if (!process.env.JWT_SECRET_KEY) {
  console.error("Missing JWT_SECRET_KEY environment variable");
  process.exit(1);
}

app.use("/auth", authRouter);

// Example of using middlewares, here Auth middleware check if the token is present THEN admin middleware check if the user is admin
app.use("/users", authMiddleware, adminMiddleware,  userRouter);


// Use of routes defined in /routes/reservations.js with /reservations prefix
app.use("/reservations", authMiddleware, reservationRouter);

// Use of routes defined in /routes/menu.js with /menu prefix
app.use("/menu", menuRouter);

// Use of routes defined in /routes/tables.js with /tables prefix
app.use("/tables", authMiddleware, adminMiddleware, tableRouter);

// Use of routes defined in /routes/statistiques.js with /statistiques prefix
app.use("/statistiques", authMiddleware, adminMiddleware, statistiqueRouter);

//Base Endpoint
app.get("/", (req, res) => {
  res.send({
    greetings: "Welcome to API Restaurant :)",
  });
});

// Generation de la doc
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// Server launch
app.listen(port, () => {
  console.log(`Express server launched, listening on ${process.env.DB_HOST}:${port}`);
});